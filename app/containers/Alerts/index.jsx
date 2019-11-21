'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withReducer } from '../../store/reducers/withReducer';
import reducers from './reducers';
import { clearAlert } from './actions';
import Snackbars from '../../components/Snackbars';

class Alerts extends Component {
  handleClose = () => {
    const { clearAlert } = this.props;
    clearAlert();
  };

  render() {
    const { Alerts } = this.props;
    const { message, variant, autoHideDuration } = Alerts;
    return (
      message && (
        <Snackbars
          OnSnackBarsCloseAlerts={() => this.handleClose()}
          message={message}
          variant={variant}
          autoHideDuration={autoHideDuration}
        />
      )
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      clearAlert: () => (_, getState) => {
        dispatch(clearAlert());
      }
    },
    dispatch
  );

const mapStateToProps = (state, props) => {
  return {
    Alerts: state.Alerts
  };
};

export default withReducer('Alerts', reducers)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Alerts)
);
