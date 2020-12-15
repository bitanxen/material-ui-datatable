import React from "react";
import PropTypes from "prop-types";
import {
  makeStyles,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  TableSortLabel,
} from "@material-ui/core";
import Draggable from "react-draggable";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  extendColumn: {
    position: "relative",
    marginBottom: "20px",
  },
}));

const MaterialTableHead = (props) => {
  const baseClasses = useStyles();
  const {
    classes,
    onAllSelect,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    header,
    onRequestResize,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const columnStyle = (headCell) => {
    const headCellStyle = {};

    if (headCell.maxWidth) {
      headCellStyle.maxWidth = headCell.maxWidth;
      headCellStyle.width = headCell.maxWidth;
    }
    return headCellStyle;
  };

  return (
    <TableHead>
      <TableRow>
        {onAllSelect && (
          <TableCell padding="checkbox" key={0} style={{ width: "20px" }}>
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
              key={headCell.index}
              align={headCell.colType === "numeric" ? "center" : "left"}
              padding="default"
              sortDirection={
                onRequestSort && orderBy === headCell.colId ? order : false
              }
              style={{ ...columnStyle(headCell) }}
            >
              <div className={clsx(baseClasses.extendColumn)}>
                <div style={{ position: "absolute", width: "100%" }}>
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
                </div>
                <Draggable
                  bounds="parent"
                  axis="x"
                  handle=".handle"
                  defaultPosition={{ x: 0, y: 0 }}
                  position={null}
                  grid={[25, 25]}
                  scale={1}
                  onDrag={(e, position) =>
                    onRequestResize(headCell.colId, e, position)
                  }
                >
                  <div
                    className="handle"
                    style={{
                      margin: "0 10px",
                      cursor: "grab",
                      position: "absolute",
                      right: 0,
                      marginRight: "2px",
                    }}
                  >
                    |
                  </div>
                </Draggable>
              </div>
            </TableCell>
          ) : (
            <TableCell
              key={headCell.index}
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
