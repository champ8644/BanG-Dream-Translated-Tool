import * as actions from './actions';

/* eslint-disable no-await-in-loop  */
/* eslint-disable react/destructuring-assignment */
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
    const { testStart, mode, testData, callBack, interval } = this.props;
    testStart({
      mode,
      testData,
      callBack,
      interval
    });
  }

  componentWillUnmount() {
    this.props.testReset();
  }

  render() {
    const {
      classes: styles,
      currentStep,
      progress,
      show,
      text,
      answering,
      showButton,
      disabledButton,
      showStatus,
      feedback,
      showProgress,
      interval
    } = this.props;
    return (
      <div className={styles.root} ref={this.myRef}>
        {showProgress && (
          <BorderLinearProgress
            key={currentStep}
            variant='determinate'
            delay={interval}
            color='secondary'
            value={progress}
          />
        )}
        <GrowingText show={show} text={text} />
        <CircularNumber
          total={maxNum}
          show={showButton}
          answering={answering}
          disabled={disabledButton}
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
