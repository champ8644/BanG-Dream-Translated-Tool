import { BorderLinearProgress, GrowingText } from './BuildingBlocks';
/* eslint-disable no-await-in-loop  */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
/* eslint-disable prefer-template */
import React, { Component } from 'react';

import CircularNumber from './CircularNumber';
import { styles } from '../styles/Stroop';
import { timeOut } from '../../../utils/asyncHelper';
import { withStyles } from '@material-ui/core/styles';

class PVSAT extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      showButton: false,
      progress: 0,
      text: this.props.testData[0].text,
      answer: this.props.testData[0].answer,
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
    await timeOut(this.props.interval - this.props.fade);
    this.setState({ show: false });
    await timeOut(this.props.fade);
    this.setState({ showButton: true });
    for (let i = 1; i < this.props.testData.length; i += 1) {
      const { text, answer } = this.props.testData[i];
      this.setState(state => ({
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

  throwSuccess() {
    this.props.onSendAlertsBtn({
      variant: 'success',
      message: `${this.state.answer} is the correct answer.`
    });
  }

  throwError(text) {
    this.props.onSendAlertsBtn({
      variant: 'warning',
      message: `${text} is wrong.`
    });
  }

  render() {
    const { classes: styles } = this.props;
    return (
      <div className={styles.root}>
        <BorderLinearProgress
          key={this.frame}
          variant='determinate'
          color='secondary'
          value={this.state.progress}
        />
        <GrowingText
          show={this.state.show}
          fade={this.props.fade}
          text={this.state.text}
        />
        {this.state.showButton ? (
          <CircularNumber
            total={14}
            answer={this.state.answer}
            throwSuccess={this.throwSuccess.bind(this)}
            throwError={this.throwError.bind(this)}
          />
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(PVSAT);
