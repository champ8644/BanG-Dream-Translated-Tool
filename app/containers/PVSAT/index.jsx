import * as actions from './actions';

/* eslint-disable no-await-in-loop  */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
/* eslint-disable prefer-template */
import React, { Component } from 'react';

import BorderLinearProgress from './components/BorderLinearProgress';
import CircularNumber from './components/CircularNumber';
import GrowingText from './components/GrowingText';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import reducers from './reducers';
import { styles } from './styles';
import { withReducer } from '../../store/reducers/withReducer';
import { withStyles } from '@material-ui/core/styles';

const mapStateToProps = state => {
  return state.PVSAT;
};

class PVSAT extends Component {
  constructor(props) {
    super(props);
    const { propToState } = props;
    propToState({
      iTime: this.props.interval - this.props.fade,
      eTime: this.props.fade,
      length: this.props.testData.length,
      testData: this.props.testData,
      callBack: () => this.props.callBack(this.state.results)
    });
    // this.timer = {
    //   play: () => this.setState({ progress: 100 }),
    //   reset: () =>
    //     this.setState(state => ({ frame: state.frame + 1, progress: 0 })),
    //   restart: async () => {
    //     this.setState(state => ({ frame: state.frame + 1, progress: 0 }));
    //     await timeOut(1);
    //     this.setState({ progress: 100, beginTs: new Date().getTime() });
    //   }
    // };
    // this.answer = {
    //   timeOut: () => {
    //     let reactionTime = new Date().getTime() - this.state.beginTs;
    //     if (reactionTime > this.props.interval)
    //       reactionTime = this.props.interval;
    //     this.setState(state => ({
    //       results: {
    //         ...state.results,
    //         [state.currentStep]: {
    //           reactionTime,
    //           correct: false
    //         }
    //       },
    //       currentStep: state.currentStep + 1
    //     }));
    //     console.log('this.state', this.state);
    //     this.test.iterate();
    //   },
    //   correct: async () => {},
    //   wrong: async () => {}
    // };
    // this.test = {
    //   start: async () => {
    //     this.setState({ show: true, currentStep: 0 });
    //     this.timer.restart();
    //     await timeOut(this.props.interval - this.props.fade);
    //     this.setState({ show: false });
    //     await timeOut(this.props.fade);
    //     this.progressStep();
    //     this.setState({ showButton: true });
    //     this.test.iterate();
    //   },
    //   iterate: async () => {
    //     const { currentStep } = this.state;
    //     if (currentStep === this.props.testData.length) {
    //       this.test.finish();
    //       return;
    //     }
    //     const { text, answer } = this.props.testData[currentStep];
    //     this.setState({
    //       text,
    //       answer,
    //       show: true
    //     });
    //     this.timer.restart();

    //     await timeOut(this.props.interval - this.props.fade);
    //     if (this.state.currentStep !== currentStep) return;

    //     this.setState({ show: false });

    //     await timeOut(this.props.fade);
    //     if (this.state.currentStep !== currentStep) return;

    //     this.answer.timeOut();
    //   },
    //   finish: () => {
    //     this.props.callBack(this.state.results);
    //   }
    // };
    // this.throw = {
    //   success: () =>
    //     this.props.onSendAlertsBtn({
    //       variant: 'success',
    //       message: `${this.state.answer} is the correct answer.`
    //     }),
    //   error: text =>
    //     this.props.onSendAlertsBtn({
    //       variant: 'warning',
    //       message: `${text} is wrong.`
    //     })
    // };
  }

  componentDidMount() {
    this.props.testStart();
  }

  throwSuccess() {
    this.props.onSendAlertsBtn({
      variant: 'success',
      message: `${this.props.answer} is the correct answer.`
    });
  }

  throwError(text) {
    this.props.onSendAlertsBtn({
      variant: 'warning',
      message: `${text} is wrong.`
    });
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
      showButton
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
        {showButton ? (
          <CircularNumber
            total={14}
            answer={answer}
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

const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(actions, dispatch);

export default withReducer('PVSAT', reducers)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(PVSAT))
);
