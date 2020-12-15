import React, { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Paper, Table, Toolbar, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { parse } from "date-fns";

import MaterialTableToolbar from "./MaterialTableToolbar";
import MaterialTableHead from "./MaterialTableHead";
import MaterialTableBody from "./MaterialTableBody";
import MaterialTablePagination from "./MaterialTablePagination";
import MaterialTableReset from "./MaterialTableReset";
import ApplicationUtils from "../common/ApplicationUtils";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: "auto",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  tableFooter: {
    margin: 0,
  },
}));

const MaterialTable = (props) => {
  const classes = useStyles();
  const {
    tableName,
    loading,
    searchable,
    sortable,
    filterable,
    downloadable,
    resetable,
    data,
    header,
    selected,
    addHandler,
    editHandler,
    deleteHandler,
    selectHandler,
    refreshHandler,
    actions,
  } = props;

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [allData, setAllData] = React.useState([]);
  const [allHeader, setAllHeader] = React.useState([]);
  const [openResetHandler, setOpenResetHandler] = React.useState(false);

  const sortedCells = allHeader.sort(ApplicationUtils.compare);

  const headCells = sortedCells.filter((cell) => !cell.keyCol);
  const keyCells = sortedCells.filter((cell) => cell.keyCol);

  useEffect(() => {
    setAllData(data);
  }, [data]);

  let keyCol = "";
  if (keyCells.length === 1) {
    keyCol = keyCells[0].colId;
  }

  const handleSort = (event, property) => {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n[keyCol]);
      selectHandler(newSelecteds);
      return;
    }
    selectHandler([]);
  };

  const handleSelectOne = (event, colId) => {
    const selectedIndex = selected.indexOf(colId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, colId);
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
    selectHandler(newSelected);
  };

  const handleDownload = (format) => {
    const csvData = [];
    const csvHeader = allHeader.filter((h) => !h.keyCol).map((h) => h.colName);
    csvData.push(csvHeader);

    csvData.push(
      ...ApplicationUtils.stableSort(
        data,
        ApplicationUtils.getSorting(order, orderBy)
      ).map((d) => {
        return [
          ...allHeader
            .filter((h) => !h.keyCol)
            .map((h) =>
              d[h.colId] === null
                ? ""
                : d[h.colId].toString() === "true"
                ? "Yes"
                : d[h.colId].toString() === "false"
                ? "No"
                : d[h.colId].toString()
            ),
        ];
      })
    );

    if (format === "xlsx") ApplicationUtils.downloadExcel(tableName, csvData);
    if (format === "csv") ApplicationUtils.downloadCSV(tableName, csvData);
  };

  const resetHander = useCallback(
    (selectedHeader) => {
      let displayableHeader = [];
      if (selectedHeader.length > 0) {
        displayableHeader = [...header]
          .map((h) => {
            const selected = selectedHeader.filter(
              (sh) => h.keyCol || h.colId === sh
            );
            if (selected.length > 0) return h;
            else return null;
          })
          .filter((h) => h !== null);
      } else {
        displayableHeader = header.filter((h) => h.keyCol || h.display);
      }

      displayableHeader = displayableHeader.map((h) => {
        h.positionX = 0;
        h.positionY = 0;
        return h;
      });

      let orderByCol = "";
      if (displayableHeader.length >= 2) {
        orderByCol = displayableHeader[1].colId;
      }
      setOrderBy(orderByCol);
      setAllHeader(displayableHeader);
    },
    [header]
  );

  useEffect(() => {
    resetHander([]);
  }, [resetHander]);

  function checkHeader(property) {
    for (const headerProp in headCells) {
      if (headCells[headerProp].colId === property) return true;
    }
    return false;
  }

  function searchData(search, filter) {
    let filteredData = [];
    if (search && search.length > 0) {
      filteredData = data.filter((row) => {
        for (const property in row) {
          if (keyCol === property) continue;
          if (row[property] === undefined) continue;
          if (!checkHeader(property)) continue;

          if (
            row[property] &&
            row[property].toString() &&
            row[property]
              .toString()
              .toLowerCase()
              .includes(search.toLowerCase())
          ) {
            return true;
          }
        }
        return false;
      });
    } else {
      filteredData = data;
    }

    for (let i = 0; i < filter.length; i++) {
      const filterCondition = filter[i];

      filteredData = filteredData.filter((d) => {
        const actualData = d[filterCondition.colId];
        const checkData = filterCondition.value;
        const condition = filterCondition.condition;
        const colType = filterCondition.colType;

        if (colType === "boolean") {
          return actualData === checkData;
        }

        if (colType === "numeric") {
          if (condition === "=") return actualData === checkData;
          else if (condition === "!=") return actualData !== checkData;
          else if (condition === ">") return actualData > checkData;
          else if (condition === "<") return actualData < checkData;
          else if (condition === ">=") return actualData >= checkData;
          else if (condition === "<=") return actualData <= checkData;
          else return true;
        }

        if (colType === "string") {
          const caseActualData = filterCondition.caseSensitive
            ? actualData
            : actualData && actualData.length > 0
            ? actualData.toLowerCase()
            : "";
          const caseCheckData = filterCondition.caseSensitive
            ? checkData
            : checkData && checkData.length > 0
            ? checkData.toLowerCase()
            : "";
          if (condition === "equal") return caseActualData === caseCheckData;
          else if (condition === "not equal")
            return caseActualData !== caseCheckData;
          else if (condition === "starts with")
            return caseActualData.startsWith(caseCheckData);
          else if (condition === "includes")
            return caseActualData.includes(caseCheckData);
          else return true;
        }

        if (colType === "timestamp" && filterCondition.enableTimestamp) {
          const timeStampActualData = parse(
            actualData,
            "dd-MM-yyyy HH:mm:ss",
            new Date()
          );
          timeStampActualData.setSeconds(0);

          if (condition === "equal")
            return timeStampActualData.getTime() === checkData.getTime();
          else if (condition === "before")
            return timeStampActualData < checkData;
          else if (condition === "equal or before")
            return timeStampActualData <= checkData;
          else if (condition === "after")
            return timeStampActualData > checkData;
          else if (condition >= "equal or after")
            return timeStampActualData >= checkData;
          else return true;
        }

        if (colType === "date" || !filterCondition.enableTimestamp) {
          const timeStampActualData = parse(
            actualData,
            "dd-MM-yyyy HH:mm:ss",
            new Date()
          );
          timeStampActualData.setHours(0, 0, 0);

          if (condition === "equal")
            return timeStampActualData.getTime() === checkData.getTime();
          else if (condition === "before")
            return timeStampActualData < checkData;
          else if (condition === "equal or before")
            return timeStampActualData <= checkData;
          else if (condition === "after")
            return timeStampActualData > checkData;
          else if (condition >= "equal or after")
            return timeStampActualData >= checkData;
          else return true;
        }

        if (d.colId === filterCondition.colId) {
          return true;
        } else return false;
      });
    }

    setAllData(filteredData);
  }

  const onRequestResize = (colId, e, position) => {
    console.log(colId, e, position);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <MaterialTableToolbar
          numSelected={selected ? selected.length : 0}
          tableName={tableName}
          data={allData}
          loading={loading}
          header={headCells}
          searchable={searchable}
          filterable={filterable}
          downloadable={downloadable}
          resetable={resetable}
          searchHandler={searchData}
          addHandler={addHandler}
          editHandler={editHandler}
          deleteHandler={deleteHandler}
          refreshHanAAAAdler={refreshHandler}
          downloadHander={handleDownload}
          resetHander={setOpenResetHandler}
          actions={actions || []}
        />
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <MaterialTableHead
              classes={classes}
              numSelected={selected ? selected.length : 0}
              order={order}
              orderBy={orderBy}
              onAllSelect={selectHandler ? handleSelectAll : undefined}
              onRequestSort={sortable ? handleSort : undefined}
              rowCount={data === null ? 0 : data.length}
              header={headCells}
              onRequestResize={onRequestResize}
            />
            <MaterialTableBody
              data={allData}
              header={headCells}
              keyCells={keyCells}
              order={order}
              orderBy={orderBy}
              selected={selected}
              page={page}
              rowsPerPage={rowsPerPage}
              onSelect={selectHandler ? handleSelectOne : undefined}
            />
          </Table>
        </div>
        {actions &&
          actions.length > 0 &&
          actions.filter(
            (a) => a.position === "both" || a.position === "bottom"
          ).length > 0 && (
            <Toolbar className={classes.tableFooter}>
              <div style={{ marginLeft: "auto" }}>
                {actions
                  .filter(
                    (a) => a.position === "both" || a.position === "bottom"
                  )
                  .map((a, index) => (
                    <Button
                      key={index}
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={a.actionHandler}
                      style={{ marginRight: "10px" }}
                    >
                      {a.actionName}
                    </Button>
                  ))}
              </div>
            </Toolbar>
          )}
        <MaterialTablePagination
          data={allData}
          rowsPerPage={rowsPerPage}
          page={page}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <MaterialTableReset
        resetDialogOpen={openResetHandler}
        resetDialogOpenHandler={setOpenResetHandler}
        tableName={tableName}
        header={header}
        selectedHeader={allHeader}
        resetHandler={resetHander}
      />
    </div>
  );
};

MaterialTable.propTypes = {
  tableName: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  searchable: PropTypes.bool.isRequired,
  sortable: PropTypes.bool,
  filterable: PropTypes.bool,
  downloadable: PropTypes.bool,
  resetable: PropTypes.bool,
  addHandler: PropTypes.func,
  editHandler: PropTypes.func,
  deleteHandler: PropTypes.func,
  selectHandler: PropTypes.func,
  refreshHandler: PropTypes.func,
  data: PropTypes.array,
  header: PropTypes.array,
  selected: PropTypes.array,
  actions: PropTypes.array,
};

export default MaterialTable;
