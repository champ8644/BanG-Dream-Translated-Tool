'use strict';

import React, { Component } from 'react';

import RoutesSub from '../../routing/mainMenu';
import ToolbarAreaPane from '../ToolbarAreaPane';
import cv from 'opencv4nodejs';
import { log } from '@Log';
import { styles } from './styles';
import { withStyles } from '@material-ui/core/styles';

class Home extends Component {
  _handleSendAlertsBtn = ({ ...args }) => {
    const { handleThrowAlert } = this.props;

    handleThrowAlert({
      message: `This is a test alert.`,
      ...args
    });
  };

  render() {
    console.log('opencv', cv); // eslint-disable-line no-console
    const { classes: styles, match, history, location } = this.props;
    return (
      <div className={styles.root}>
        <div className={styles.grid}>
          <ToolbarAreaPane
            showMenu
            history={history}
            location={location}
            handleToggleSettings={this.handleToggleSettings}
          />
          <RoutesSub match={match} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Home);
