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

export default function EnhancedTable({ title, type, cells, filter }) {
  const [orderBy, setOrderBy] = useState("updatedAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);

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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.idString);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

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

  return (
    <>
      <Box sx={{ width: "100%", mt: 2 }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          {isLoading && <Loader />}
          <EnhancedTableToolbar
            numSelected={selected.length}
            title={title}
            count={count}
            fetchRows={fetchRows}
          />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} size="medium">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
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
                  const isItemSelected = isSelected(row.idString);

                  return (
                    <TableRow
                      sx={{ opacity: row.archived ? "0.5" : "1" }}
                      key={index}
                      hover
                      onClick={(event) => handleClick(event, row.idString)}
                      role="checkbox"
                      tabIndex={-1}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox color="primary" checked={isItemSelected} />
                      </TableCell>
                      {cells.map((cell, i) => {
                        if (typeof cell === "function")
                          return (
                            <TableCell key={i}>
                              {String(cell(row).value)}
                            </TableCell>
                          );

                        return (
                          <TableCell key={i}>{String(row[cell])}</TableCell>
                        );
                      })}
                      <TableCell align="right">
                        <Button
                          size="small"
                          color="primary"
                          onClick={handleSelectDetail(row.idString)}
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
