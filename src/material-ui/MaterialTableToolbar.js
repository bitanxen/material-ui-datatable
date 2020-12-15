import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import {
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  InputBase,
  ClickAwayListener,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
} from "@material-ui/core";
import {
  Delete,
  Search,
  Close,
  Edit,
  Add,
  FilterList,
  Refresh,
  CloudDownload,
  SettingsApplications,
} from "@material-ui/icons";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MaterialTableFilter from "./MaterialTableFilter";

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: "1 1 100%",
  },
  textField: {
    width: "100%",
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  active: {
    color: theme.palette.error[700],
  },
  title: {
    flex: "0 0 auto",
    width: "60%",
  },
  appBar: {
    position: "relative",
  },
  appBarTitle: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const MaterialTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {
    numSelected,
    tableName,
    searchable,
    header,
    data,
    loading,
    filterable,
    downloadable,
    resetable,
    searchHandler,
    addHandler,
    editHandler,
    deleteHandler,
    refreshHandler,
    downloadHander,
    resetHander,
    actions,
  } = props;
  const [searchEnable, setSearchEnable] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  const [downloadDialogOpen, setDownloadDialogOpen] = React.useState(false);
  const [filter, setFilter] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshEnable, setRefreshEnable] = useState(true);
  const textInput = useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMoreMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (searchEnable && textInput.current) {
      textInput.current.focus();
    }
  }, [searchEnable, textInput]);

  const handleClickAway = () => {
    if (textInput.current.value.length === 0) {
      setSearchEnable(false);
    }
  };

  const handleClose = () => {
    setFilterDialogOpen(false);
  };

  const applyFilterHandler = (f) => {
    searchHandler(searchTerm, f);
  };

  const handleRefresh = () => {
    if (textInput.current != null) {
      textInput.current.value = "";
    }
    setRefreshEnable(false);
    refreshHandler();
    setSearchTerm("");
    setFilter([]);
    setTimeout(() => {
      setRefreshEnable(true);
    }, 5000);
  };

  return (
    <React.Fragment>
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        <div className={classes.title}>
          {searchEnable ? (
            <ClickAwayListener onClickAway={handleClickAway}>
              <InputBase
                className={classes.textField}
                placeholder="Search"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setTimeout(searchHandler(e.target.value, filter), 500);
                }}
                inputProps={{ "aria-label": "search table" }}
                inputRef={textInput}
              />
            </ClickAwayListener>
          ) : numSelected > 0 ? (
            <Typography color="inherit" variant="subtitle1">
              {numSelected} selected
            </Typography>
          ) : (
            <Typography variant="subtitle1">
              <span>{tableName}&nbsp;&nbsp;</span>
              {(data === null || loading) && <CircularProgress size={15} />}
            </Typography>
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {addHandler && (
            <Tooltip
              title="Add"
              onClick={() => {
                addHandler();
              }}
            >
              <IconButton aria-label="add">
                <Add />
              </IconButton>
            </Tooltip>
          )}
        </div>
        <div className={classes.actions}>
          {numSelected > 0 && editHandler && (
            <Tooltip
              title="Edit"
              onClick={() => {
                editHandler(true);
              }}
            >
              <IconButton aria-label="edit">
                <Edit />
              </IconButton>
            </Tooltip>
          )}
        </div>
        <div className={classes.actions}>
          {numSelected > 0 && deleteHandler && (
            <Tooltip
              title="Delete"
              onClick={() => {
                deleteHandler(true);
              }}
            >
              <IconButton aria-label="delete">
                <Delete />
              </IconButton>
            </Tooltip>
          )}
        </div>
        <div className={classes.actions}>
          {searchable && (
            <Tooltip
              title="Search"
              onClick={() => {
                if (searchEnable) {
                  setSearchTerm("");
                  searchHandler("", filter);
                }
                setSearchEnable(!searchEnable);
              }}
            >
              <IconButton
                aria-label="search list"
                className={searchEnable ? classes.active : ""}
              >
                {searchEnable ? <Close /> : <Search />}
              </IconButton>
            </Tooltip>
          )}
        </div>
        <div className={classes.actions}>
          {filterable && (
            <Tooltip title="Filter" onClick={() => setFilterDialogOpen(true)}>
              <IconButton
                aria-label="filter"
                className={filter.length > 0 ? classes.active : ""}
              >
                <FilterList />
              </IconButton>
            </Tooltip>
          )}
        </div>
        <div className={(classes.actions, "div-desktop")}>
          {refreshHandler && (
            <Tooltip title="Refresh">
              <IconButton
                aria-label="refresh"
                disabled={!refreshEnable}
                onClick={() => handleRefresh()}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          )}
        </div>
        <div className={(classes.actions, "div-desktop")}>
          {downloadable && (
            <Tooltip title="Download">
              <IconButton
                aria-label="download"
                onClick={() => setDownloadDialogOpen(true)}
              >
                <CloudDownload />
              </IconButton>
            </Tooltip>
          )}
        </div>
        <div className={(classes.actions, "div-desktop")}>
          {resetable && (
            <Tooltip title="Reset">
              <IconButton aria-label="reset" onClick={() => resetHander(true)}>
                <SettingsApplications />
              </IconButton>
            </Tooltip>
          )}
        </div>
        <div className={(classes.actions, "div-mobile")}>
          {(resetable || downloadable || refreshHandler) && (
            <Tooltip title="More">
              <React.Fragment>
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleMoreMenuClick}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleMoreMenuClose}
                  PaperProps={{
                    style: {
                      maxHeight: 48 * 4.5,
                      width: 200,
                    },
                  }}
                >
                  {refreshHandler && (
                    <MenuItem
                      disabled={!refreshEnable}
                      onClick={() => {
                        handleRefresh();
                        handleMoreMenuClose();
                      }}
                    >
                      Refresh
                    </MenuItem>
                  )}
                  {downloadable && (
                    <MenuItem
                      onClick={() => {
                        setDownloadDialogOpen(true);
                        handleMoreMenuClose();
                      }}
                    >
                      Download
                    </MenuItem>
                  )}
                  {resetable && (
                    <MenuItem
                      onClick={() => {
                        resetHander(true);
                        handleMoreMenuClose();
                      }}
                    >
                      Reset
                    </MenuItem>
                  )}
                </Menu>
              </React.Fragment>
            </Tooltip>
          )}
        </div>
      </Toolbar>
      {actions &&
        actions.length > 0 &&
        actions.filter((a) => a.position === "both" || a.position === "top")
          .length > 0 && (
          <Toolbar className={classes.root}>
            <div style={{ marginLeft: "auto" }}>
              {actions
                .filter((a) => a.position === "both" || a.position === "top")
                .map((a, index) => (
                  <Button
                    key={index}
                    variant="outlined"
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
      <MaterialTableFilter
        filterDialogOpen={filterDialogOpen}
        handleClose={handleClose}
        tableName={tableName}
        header={header}
        filter={filter}
        filerHandler={setFilter}
        applyFilterHandler={applyFilterHandler}
      />
      <Dialog
        open={downloadDialogOpen}
        onClose={() => setDownloadDialogOpen(false)}
        aria-labelledby="campusive-download-dialog-title"
      >
        <DialogTitle id="campusive-download-dialog-title">
          Download {tableName}
        </DialogTitle>
        <DialogContent>
          <List>
            <ListItem
              button
              onClick={() => {
                downloadHander("csv");
                setDownloadDialogOpen(false);
              }}
            >
              <ListItemText primary="CSV" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                downloadHander("xlsx");
                setDownloadDialogOpen(false);
              }}
            >
              <ListItemText primary="Excel" />
            </ListItem>
            <Divider />
            <ListItem
              button
              onClick={() => {
                downloadHander("print");
                setDownloadDialogOpen(false);
              }}
            >
              <ListItemText primary="Print" />
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

MaterialTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  tableName: PropTypes.string.isRequired,
  searchable: PropTypes.bool.isRequired,
  filterable: PropTypes.bool.isRequired,
  downloadable: PropTypes.bool,
  resetable: PropTypes.bool,
  header: PropTypes.array.isRequired,
  searchHandler: PropTypes.func,
  editHandler: PropTypes.func,
  deleteHandler: PropTypes.func,
  addHandler: PropTypes.func,
  refreshHandler: PropTypes.func,
  downloadHander: PropTypes.func,
  resetHander: PropTypes.func,
  actions: PropTypes.array,
};

export default MaterialTableToolbar;
