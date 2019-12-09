'use strict';

/* eslint no-case-declarations: off */

import React, { PureComponent } from 'react';

import { APP_VERSION } from '../../constants/meta';
import Button from '@material-ui/core/Button';
import { log } from '@Log';
import { routes } from '../../routing/mainSub';
import { styles } from './styles/BodyAreaPane';
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
          onClick={() => history.push(routes.Stroop.path)}
        >
          Stroop
        </Button>
        <Button
          className={styles.btn2}
          onClick={() => history.push(routes.PVSAT.path)}
        >
          PVSAT
        </Button>
        {/*         
        <div className={styles.btnWrapper}>
          <Button
            variant='outlined'
            color='secondary'
            className={styles.btn}
            onClick={onSendAlertsBtn.bind(this, {
              variant: 'info',
              autoHideDuration: 3000
            })}
          >
            TIMEOUT INFO ALERT 3 second
          </Button>
        </div>
        <div className={styles.btnWrapper}>
          <Button
            variant='contained'
            color='secondary'
            className={styles.btn}
            onClick={onSendAlertsBtn.bind(this, {
              variant: 'warning'
            })}
          >
            SEND WARNING
          </Button>
          <Button
            variant='contained'
            color='secondary'
            className={styles.btn}
            onClick={onSendAlertsBtn.bind(this, {
              variant: 'success'
            })}
          >
            SUCCESS ALERT
          </Button>
        </div>
        <div>
          <Link to={routes.SecondPage.path}>Goto Second Page</Link>
          <br />
          <Link to={routes.OpenCV.path}>Goto OpenCV</Link>
          <br />
          <Link to={routes.TestFieldPage.path}>Goto Test</Link>
          <img
            src={imgsrc('keyboard.jpg')}
            width='100px'
            height='auto'
            alt=''
          /> */}
        {/*
          // Import a image from the local path.
          // Default images folder: ./app/public/images
          
          <img
            src={imgsrc('keyboard.jpg')}
            width="100px"
            height="auto"
          />
          
          imgsrc
           * default path: ../public/images/
           * @param filePath (string)
           * @param returnNoImageFound (bool) (optional)
          */}
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(BodyAreaPane));
