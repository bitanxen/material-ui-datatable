import React from "react";
import PropTypes from "prop-types";
import { v4 as uuid } from "uuid";
import { makeStyles } from "@material-ui/core/styles";
import {
  Toolbar,
  Typography,
  TableHead,
  TableRow,
  TableCell,
  Table,
  Dialog,
  AppBar,
  DialogContent,
  DialogActions,
  Button,
  TableBody,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  TextField,
  Grid,
  Checkbox,
} from "@material-ui/core";
import { Delete, Add } from "@material-ui/icons";
import { DateTimePicker, DatePicker } from "@material-ui/pickers";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  appBarTitle: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  formControl: {
    width: "100%",
  },
  button: {
    display: "block",
    marginTop: theme.spacing(2),
  },
  invalidRow: {
    backgroundColor: "#e57373",
    color: "white",
  },
}));

const MaterialTableFilter = (props) => {
  const {
    filterDialogOpen,
    handleClose,
    tableName,
    header,
    filter,
    filerHandler,
    applyFilterHandler,
  } = props;
  const classes = useStyles();

  const addFilter = () => {
    filerHandler([
      ...filter,
      {
        id: uuid(),
        colId: "",
        condition: "",
        colType: "",
        value: "",
        caseSensitive: false,
        enableTimestamp: false,
        valid: true,
      },
    ]);
  };

  const deleteFilter = (id) => {
    filerHandler([...filter.filter((f) => f.id !== id)]);
  };

  const handleChange = (id, col, value) => {
    filter.map((f) => {
      if (f.id === id) {
        f[col] = value;

        if (col === "colId") {
          const hdr = header.filter((h) => h.colId === value);
          f.colType = hdr && hdr.length === 1 ? hdr[0].colType : "";
          f.condition = "";
          f.value = "";
          f.caseSensitive = false;
          f.enableTimestamp = false;

          if (f.colType === "timestamp") {
            if (!f.enableTimestamp) {
              f.value = new Date();
              f.value.setHours(0, 0, 0);
            } else {
              f.value = new Date();
            }
          }

          if (f.colType === "date") {
            f.value = new Date();
            f.value.setHours(0, 0, 0);
          }
        }

        if (col === "enableTimestamp" && !col.enableTimestamp) {
          f.value.setHours(0, 0, 0);
        }

        /* if (col === "condition") {
          f.value = "";
        } */
      }

      f.valid = true;
      return f;
    });
    filerHandler([...filter]);
  };

  function validateAndApplyFilter() {
    let valid = true;
    for (let i = 0; i < filter.length; i++) {
      const f = filter[i];

      if (!f.colId || f.colId.length === 0) {
        f.valid = false;
        valid = false;
        break;
      }

      if (!f.condition || f.condition.length === 0) {
        f.valid = false;
        valid = false;
        break;
      }

      if (f.colType === "numeric") {
        try {
          if (isNaN(parseInt(f.value))) {
            throw new Error("Not a number");
          }
          f.value = parseInt(f.value);
        } catch (err) {
          f.valid = false;
          valid = false;
          break;
        }
      }
    }

    if (valid) {
      applyFilterHandler(filter);
      handleClose();
    } else {
      filerHandler([...filter]);
    }
  }

  function getCondition(type) {
    if (type === "numeric") return ["=", "!=", ">", "<", ">=", "<="];
    else if (type === "boolean") return ["is"];
    else if (type === "date" || type === "timestamp")
      return ["equal", "before", "equal or before", "after", "equal or after"];
    else return ["includes", "starts with", "equal", "not equal"];
  }

  function getValue(id) {
    const colArr = filter.filter((f) => f.id === id);
    if (!colArr || colArr.length === 0) return "";

    const col = colArr[0];

    if (col.colType === "string") {
      return (
        <Grid
          container
          spacing={1}
          alignItems="flex-end"
          style={{ width: "100%" }}
        >
          <Grid item xs={2}>
            <Checkbox
              title="Case Sessitive"
              checked={col.caseSensitive}
              onChange={(event) =>
                handleChange(col.id, "caseSensitive", event.target.checked)
              }
              value={col.caseSensitive}
              inputProps={{
                "aria-label": "primary checkbox",
              }}
            />
          </Grid>
          <Grid item xs={10}>
            <TextField
              id="standard-name"
              label="Value"
              className={classes.formControl}
              style={{ margin: 0 }}
              value={col.value}
              onChange={(event) =>
                handleChange(col.id, "value", event.target.value)
              }
              margin="normal"
            />
          </Grid>
        </Grid>
      );
    }

    if (col.colType === "timestamp") {
      return (
        <Grid
          container
          spacing={1}
          alignItems="flex-end"
          style={{ width: "100%" }}
        >
          <Grid item xs={2}>
            <Checkbox
              title="Enter Time"
              checked={col.enableTimestamp}
              onChange={(event) =>
                handleChange(col.id, "enableTimestamp", event.target.checked)
              }
              value={col.enableTimestamp}
              inputProps={{
                "aria-label": "primary checkbox",
              }}
            />
          </Grid>
          <Grid item xs={10}>
            {col.enableTimestamp ? (
              <DateTimePicker
                autoOk
                ampm={false}
                className={classes.formControl}
                value={col.value}
                onChange={(event) => handleChange(col.id, "value", event)}
                allowKeyboardControl
                format="dd/MM/yyyy HH:mm"
              />
            ) : (
              <DatePicker
                autoOk
                className={classes.formControl}
                format="dd/MM/yyyy"
                value={col.value}
                allowKeyboardControl
                onChange={(event) => handleChange(col.id, "value", event)}
              />
            )}
          </Grid>
        </Grid>
      );
    }

    if (col.colType === "numeric") {
      return (
        <TextField
          id="standard-name"
          label="Value"
          className={classes.formControl}
          style={{ margin: 0 }}
          value={col.value}
          onChange={(event) =>
            handleChange(col.id, "value", event.target.value)
          }
          margin="normal"
        />
      );
    }

    if (col.colType === "boolean") {
      return (
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor={`controlled-field-${col.colId}`}>
            Value
          </InputLabel>
          <Select
            value={col.value}
            onChange={(event) =>
              handleChange(col.id, "value", event.target.value)
            }
            inputProps={{
              name: "field",
              id: `controlled-field-${col.colId}`,
            }}
          >
            <MenuItem value="">
              <em>Select Option</em>
            </MenuItem>
            <MenuItem value>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </Select>
        </FormControl>
      );
    }

    return "";
  }

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={filterDialogOpen}
      onClose={() => {
        if (filter.length === 0) {
          handleClose();
        }
      }}
      aria-labelledby="max-width-dialog-title"
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography style={{ width: "90%" }}>Filter {tableName}</Typography>
        </Toolbar>
      </AppBar>
      <DialogContent>
        {header.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: 10 }}>
            No Headers Available
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "26%" }}>Field</TableCell>
                <TableCell style={{ width: "25%" }}>Condition</TableCell>
                <TableCell style={{ width: "35%" }}>Value</TableCell>
                <TableCell style={{ width: "7%" }}>Add</TableCell>
                <TableCell style={{ width: "7%" }}>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filter.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="5" style={{ paddingLeft: "45%" }}>
                    <Button className={classes.button} onClick={addFilter}>
                      Add Filter
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                filter.map((f) => (
                  <TableRow
                    key={f.id}
                    className={!f.valid ? classes.invalidRow : ""}
                  >
                    <TableCell>
                      <FormControl className={classes.formControl}>
                        <InputLabel htmlFor={`controlled-field-${f.colId}`}>
                          Field
                        </InputLabel>
                        <Select
                          value={f.colId}
                          onChange={(event) =>
                            handleChange(f.id, "colId", event.target.value)
                          }
                          inputProps={{
                            name: "field",
                            id: `controlled-field-${f.colId}`,
                          }}
                        >
                          <MenuItem value="">
                            <em>Select Field</em>
                          </MenuItem>
                          {header
                            .filter((cell) => cell.colType !== "avater")
                            .map((cell) => (
                              <MenuItem key={cell.colId} value={cell.colId}>
                                {cell.colName}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      {f.colId && f.colId.length > 0 && (
                        <FormControl className={classes.formControl}>
                          <InputLabel htmlFor={`controlled-field-${f.colId}`}>
                            Condition
                          </InputLabel>
                          <Select
                            value={f.condition}
                            onChange={(event) =>
                              handleChange(
                                f.id,
                                "condition",
                                event.target.value
                              )
                            }
                            inputProps={{
                              name: "field",
                              id: `controlled-field-${f.colId}`,
                            }}
                          >
                            <MenuItem value="">
                              <em>Select Condition</em>
                            </MenuItem>
                            {header
                              .filter((h) => h.colId === f.colId)
                              .map((h) => {
                                return getCondition(h.colType).map(
                                  (option, index) => (
                                    <MenuItem key={index} value={option}>
                                      {option}
                                    </MenuItem>
                                  )
                                );
                              })}
                          </Select>
                        </FormControl>
                      )}
                    </TableCell>
                    <TableCell>{getValue(f.id)}</TableCell>
                    <TableCell
                      style={{
                        align: "center",
                      }}
                    >
                      <IconButton aria-label="add" onClick={addFilter}>
                        <Add />
                      </IconButton>
                    </TableCell>
                    <TableCell
                      style={{
                        align: "center",
                      }}
                    >
                      <IconButton
                        aria-label="delete"
                        onClick={() => deleteFilter(f.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            validateAndApplyFilter();
          }}
          color="primary"
        >
          Apply
        </Button>
        <Button
          onClick={async () => {
            await filerHandler([]);
            await applyFilterHandler([]);
            await handleClose();
          }}
        >
          Clear
        </Button>
      </DialogActions>
    </Dialog>
  );
};

MaterialTableFilter.propTypes = {
  filterDialogOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  tableName: PropTypes.string.isRequired,
  header: PropTypes.array.isRequired,
  filter: PropTypes.array,
  filerHandler: PropTypes.func,
  applyFilterHandler: PropTypes.func,
};

export default MaterialTableFilter;
