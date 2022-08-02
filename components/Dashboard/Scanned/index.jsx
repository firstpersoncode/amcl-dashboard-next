import { useState } from "react";
import { format } from "date-fns";
import EnhancedTable from "components/EnhancedTable";
import Filter from "./Filter";

export default function Scanned() {
  const [filter, setFilter] = useState({ scannedAt: { gte: new Date() } });

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
              // {
              //   email: {
              //     contains: e.target.value,
              //     mode: "insensitive",
              //   },
              // },
            ],
          },
        }));
      } else {
        setFilter((v) => ({
          ...v,
          search: undefined,
        }));
      }
    } else
      setFilter((v) => ({
        ...v,
        scannedAt: {
          ...v.scannedAt,
          [name]: e.target.value ? new Date(e.target.value) : undefined,
        },
      }));
  };

  return (
    <>
      <Filter filter={filter} onChangeFilter={onChangeFilter} />

      <EnhancedTable
        title="Kehadiran"
        type="qrcode"
        cells={[
          "idString",
          (row) => ({
            id: "scannedAt",
            label: "Discan",
            value:
              row?.scannedAt &&
              format(new Date(row.scannedAt), "dd MMM yyyy - HH:mm"),
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
