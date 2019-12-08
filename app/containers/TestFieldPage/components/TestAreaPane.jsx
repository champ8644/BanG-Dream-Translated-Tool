'use strict';

/* eslint no-case-declarations: off, no-unused-vars: off */

import { Link, withRouter } from 'react-router-dom';
import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import CountDown from '../../../components/CountDown';
import PVSAT from '../../PVSAT';
import Stroop from '../../Stroop';
import { imgsrc } from '../../../utils/imgsrc';
import { log } from '@Log';
import { routes } from '../../../routing';
import { styles } from '../styles/BodyAreaPane';
import { timeOut } from '../../../utils/asyncHelper';
import { withStyles } from '@material-ui/core/styles';

const testData = [
  [
    { color: 'yellow', background: 'yellow', text: '', answer: 'yellow' },
    { color: 'red', background: 'red', text: '', answer: 'red' },
    { color: 'green', background: 'green', text: '', answer: 'green' },
    { color: 'yellow', background: 'yellow', text: '', answer: 'yellow' },
    { color: 'blue', background: 'blue', text: '', answer: 'blue' }
  ],
  [
    { color: 'white', background: 'black', text: 'แดง', answer: 'red' },
    { color: 'white', background: 'black', text: 'เหลือง', answer: 'yellow' },
    { color: 'white', background: 'black', text: 'เขียว', answer: 'green' },
    { color: 'white', background: 'black', text: 'น้ำเงิน', answer: 'blue' },
    { color: 'white', background: 'black', text: 'เหลือง', answer: 'yellow' }
  ],
  [
    { color: 'red', background: 'black', text: 'เหลือง', answer: 'red' },
    { color: 'yellow', background: 'black', text: 'น้ำเงิน', answer: 'yellow' },
    { color: 'green', background: 'black', text: 'แดง', answer: 'green' },
    { color: 'blue', background: 'black', text: 'เขียว', answer: 'blue' },
    { color: 'green', background: 'black', text: 'เหลือง', answer: 'green' }
  ]
];

// const maxNum = 14;
// const numOfTests = 10;
// const randomNum = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
// const testData = [{ text: randomNum(1, maxNum - 1), answer: null }];

// for (let i = 1; i < numOfTests; i += 1) {
//   const r = randomNum(1, maxNum - testData[i - 1].text);
//   testData.push({ text: r, answer: testData[i - 1].text + r });
// }

class TestAreaPane extends Component {
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
        MainComponent = <div className={styles.centeredText}>Stroop</div>;
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
          <Stroop
            interval={2000}
            testData={testData[0]}
            onSendAlertsBtn={onSendAlertsBtn}
            callBack={() => this.progressStep()}
          />
        );
        break;
      case 3:
        MainComponent = (
          <CountDown
            from={3}
            interval={1000}
            fade={300}
            callBack={() => this.progressStep()}
          />
        );
        break;
      case 4:
        MainComponent = (
          <Stroop
            interval={2000}
            testData={testData[1]}
            onSendAlertsBtn={onSendAlertsBtn}
            callBack={() => this.progressStep()}
          />
        );
        break;
      case 5:
        MainComponent = (
          <CountDown
            from={3}
            interval={1000}
            fade={300}
            callBack={() => this.progressStep()}
          />
        );
        break;
      case 6:
        MainComponent = (
          <Stroop
            interval={2000}
            testData={testData[2]}
            onSendAlertsBtn={onSendAlertsBtn}
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

export default withRouter(withStyles(styles)(TestAreaPane));
