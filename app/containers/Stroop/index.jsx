import * as actions from './actions';

/* eslint-disable no-await-in-loop  */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-console */
/* eslint-disable prefer-template */
import React, { Component } from 'react';
import { hotkey, hotkeyString } from './constants/constant';

import BorderLinearProgress from './components/BorderLinearProgress';
import CenteredText from './components/CenteredText';
import Hotkeys from 'react-hot-keys';
import PopoverStatus from './components/PopoverStatus';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import reducers from './reducers';
import { styles } from './styles';
import { withReducer } from '../../store/reducers/withReducer';
import { withStyles } from '@material-ui/core/styles';

const mapStateToProps = state => {
  return state.Stroop;
};

class Stroop extends Component {
  componentDidMount() {
    this.props.testStart({
      interval: this.props.interval || 2000,
      testData: this.props.testData,
      length: this.props.testData.length,
      callBack: this.props.callBack.bind(this)
    });
  }

  componentWillUnmount() {
    this.props.testReset();
  }

  onKeyDown(keyName) {
    hotkey.forEach(item => {
      if (item.key === keyName) {
        if (this.props.answer === item.color) this.props.answerCorrect();
        else this.props.answerWrong();
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
      showStatus
    } = this.props;

    return (
      <Hotkeys keyName={hotkeyString} onKeyDown={this.onKeyDown.bind(this)}>
        <div className={styles.root}>
          <BorderLinearProgress
            key={frame}
            variant='determinate'
            colorbackground={backgroundColor}
            delay={interval}
            value={progress}
          />
          <div className={styles.root} style={{ backgroundColor, color }}>
            <CenteredText>{text}</CenteredText>
          </div>
          <PopoverStatus text={showStatus} />
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
