import * as actions from './actions';

/* eslint-disable no-await-in-loop  */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
/* eslint-disable prefer-template */
import React, { Component } from 'react';

import BorderLinearProgress from '../../../components/BorderLinearProgress';
import CircularNumber from '../components/CircularNumber';
import GrowingText from '../components/GrowingText';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { maxNum } from '../constants/constant';
import reducers from './reducers';
import { styles } from '../styles';
import { withReducer } from '../../../store/reducers/withReducer';
import { withStyles } from '@material-ui/core/styles';

const mapStateToProps = state => {
  return state.PVSAT;
};

class PVSAT extends Component {
  componentDidMount() {
    const {
      propToState,
      testStart,
      interval,
      fade,
      mode,
      testData,
      callBack
    } = this.props;
    console.log('mode: ', mode);
    if (mode === 'Demo') {
      propToState({
        iTime: interval - fade,
        eTime: fade,
        length: testData.length,
        mode,
        testData,
        callBack: callBack.bind(this)
      });
    } else {
      propToState({
        iTime: interval - fade,
        eTime: fade,
        length: testData.length,
        mode,
        testData,
        callBack: callBack.bind(this)
      });
    }
    testStart();
  }

  componentWillUnmount() {
    this.props.testReset();
  }

  throwSuccess() {
    this.props.onSendAlertsBtn({
      variant: 'success',
      message: `${this.props.answer} is the correct answer.`
    });
    this.props.answerCorrect();
  }

  throwError(clickedIndex) {
    this.props.onSendAlertsBtn({
      variant: 'warning',
      message: `${clickedIndex} is wrong. The correct answer is ${
        this.props.answer
      }`
    });
    this.props.answerWrong();
  }

  render() {
    const {
      classes: styles,
      interval,
      progress,
      show,
      fade,
      text,
      answer,
      frame,
      showButton,
      disabledButton
    } = this.props;
    return (
      <div className={styles.root}>
        <BorderLinearProgress
          key={frame}
          variant='determinate'
          color='secondary'
          delay={interval}
          value={progress}
        />
        <GrowingText show={show} fade={fade} text={text} />
        <CircularNumber
          total={maxNum}
          show={showButton}
          fade={fade}
          answer={answer}
          disabled={disabledButton}
          throwSuccess={this.throwSuccess.bind(this)}
          throwError={this.throwError.bind(this)}
        />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(actions, dispatch);

export default withReducer('PVSAT', reducers)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(PVSAT))
);
