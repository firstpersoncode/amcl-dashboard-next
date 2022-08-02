import {
  Button,
  IconButton,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";

import { Add } from "@mui/icons-material";

export default function EnhancedTableHead({
  order,
  orderBy,
  onRequestSort,
  onAdd,
  headCells,
  type,
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
        {type !== "qrcode" && (
          <TableCell align="right">
            <IconButton size="small" color="primary" onClick={onAdd}>
              <Add />
            </IconButton>
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  );
}
