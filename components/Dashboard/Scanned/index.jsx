import { useState } from "react";
import { format, startOfToday } from "date-fns";
import EnhancedTable from "components/EnhancedTable";
import Filter from "./Filter";

export default function Scanned() {
  const [filter, setFilter] = useState({ scannedAt: { gte: startOfToday() } });

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

  const [filterSchool, setFilterSchool] = useState({});

  const onChangeFilterSchool = (name) => (e) => {
    setFilterSchool((v) => ({ ...v, [name]: e.target.value }));
  };

  return (
    <>
      <Filter
        filter={filter}
        onChangeFilter={onChangeFilter}
        filterSchool={filterSchool}
        onChangeFilterSchool={onChangeFilterSchool}
      />

      <EnhancedTable
        title="Kehadiran"
        type="qrcode"
        cells={[
          (row) => ({
            id: "idString",
            label: "ID",
            value: row?.idString,
          }),
          (row) => ({
            id: "scannedAt",
            label: "Scan",
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
        filter={{ ...filter, owner: { school: { ...filterSchool } } }}
      />
    </>
  );
}
