'use strict';

/* eslint no-case-declarations: off, no-unused-vars: off */

import { Link, withRouter } from 'react-router-dom';
import React, { PureComponent } from 'react';

import Button from '@material-ui/core/Button';
import CountDown from './CountDown';
import Stroop from './Stroop';
import { imgsrc } from '../../../utils/imgsrc';
import { log } from '@Log';
import { routes } from '../../../routing';
import { styles } from '../styles/BodyAreaPane';
import { withStyles } from '@material-ui/core/styles';

class BodyAreaPane extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      step: 0
    };
  }

  progressStep() {
    this.setState(state => ({ step: state.step + 1 }));
  }

  render() {
    const { classes: styles, onSendAlertsBtn } = this.props;
    const { step } = this.state;
    let MainComponent;
    switch (step) {
      case 0:
        MainComponent = <div className={styles.centeredText}>Hello</div>;
        this.progressStep();
        break;
      case 1:
        MainComponent = (
          <CountDown
            from={3}
            interval={1000}
            fade={300}
            callBack={() => this.progressStep()}
          />
        );
        break;
      case 2:
        MainComponent = (
          <Stroop interval={1000} callBack={() => this.progressStep()} />
        );
        break;
      default:
        MainComponent = (
          <div className={styles.centeredText}>End of the test.</div>
        );
    }
    return <div className={styles.root}>{MainComponent}</div>;
  }
}

export default withRouter(withStyles(styles)(BodyAreaPane));
