'use strict';

/* eslint no-case-declarations: off, no-unused-vars: off */

import { Link, withRouter } from 'react-router-dom';
import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import CountDown from './CountDown';
import PVSAT from '../../PVSAT';
import Stroop from './Stroop';
import { imgsrc } from '../../../utils/imgsrc';
import { log } from '@Log';
import { routes } from '../../../routing';
import { styles } from '../styles/BodyAreaPane';
import { timeOut } from '../../../utils/asyncHelper';
import { withStyles } from '@material-ui/core/styles';

const maxNum = 14;
const numOfTests = 10;
const randomNum = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const testData = [{ text: randomNum(1, maxNum - 1), answer: null }];

for (let i = 1; i < numOfTests; i += 1) {
  const r = randomNum(1, maxNum - testData[i - 1].text);
  testData.push({ text: r, answer: testData[i - 1].text + r });
}

class TestAreaPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 2
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
        MainComponent = <div className={styles.centeredText}>PVSAT</div>;
        timeOut(1000)
          .then(() => this.progressStep())
          .catch(err => {
            throw err;
          });
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
          <PVSAT
            interval={4000}
            fade={300}
            testData={testData}
            onSendAlertsBtn={onSendAlertsBtn}
            callBack={results => {
              this.progressStep();
            }}
          />
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

export default withRouter(withStyles(styles)(TestAreaPane));
