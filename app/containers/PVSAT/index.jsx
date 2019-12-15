'use strict';

/* eslint no-case-declarations: off, no-unused-vars: off */

import React, { Component } from 'react';
import { maxNum, numOfTests } from './constants/constant';

import CountDown from '../../components/CountDown';
import PVSAT from './core/PVSAT';
import { imgsrc } from '../../utils/imgsrc';
import { log } from '@Log';
import { styles } from './styles';
import { timeOut } from '../../utils/asyncHelper';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

const randomNum = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const testData = [{ text: randomNum(1, maxNum - 1), answer: null }];

for (let i = 1; i < numOfTests; i += 1) {
  const r = randomNum(1, maxNum - testData[i - 1].text);
  testData.push({ text: r, answer: testData[i - 1].text + r });
}

class PVSATWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0
    };
    this.orders = [];
  }

  componentDidMount() {
    const {
      match: { params }
    } = this.props;
    switch (params.id) {
      case 'D':
        this.mode = 'Demo';
        break;
      case 'A':
        this.mode = 'PreTest';
        break;
      case 'B':
        this.mode = 'PostTest';
        break;
      default:
        this.mode = '';
    }
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
            background='white'
            callBack={() => this.progressStep()}
          />
        );
        break;
      case 2:
        MainComponent = (
          <PVSAT
            mode={this.mode}
            testData={testData}
            interval={4000}
            callBack={() => this.progressStep()}
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

export default withRouter(withStyles(styles)(PVSATWrapper));
