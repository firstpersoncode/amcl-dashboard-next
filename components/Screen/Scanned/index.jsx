import { useState } from "react";
import { format, startOfToday } from "date-fns";
import EnhancedTable from "components/EnhancedTable";
import Filter from "./Filter";

export default function Scanned() {
  const [filter, setFilter] = useState({ createdAt: { gte: startOfToday() } });

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
                owner: {
                  idString: {
                    contains: e.target.value,
                    mode: "insensitive",
                  },
                },
              },
              {
                owner: {
                  name: {
                    contains: e.target.value,
                    mode: "insensitive",
                  },
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
    } else
      setFilter((v) => ({
        ...v,
        createdAt: {
          ...v.createdAt,
          [name]: e.target.value ? new Date(e.target.value) : undefined,
        },
      }));
  };

  const [filterSchool, setFilterSchool] = useState({});

  const onChangeFilterSchool = (name) => (e) => {
    const selectedOption = name === "id" ? e.target.value : e.target;
    setFilterSchool((v) => ({ ...v, [name]: selectedOption?.value }));
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
        orderBy="createdAt"
        cells={[
          (row) => ({
            id: "idString",
            label: "ID",
            value: row?.idString,
          }),
          (row) => ({
            id: "owner",
            label: "Pemilik",
            value: row?.owner.name,
          }),
          (row) => ({
            id: "createdAt",
            label: "Dibuat",
            value:
              row?.createdAt &&
              format(new Date(row.createdAt), "dd MMM yyyy - HH:mm"),
          }),
        ]}
        filter={{ ...filter, owner: { school: { ...filterSchool } } }}
      />
    </>
  );
}
