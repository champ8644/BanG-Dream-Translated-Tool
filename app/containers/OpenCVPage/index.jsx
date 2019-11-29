'use strict';

import React, { Component } from 'react';

import BodyAreaPane from './components/BodyAreaPane';
import ToolbarAreaPane from './components/ToolbarAreaPane';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { log } from '@Log';
import { makeToolbarList } from './selectors';
import reducers from './reducers';
import { styles } from './styles';
import { throwAlert } from '../Alerts/actions';
import { toggleSettings } from '../Settings/actions';
import { toggleWindowSizeOnDoubleClick } from '../../utils/titlebarDoubleClick';
import { withReducer } from '../../store/reducers/withReducer';
import { withStyles } from '@material-ui/core/styles';

class Home extends Component {
  _handleDoubleClickToolBar = event => {
    if (event.target !== event.currentTarget) {
      return null;
    }

    toggleWindowSizeOnDoubleClick();
  };

  _handleToggleSettings = () => {
    const { handleToggleSettings } = this.props;
    handleToggleSettings(true);
  };

  _handleToolbarAction = itemType => {
    switch (itemType) {
      case 'settings':
        this._handleToggleSettings(true);
        break;

      default:
        break;
    }
  };

  _handleSendAlertsBtn = ({ ...args }) => {
    const { handleThrowAlert } = this.props;

    handleThrowAlert({
      message: `This is a test alert.`,
      ...args
    });
  };

  render() {
    const { classes: styles, toolbarList } = this.props;

    return (
      <div className={styles.root}>
        <div className={styles.grid}>
          OpenCV
          <ToolbarAreaPane
            showMenu
            toolbarList={toolbarList}
            handleDoubleClickToolBar={this._handleDoubleClickToolBar}
            handleToolbarAction={this._handleToolbarAction}
          />
          <BodyAreaPane onSendAlertsBtn={this._handleSendAlertsBtn} />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      handleToggleSettings: data => (_, getState) => {
        dispatch(toggleSettings(data));
      },

      handleThrowAlert: data => (_, getState) => {
        dispatch(throwAlert({ ...data }));
      }
    },
    dispatch
  );

const mapStateToProps = (state, props) => {
  return {
    toolbarList: makeToolbarList(state)
  };
};

export default withReducer('Home', reducers)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(Home))
);
