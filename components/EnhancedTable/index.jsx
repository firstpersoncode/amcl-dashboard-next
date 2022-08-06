import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from "@mui/material";
import EnhancedTableToolbar from "./EnhanchedTableToolbar";
import EnhancedTableHead from "./EnhanchedTableHead";
import Loader from "./Loader";
import cleanObj from "./utils/cleanObj";
import Detail from "./Detail";
import Create from "./Create";

export default function EnhancedTable({ title, type, cells, filter }) {
  const [orderBy, setOrderBy] = useState("updatedAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const timeout = useRef();

  const fetchRows = useCallback(() => {
    if (timeout.current) clearTimeout(timeout.current);

    timeout.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await axios.post("/api/" + type + "/read", {
          take: rowsPerPage,
          skip: page * rowsPerPage,
          orderBy,
          order,
          filter: cleanObj(filter),
        });
        setRows(res.data);

        // console.log(res.data);

        const c = await axios.post("/api/" + type + "/count", {
          filter: cleanObj(filter),
        });
        setCount(c.data.count);
      } catch (err) {
        console.error(err);
      }

      setIsLoading(false);
    }, 500);
  }, [type, order, orderBy, page, rowsPerPage, filter]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - count) : 0;

  const [selectedDetail, setSelectedDetail] = useState();

  const handleSelectDetail = (detail) => (e) => {
    e.stopPropagation();
    setSelectedDetail(detail);
  };

  const removeSelectedDetail = () => {
    setSelectedDetail();
  };

  const [openAdd, setOpenAdd] = useState(false);
  const handloggleAdd = () => {
    setOpenAdd(!openAdd);
  };

  return (
    <>
      <Box sx={{ width: "100%", mt: 2 }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          {isLoading && <Loader />}
          <EnhancedTableToolbar
            title={title}
            count={count}
            fetchRows={fetchRows}
          />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} size="medium">
              <EnhancedTableHead
                type={type}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                onAdd={handloggleAdd}
                rowCount={count}
                headCells={cells.map((cell) => {
                  let id = cell;
                  let label = cell;

                  if (typeof cell === "function") {
                    id = cell().id;
                    label = cell().label;
                  }

                  return {
                    id,
                    disablePadding: false,
                    label,
                  };
                })}
              />
              <TableBody>
                {rows.map((row, index) => {
                  return (
                    <TableRow
                      sx={{
                        opacity: row?.archived ? "0.5" : "1",
                        cursor: "pointer",
                      }}
                      key={index}
                      hover
                      onClick={handleSelectDetail(row?.idString)}
                      role="checkbox"
                      tabIndex={-1}
                    >
                      {cells.map((cell, i) => {
                        if (typeof cell === "function")
                          return (
                            <TableCell key={i}>{cell(row).value}</TableCell>
                          );

                        return (
                          <TableCell key={i}>{String(row[cell])}</TableCell>
                        );
                      })}
                      <TableCell align="right">
                        <Button
                          size="small"
                          color="primary"
                          onClick={handleSelectDetail(row?.idString)}
                        >
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      <Create
        type={type}
        open={openAdd}
        onClose={handloggleAdd}
        fetchRows={fetchRows}
      />

      <Detail
        type={type}
        detail={selectedDetail}
        open={Boolean(selectedDetail)}
        onClose={removeSelectedDetail}
        fetchRows={fetchRows}
      />
    </>
  );
}
