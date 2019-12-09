'use strict';

/* eslint no-case-declarations: off */

import React, { Component } from 'react';

import ToolbarBody from './components/ToolbarBody';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { log } from '@Log';
import { makeToolbarList } from './selectors';
import path from 'path';
import reducers from './reducers';
import { styles } from './styles/ToolbarAreaPane';
import { throwAlert } from '../Alerts/actions';
import { toggleSettings } from '../Settings/actions';
import { toggleWindowSizeOnDoubleClick } from '../../utils/titlebarDoubleClick';
import { withReducer } from '../../store/reducers/withReducer';
import { withStyles } from '@material-ui/core/styles';

class ToolbarAreaPane extends Component {
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
    const { history, location } = this.props;
    switch (itemType) {
      case 'settings':
        this._handleToggleSettings(true);
        break;
      case 'back':
        history.push(path.join(location.pathname, '../').replace(/\\/g, '/'));
        break;
      case 'home':
        history.push('/');
        break;
      default:
        break;
    }
  };

  render() {
    const { classes: styles, ...parentProps } = this.props;
    return (
      <ToolbarBody
        styles={styles}
        {...parentProps}
        handleToolbarAction={this._handleToolbarAction}
        handleToggleSettings={this._handleToolbarAction}
        handleDoubleClickToolBar={this._handleDoubleClickToolBar}
      />
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

export default withReducer('Toolbar', reducers)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(ToolbarAreaPane))
);
