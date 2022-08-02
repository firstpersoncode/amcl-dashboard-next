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
  headCells,
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
        <TableCell align="right">
          <IconButton size="small" color="primary">
            <Add />
          </IconButton>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
