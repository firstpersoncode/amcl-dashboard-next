import { useState } from "react";
import { format } from "date-fns";
import { Tooltip } from "@mui/material";
import { Block, Done } from "@mui/icons-material";
import EnhancedTable from "components/EnhancedTable";
import Filter from "./Filter";

export default function School() {
  const [filter, setFilter] = useState({});

  const onChangeFilter = (name) => (e) => {
    if (name === "search") {
      if (e.target.value) {
        setFilter((v) => ({
          ...v,
          search: {
            value: e.target.value,
            OR: [
              {
                idString: {
                  contains: e.target.value,
                  mode: "insensitive",
                },
              },
              {
                name: {
                  contains: e.target.value,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: e.target.value,
                  mode: "insensitive",
                },
              },
            ],
          },
        }));
      } else {
        setFilter((v) => ({
          ...v,
          search: undefined,
        }));
      }
    } else setFilter((v) => ({ ...v, [name]: e.target.value }));
  };

  return (
    <>
      <Filter filter={filter} onChangeFilter={onChangeFilter} />

      <EnhancedTable
        title="Sekolah"
        type="school"
        cells={[
          (row) => ({
            id: "idString",
            label: "ID",
            value: row?.idString,
          }),
          "name",
          (row) => ({
            id: "participants",
            label: "Jumlah peserta",
            value: row?._count.participants,
          }),
          (row) => ({
            id: "active",
            label: "Aktif",
            value: row?.active ? (
              <Tooltip title="Aktif">
                <Done />
              </Tooltip>
            ) : (
              <Tooltip title="Belum diaktifkan">
                <Block />
              </Tooltip>
            ),
          }),
          (row) => ({
            id: "completed",
            label: "QR Code",
            value: row?.completed ? (
              <Tooltip title="QR Code dibagikan">
                <Done />
              </Tooltip>
            ) : (
              <Tooltip title="Belum dibagikan">
                <Block />
              </Tooltip>
            ),
          }),
          (row) => ({
            id: "createdAt",
            label: "Dibuat",
            value:
              row?.createdAt &&
              format(new Date(row.createdAt), "dd MMM yyyy - HH:mm"),
          }),
          (row) => ({
            id: "updatedAt",
            label: "Diperbarui",
            value:
              row?.updatedAt &&
              format(new Date(row.updatedAt), "dd MMM yyyy - HH:mm"),
          }),
        ]}
        filter={filter}
      />
    </>
  );
}
