import React from "react";
import PropTypes from "prop-types";
import { TablePagination } from "@material-ui/core";

const MaterialTablePagination = (props) => {
  const {
    data,
    rowsPerPage,
    page,
    handleChangePage,
    handleChangeRowsPerPage,
  } = props;
  return (
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={data === null ? 0 : data.length}
      rowsPerPage={rowsPerPage}
      page={page}
      backIconButtonProps={{
        "aria-label": "previous page",
      }}
      nextIconButtonProps={{
        "aria-label": "next page",
      }}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
};

MaterialTablePagination.propTypes = {
  data: PropTypes.array,
  rowsPerPage: PropTypes.number,
  page: PropTypes.number,
  handleChangePage: PropTypes.func,
  handleChangeRowsPerPage: PropTypes.func,
};

export default MaterialTablePagination;
