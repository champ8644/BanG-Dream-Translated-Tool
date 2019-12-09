'use strict';

import React, { Component } from 'react';

import RoutesSub from '../../routing/mainSub';
import ToolbarAreaPane from '../ToolbarAreaPane';
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
