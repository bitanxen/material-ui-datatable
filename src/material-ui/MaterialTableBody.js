import React from "react";
import PropTypes from "prop-types";
import {
  makeStyles,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Avatar,
  Button,
  CircularProgress,
} from "@material-ui/core";
import clsx from "clsx";
import ApplicationUtils from "../common/ApplicationUtils";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  link: {
    cursor: "pointer",
    color: theme.palette.primary.main,
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const MaterialTableBody = (props) => {
  const {
    data,
    header,
    selected,
    order,
    orderBy,
    page,
    rowsPerPage,
    keyCells,
    onSelect,
  } = props;

  const classes = useStyles(props);

  let keyCol = "";
  if (keyCells.length === 1) {
    keyCol = keyCells[0].colId;
  }

  const isSelected = (name) =>
    selected ? selected.indexOf(name) !== -1 : false;
  const emptyRows =
    data === null
      ? rowsPerPage
      : rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

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

  return data == null ? (
    <TableBody>
      <TableRow style={{ height: 44 * emptyRows }}>
        <TableCell colSpan={header.length + 1} style={{ textAlign: "center" }}>
          Loading Data...
        </TableCell>
      </TableRow>
    </TableBody>
  ) : (
    <TableBody>
      {ApplicationUtils.stableSort(
        data,
        ApplicationUtils.getSorting(order, orderBy)
      )
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((row, index) => {
          const isItemSelected = isSelected(row[keyCol]);
          const labelId = `enhanced-table-checkbox-${index}`;
          return (
            <TableRow
              hover
              role="checkbox"
              aria-checked={isItemSelected}
              tabIndex={-1}
              key={row[keyCol]}
              selected={isItemSelected}
            >
              {onSelect && (
                <TableCell
                  padding="checkbox"
                  onClick={(event) =>
                    onSelect ? onSelect(event, row[keyCol]) : false
                  }
                  style={{ maxWidth: "60px", width: "60px" }}
                >
                  <Checkbox
                    checked={isItemSelected}
                    inputProps={{
                      "aria-labelledby": labelId,
                    }}
                  />
                </TableCell>
              )}
              {header.map((col, index) => (
                <TableCell
                  component="td"
                  id={labelId}
                  scope="row"
                  align={col.colType === "numeric" ? "center" : "left"}
                  key={`${col.index}-${index}`}
                  onClick={() =>
                    col.onClickHandler ? col.onClickHandler(row) : false
                  }
                  className={clsx(
                    "whitespace-nowrap",
                    col.onClickHandler ? classes.link : ""
                  )}
                  style={{ ...columnStyle(col) }}
                >
                  {col.colType === "action" ? (
                    <React.Fragment>
                      {col.actions
                        .filter((action) =>
                          action.visibleHandler
                            ? action.visibleHandler(row)
                            : true
                        )
                        .map((action, key) => (
                          <Button
                            onClick={(e) =>
                              action.clickHandler(e, row, col, action)
                            }
                            disabled={
                              action.disableHandler
                                ? action.disableHandler(row)
                                : false
                            }
                            key={key}
                            size="small"
                          >
                            {action.name}
                          </Button>
                        ))}
                    </React.Fragment>
                  ) : row[col.colId] === undefined ||
                    row[col.colId] === null ? (
                    ""
                  ) : row[col.colId].toString() === "true" ? (
                    "Yes"
                  ) : row[col.colId].toString() === "false" ? (
                    "No"
                  ) : col.colType === "avater" ? (
                    <Avatar alt={row[keyCol]} className={classes.small}>
                      CM
                    </Avatar>
                  ) : col.colType === "processing" ? (
                    <div className={classes.root}>
                      <CircularProgress
                        variant="static"
                        value={row[col.colId]}
                        size={25}
                      />
                    </div>
                  ) : col.profileCol === undefined ? (
                    row[col.colId].toString()
                  ) : (
                    row[col.colId].toString()
                  )}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      {emptyRows > 0 && (
        <TableRow style={{ height: 44 * emptyRows }}>
          {data.length === 0 && (
            <TableCell
              colSpan={onSelect ? header.length + 1 : header.length}
              align="center"
            >
              No Record
            </TableCell>
          )}
          <TableCell colSpan={onSelect ? header.length + 1 : header.length} />
        </TableRow>
      )}
    </TableBody>
  );
};

MaterialTableBody.propTypes = {
  data: PropTypes.array,
  header: PropTypes.array,
  selected: PropTypes.array,
  keyCells: PropTypes.array,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  onSelect: PropTypes.func,
};

export default MaterialTableBody;
