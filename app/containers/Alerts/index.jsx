'use strict';

import React, { Component } from 'react';

import Snackbars from '../../components/Snackbars';
import { bindActionCreators } from 'redux';
import { clearAlert } from './actions';
import { connect } from 'react-redux';
import reducers from './reducers';
import { withReducer } from '../../store/reducers/withReducer';

class Alerts extends Component {
  handleClose = () => {
    const { clearAlert } = this.props;
    clearAlert();
  };

  render() {
    const { Alerts } = this.props;
    const { message, variant, autoHideDuration, vertical, horizontal } = Alerts;
    return (
      message && (
        <Snackbars
          OnSnackBarsCloseAlerts={() => this.handleClose()}
          message={message}
          variant={variant}
          autoHideDuration={autoHideDuration}
          anchorOrigin={{ vertical, horizontal }}
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
