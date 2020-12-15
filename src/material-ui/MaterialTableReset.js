import React from "react";
import PropTypes from "prop-types";
import {
  makeStyles,
  Toolbar,
  Typography,
  Paper,
  FormGroup,
  FormControlLabel,
  Dialog,
  AppBar,
  DialogContent,
  Grid,
  Checkbox,
  DialogActions,
  Button,
} from "@material-ui/core";

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
    margin: theme.spacing(1),
  },
  checkBox: {
    marginTop: 10,
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

function MaterialTableReset(props) {
  const {
    resetDialogOpen,
    tableName,
    header,
    selectedHeader,
    resetHandler,
    resetDialogOpenHandler,
  } = props;
  const classes = useStyles();

  const checkeSelected = (selectedColId) => {
    return selectedHeader.filter((h) => h.colId === selectedColId).length > 0;
  };

  const saveOrUpdate = () => {
    return false;
  };

  const selectHeader = (colId) => {
    const checkCol = selectedHeader.filter((h) => h.colId === colId);
    let newHeader = selectedHeader.map((h) => h.colId);

    if (checkCol.length > 0) {
      newHeader = newHeader.filter((col) => col !== colId);
    } else {
      newHeader.push(colId);
    }
    resetHandler(newHeader);
  };

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={resetDialogOpen}
      onClose={() => resetDialogOpenHandler(false)}
      aria-labelledby="max-width-dialog-title"
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography style={{ width: "90%" }}>
            Reset {tableName} View
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Grid container spacing={1}>
          {header.map((h) => (
            <Grid item key={h.colId} xs={12} sm={6} md={4} lg={4}>
              <Paper className={classes.paper}>
                <FormGroup row className={classes.formGroup}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkeSelected(h.colId)}
                        onChange={() => selectHeader(h.colId)}
                        disabled={h.keyCol}
                        value={h.colId}
                      />
                    }
                    label={h.colName}
                  />
                </FormGroup>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {}} color="primary">
          {saveOrUpdate() ? "Update View" : "Save View"}
        </Button>
        <Button onClick={() => resetDialogOpenHandler(false)} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

MaterialTableReset.propTypes = {
  resetDialogOpen: PropTypes.bool.isRequired,
  tableName: PropTypes.string.isRequired,
  header: PropTypes.array.isRequired,
  selectedHeader: PropTypes.array.isRequired,
  resetHandler: PropTypes.func.isRequired,
  resetDialogOpenHandler: PropTypes.func.isRequired,
};

export default MaterialTableReset;
