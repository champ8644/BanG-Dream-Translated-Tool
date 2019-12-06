import { BorderLinearProgress, GrowingText } from './BuildingBlocks';
/* eslint-disable no-await-in-loop  */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
/* eslint-disable prefer-template */
import React, { Component } from 'react';

import Hotkeys from 'react-hot-keys';
import { styles } from '../styles/Stroop';
import { timeOut } from '../../../utils/asyncHelper';
import { withStyles } from '@material-ui/core/styles';

class Stroop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      progress: 0,
      color: '',
      backgroundColor: '',
      text: '',
      answer: '',
      frame: 0
    };
  }

  componentDidMount() {
    this.timer = setInterval(
      () =>
        this.setState(state => {
          let next = state.progress + 40000 / this.props.interval;
          if (next > 100) next = 100;
          if (next < 0) next = 0;
          return { progress: next };
        }),
      400
    );
    this.startAnimations();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  async startAnimations() {
    for (let i = 0; i < this.props.testData.length; i += 1) {
      const {
        color,
        background: backgroundColor,
        text,
        answer
      } = this.props.testData[i];
      this.setState(state => ({
        color,
        backgroundColor,
        text,
        answer,
        show: true,
        progress: 0,
        frame: state.frame + 1
      }));
      await timeOut(this.props.interval - this.props.fade);
      this.setState({ show: false });
      await timeOut(this.props.fade);
    }
    this.props.callBack();
  }

  onKeyDown(keyName) {
    const throwSuccess = () =>
      this.props.onSendAlertsBtn({
        variant: 'success',
        message: this.state.answer + ' is the correct answer.'
      });
    const throwError = text =>
      this.props.onSendAlertsBtn({
        variant: 'warning',
        message: text + ' is wrong.'
      });
    switch (keyName) {
      case 'j':
        if (this.state.answer === 'yellow') throwSuccess();
        else throwError('yellow');
        break;
      case 'k':
        if (this.state.answer === 'green') throwSuccess();
        else throwError('green');
        break;
      case 'l':
        if (this.state.answer === 'blue') throwSuccess();
        else throwError('blue');
        break;
      case ';':
        if (this.state.answer === 'red') throwSuccess();
        else throwError('red');
        break;
      default:
        break;
    }
  }

  render() {
    const { classes: styles } = this.props;
    const { color, backgroundColor } = this.state;
    return (
      <Hotkeys keyName='j,k,l,;' onKeyDown={this.onKeyDown.bind(this)}>
        <BorderLinearProgress
          key={this.state.frame}
          variant='determinate'
          color='secondary'
          delay={this.props.interval}
          value={this.state.progress}
        />

        <div className={styles.root} style={{ backgroundColor, color }}>
          <GrowingText
            show={this.state.show}
            fade={this.props.fade}
            text={this.state.text}
          />
        </div>
      </Hotkeys>
    );
  }
}

export default withStyles(styles)(Stroop);
