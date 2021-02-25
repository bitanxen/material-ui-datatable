import React from "react";
import PropTypes from "prop-types";
import {
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  TableSortLabel,
} from "@material-ui/core";

const MaterialTableHead = (props) => {
  const {
    classes,
    onAllSelect,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    header,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const columnStyle = (headCell) => {
    const headCellStyle = {};

    if (headCell.width) {
      headCellStyle.width = headCell.width;
      headCellStyle.whiteSpace = "nowrap";
      headCellStyle.overflow = "hidden";
      headCellStyle.textOverflow = "ellipsis";
    }
    return headCellStyle;
  };

  return (
    <TableHead>
      <TableRow>
        {onAllSelect && (
          <TableCell
            padding="checkbox"
            key={0}
            style={{ maxWidth: "60px", width: "60px" }}
          >
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onAllSelect}
              inputProps={{ "aria-label": "select all" }}
            />
          </TableCell>
        )}
        {header.map((headCell, index) =>
          onRequestSort ? (
            <TableCell
              key={index}
              align={headCell.colType === "numeric" ? "center" : "left"}
              padding="default"
              sortDirection={
                onRequestSort && orderBy === headCell.colId ? order : false
              }
              style={{ ...columnStyle(headCell) }}
            >
              <TableSortLabel
                active={orderBy === headCell.colId}
                direction={order}
                onClick={createSortHandler(headCell.colId)}
              >
                {headCell.colName}
                {orderBy === headCell.colId ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ) : (
            <TableCell
              key={index}
              align={headCell.colType === "numeric" ? "center" : "left"}
              padding="default"
              style={{ ...columnStyle(headCell) }}
            >
              {headCell.colName}
            </TableCell>
          )
        )}
      </TableRow>
    </TableHead>
  );
};

MaterialTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func,
  onAllSelect: PropTypes.func,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default MaterialTableHead;
