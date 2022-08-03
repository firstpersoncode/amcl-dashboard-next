import { useState } from "react";
import { format } from "date-fns";
import EnhancedTable from "components/EnhancedTable";
import Filter from "./Filter";

export default function Participant() {
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
              {
                phone: {
                  contains: e.target.value,
                  mode: "insensitive",
                },
              },
              {
                instagram: {
                  contains: e.target.value,
                  mode: "insensitive",
                },
              },
              {
                studentId: {
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
        title="Peserta"
        type="participant"
        cells={[
          (row) => ({
            id: "idString",
            label: "ID",
            value: row?.idString,
          }),
          "name",
          "email",
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
        filter={{ ...filter, school: { ...filterSchool } }}
      />
    </>
  );
}
