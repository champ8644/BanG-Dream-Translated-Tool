'use strict';

/* eslint no-case-declarations: off */

import React, { PureComponent } from 'react';

import { APP_VERSION } from '../../../constants/meta';
import ButtonHompage from '../../ButtonHompage';
// import SignIn from './SignIn';
// import { log } from '@Log';
import { styles } from '../styles/BodyAreaPane';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

class BodyAreaPane extends PureComponent {
  render() {
    const { classes: styles, history } = this.props;
    return (
      <div className={styles.root}>
        <div className={styles.subroot}>
          <div className={styles.title}>BanG Dream</div>
          <div className={styles.heading1}>Translated Tool</div>
          <div className={styles.subTitle}>version {APP_VERSION}</div>
          <ButtonHompage history={history} classes={styles} />
          <div className={styles.subTitle}>
            {'<Now support newest version of Ipad!!>'}
          </div>
          {/* <div className={styles.heading1}>BanG Dream Translated Tool</div>
          <div className={styles.subTitle}>version {APP_VERSION}</div>
          <SignIn onClick={() => history.push(routes.MainMenu.locate)} /> */}
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(BodyAreaPane));
