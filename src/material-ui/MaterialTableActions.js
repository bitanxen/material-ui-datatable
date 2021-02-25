import React from "react";
import PropTypes from "prop-types";

import { makeStyles, Toolbar, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  tableFooter: {
    margin: 0,
  },
}));

function MaterialTableActions(props) {
  const classes = useStyles();
  const { actions, position } = props;
  return (
    <>
      {actions &&
        actions.length > 0 &&
        actions.filter((a) => a.position === "both" || a.position === position)
          .length > 0 && (
          <Toolbar className={classes.tableFooter}>
            <div style={{ marginLeft: "auto" }}>
              {actions
                .filter((a) => a.position === "both" || a.position === position)
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
    </>
  );
}

MaterialTableActions.propTypes = {
  actions: PropTypes.array,
  position: PropTypes.string,
};

export default MaterialTableActions;
