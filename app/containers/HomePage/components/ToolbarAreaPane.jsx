'use strict';

/* eslint no-case-declarations: off */

import React, { PureComponent } from 'react';

import ToolbarBody from './ToolbarBody';
import { log } from '@Log';
import { styles } from '../styles/ToolbarAreaPane';
import { withStyles } from '@material-ui/core/styles';

class ToolbarAreaPane extends PureComponent {
  render() {
    const { classes: styles, ...parentProps } = this.props;

    return <ToolbarBody styles={styles} {...parentProps} />;
  }
}

export default withStyles(styles)(ToolbarAreaPane);
