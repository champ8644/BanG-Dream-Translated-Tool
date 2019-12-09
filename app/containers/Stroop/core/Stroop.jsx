import * as actions from './actions';

/* eslint-disable no-await-in-loop  */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
/* eslint-disable prefer-template */
import React, { Component } from 'react';
import { hotkey, hotkeyString } from '../constants/constant';

import BorderLinearProgress from '../components/BorderLinearProgress';
import CenteredText from '../components/CenteredText';
import CrossHair from '../components/CrossHair';
import Hotkeys from 'react-hot-keys';
import PopoverStatus from '../components/PopoverStatus';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import reducers from './reducers';
import { styles } from '../styles/Stroop';
import { withReducer } from '../../../store/reducers/withReducer';
import { withStyles } from '@material-ui/core/styles';

const mapStateToProps = state => {
  return state.Stroop;
};

class Stroop extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    console.log('mount stroop');
    this.props.testStart({
      interval: this.props.interval || 2000,
      testData: this.props.testData,
      length: this.props.testData.length,
      callBack: this.props.callBack.bind(this)
    });
  }

  componentWillUnmount() {
    console.log('unmount stroop');
    this.props.testReset();
  }

  onKeyDown(keyName) {
    hotkey.forEach(item => {
      if (item.key === keyName) {
        if (this.props.answer === item.color)
          this.props.answerCorrect(item.color);
        else this.props.answerWrong(item.color);
      }
    });
  }

  render() {
    const {
      classes: styles,
      color,
      backgroundColor,
      frame,
      interval,
      progress,
      text,
      showStatus,
      showX,
      showText,
      feedback
    } = this.props;
    console.log('this.props: ', this.props);

    return (
      <Hotkeys keyName={hotkeyString} onKeyDown={this.onKeyDown.bind(this)}>
        <div className={styles.root} ref={this.myRef}>
          <BorderLinearProgress
            key={frame}
            variant='determinate'
            background={backgroundColor}
            delay={interval}
            value={progress}
          />
          <CrossHair show={showX} backgroundColor={backgroundColor} />
          <CenteredText show={showText} color={color} text={text} />
          <PopoverStatus
            show={showStatus}
            type={feedback}
            myRef={this.myRef.current}
          />
        </div>
      </Hotkeys>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(actions, dispatch);

export default withReducer('Stroop', reducers)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(Stroop))
);
