'use strict';

/* eslint no-case-declarations: off, no-unused-vars: off */

import { Link, withRouter } from 'react-router-dom';
import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import CountDown from './CountDown';
import Stroop from './Stroop';
import { imgsrc } from '../../../utils/imgsrc';
import { log } from '@Log';
import { routes } from '../../../routing';
import { styles } from '../styles/BodyAreaPane';
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
    { color: 'black', background: 'white', text: 'แดง', answer: 'red' },
    { color: 'black', background: 'white', text: 'เหลือง', answer: 'yellow' },
    { color: 'black', background: 'white', text: 'เขียว', answer: 'green' },
    { color: 'black', background: 'white', text: 'น้ำเงิน', answer: 'blue' },
    { color: 'black', background: 'white', text: 'เหลือง', answer: 'yellow' }
  ],
  [
    { color: 'red', background: 'black', text: 'เหลือง', answer: 'red' },
    { color: 'yellow', background: 'black', text: 'น้ำเงิน', answer: 'yellow' },
    { color: 'green', background: 'black', text: 'แดง', answer: 'green' },
    { color: 'blue', background: 'black', text: 'เขียว', answer: 'blue' },
    { color: 'green', background: 'black', text: 'เหลือง', answer: 'green' }
  ]
];

class BodyAreaPane extends Component {
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
          <Stroop
            interval={2000}
            fade={300}
            testData={testData[0]}
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
            fade={300}
            testData={testData[1]}
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
            fade={300}
            testData={testData[2]}
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

export default withRouter(withStyles(styles)(BodyAreaPane));
