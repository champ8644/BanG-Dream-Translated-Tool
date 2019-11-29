'use strict';

/* eslint no-case-declarations: off */

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
        <div className={styles.btnWrapper}>
          <Button
            variant='outlined'
            color='secondary'
            className={styles.btn}
            onClick={onSendAlertsBtn}
          >
            SEND ERROR
          </Button>

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
          <img
            src={imgsrc('keyboard.jpg')}
            width='100px'
            height='auto'
            alt=''
          />
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
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(BodyAreaPane));
