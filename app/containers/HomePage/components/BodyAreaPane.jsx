'use strict';

/* eslint no-case-declarations: off */

import { Link, withRouter } from 'react-router-dom';
import React, { PureComponent } from 'react';

import { APP_VERSION } from '../../../constants/meta';
import Button from '@material-ui/core/Button';
import { log } from '@Log';
import { routes } from '../../../routing';
import { styles } from '../styles/BodyAreaPane';
import { withStyles } from '@material-ui/core/styles';

class BodyAreaPane extends PureComponent {
  render() {
    const { classes: styles } = this.props;

    return (
      <div className={styles.root}>
        <div className={styles.title}>Cognitive-Fatique-Evaluater</div>
        <div className={styles.subTitle}>{APP_VERSION}</div>
        <Link to={routes.TestFieldPage.path} style={{ textDecoration: 'none' }}>
          <Button className={styles.btn}>Stroop</Button>
        </Link>
        <Link to={routes.TestingPage.path} style={{ textDecoration: 'none' }}>
          <Button className={styles.btn2}>PVSAT</Button>
        </Link>
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
