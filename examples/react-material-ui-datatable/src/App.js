import React, { useState } from "react";
import { MaterialTable } from "@bitanxen/react-datatable";

const App = () => {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshUsers = () => {};

  const viewUser = (user) => {
    console.log("View User: ", user);
  };
  const addUser = () => {
    console.log("Add User");
  };
  const updateUser = () => {
    console.log("Update User");
  };
  const deleteUser = () => {
    console.log("Delete User");
  };

  const header = [
    {
      colId: "userId",
      colName: "User ID",
      colType: "string",
      index: 0,
      keyCol: true,
      display: false,
    },
    {
      colId: "userName",
      colName: "Username",
      colType: "string",
      index: 1,
      onClickHandler: viewUser,
      display: true,
      fixed: true,
      maxWidth: "100px",
    },
    {
      colId: "age",
      colName: "Age",
      colType: "numeric",
      index: 2,
      display: true,
      maxWidth: "30px",
    },
    {
      colId: "enabled",
      colName: "Enabled",
      colType: "boolean",
      index: 3,
      keyCol: false,
      display: true,
      maxWidth: "30px",
    },
    {
      colId: "createdOn",
      colName: "Created On",
      colType: "timestamp",
      index: 4,
      keyCol: false,
      display: true,
      maxWidth: "30px",
    },
  ];

  const data = [
    {
      userId: "1",
      userName: "bitanxen",
      age: 30,
      enabled: true,
      createdOn: new Date(),
    },
    {
      userId: "2",
      userName: "rintuxen",
      age: 30,
      enabled: false,
      createdOn: new Date(),
    },
    {
      userId: "3",
      userName: "xen002",
      age: 30,
      enabled: true,
      createdOn: new Date(),
    },
    {
      userId: "4",
      userName: "bitanxen",
      age: 30,
      enabled: true,
      createdOn: new Date(),
    },
    {
      userId: "5",
      userName: "rintuxen",
      age: 30,
      enabled: false,
      createdOn: new Date(),
    },
    {
      userId: "6",
      userName: "xen002",
      age: 30,
      enabled: true,
      createdOn: new Date(),
    },
    {
      userId: "7",
      userName: "bitanxen",
      age: 30,
      enabled: true,
      createdOn: new Date(),
    },
    {
      userId: "8",
      userName: "rintuxen",
      age: 30,
      enabled: false,
      createdOn: new Date(),
    },
    {
      userId: "9",
      userName: "xen002",
      age: 30,
      enabled: true,
      createdOn: new Date(),
    },
    {
      userId: "10",
      userName: "bitanxen",
      age: 30,
      enabled: true,
      createdOn: new Date(),
    },
    {
      userId: "11",
      userName: "rintuxen",
      age: 30,
      enabled: false,
      createdOn: new Date(),
    },
    {
      userId: "12",
      userName: "xen002",
      age: 30,
      enabled: true,
      createdOn: new Date(),
    },
  ];

  return (
    <MaterialTable
      tableName="Test Table"
      loading={loading}
      searchable
      sortable
      filterable
      downloadable
      resetable
      data={data}
      header={header}
      selected={selected}
      selectHandler={setSelected}
      addHandler={addUser}
      editHandler={updateUser}
      deleteHandler={deleteUser}
      refreshHandler={refreshUsers}
    />
  );
};

export default App;
