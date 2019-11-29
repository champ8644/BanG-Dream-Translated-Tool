'use strict';

/* eslint no-case-declarations: off, no-unused-vars: off */

import { Link, withRouter } from 'react-router-dom';
import React, { PureComponent } from 'react';

import Button from '@material-ui/core/Button';
import { imgsrc } from '../../../utils/imgsrc';
import { log } from '@Log';
import { routes } from '../../../routing';
import { styles } from '../styles/BodyAreaPane';
import { withStyles } from '@material-ui/core/styles';

class BodyAreaPane extends PureComponent {
  render() {
    const { classes: styles, onSendAlertsBtn } = this.props;

    return (
      <div className={styles.root}>
        <h3>Electron-React-Redux advanced and scalable boilerplate</h3>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(BodyAreaPane));
