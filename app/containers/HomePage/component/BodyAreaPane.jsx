'use strict';

/* eslint no-case-declarations: off */

import React, { PureComponent } from 'react';

import { APP_VERSION } from '../../../constants/meta';
import Button from '@material-ui/core/Button';
import { log } from '@Log';
import { routes } from '../../../routing/mainMenu';
import { styles } from '../styles/BodyAreaPane';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

class BodyAreaPane extends PureComponent {
  render() {
    const { classes: styles, history } = this.props;
    return (
      <div className={styles.root}>
        <div className={styles.title}>Cognitive Fatique Evaluater</div>
        <div className={styles.subTitle}>version {APP_VERSION}</div>
        <Button
          className={styles.btn}
          onClick={() => history.push(`${routes.Stroop.locate}`)}
        >
          Stroop
        </Button>
        <Button
          className={styles.btn2}
          onClick={() => history.push(`${routes.PVSAT.locate}/1`)}
        >
          PVSAT
        </Button>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(BodyAreaPane));
