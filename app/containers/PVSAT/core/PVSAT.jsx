import * as actions from './actions';

/* eslint-disable no-await-in-loop  */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
/* eslint-disable prefer-template */
import React, { Component } from 'react';

import BorderLinearProgress from '../../../components/BorderLinearProgress';
import CircularNumber from '../components/CircularNumber';
import GrowingText from '../components/GrowingText';
import PopoverStatus from '../../../components/PopoverStatus';
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
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

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
      answerCorrect,
      answerWrong,
      disabledButton,
      showStatus,
      feedback
    } = this.props;
    return (
      <div className={styles.root} ref={this.myRef}>
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
          answerCorrect={answerCorrect}
          answerWrong={answerWrong}
        />
        <PopoverStatus
          show={showStatus}
          type={feedback}
          myRef={this.myRef.current}
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
