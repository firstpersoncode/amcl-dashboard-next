import { useState } from "react";
import { format } from "date-fns";
import EnhancedTable from "components/EnhancedTable";
import Filter from "./Filter";

export default function Participant() {
  const [filter, setFilter] = useState({});

  const onChangeFilter = (name) => (e) => {
    setFilter((v) => ({ ...v, [name]: e.target.value }));
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
        title="Peserta"
        type="participant"
        cells={[
          "id",
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
