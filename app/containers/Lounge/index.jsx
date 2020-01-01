'use strict';

import * as actions from './actions';

import { Button, IconButton, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import { makeCtx, makeVideoCapture, makeVideoFilePath } from './selectors';

import { APP_TITLE } from '../../constants/meta';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import { Helmet } from 'react-helmet';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import StopIcon from '@material-ui/icons/Stop';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import reducers from './reducers';
import { styles } from './styles';
import { withReducer } from '../../store/reducers/withReducer';
import { withStyles } from '@material-ui/core/styles';

const mapStateToProps = (state, props) => {
  return {
    ...makeVideoFilePath(state),
    ...makeVideoCapture(state),
    ctx: makeCtx(state)
  };
};

class Lounge extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  componentDidMount() {
    const { sendContext } = this.props;
    sendContext(this.canvas);
  }

  render() {
    const {
      videoFileName,
      dWidth,
      dHeight,
      playVideo,
      stopVideo,
      previousFrame,
      nextFrame,
      rewindFrame,
      skipFrame
    } = this.props;
    return (
      <>
        <Helmet titleTemplate={`%s - ${APP_TITLE}`}>
          <title>OpenCV Tests!</title>
        </Helmet>

        <h1>OpenCV Tests!</h1>
        <Button className={styles.btn} onClick={this.openFile.bind(this)}>
          Open CV Tests
        </Button>
        <IconButton onClick={stopVideo}>
          <StopIcon />
        </IconButton>
        <IconButton onClick={playVideo}>
          <PlayArrowIcon />
        </IconButton>
        <IconButton onClick={previousFrame}>
          <SkipPreviousIcon />
        </IconButton>
        <IconButton onClick={nextFrame}>
          <SkipNextIcon />
        </IconButton>
        <IconButton onClick={rewindFrame}>
          <FastRewindIcon />
        </IconButton>
        <IconButton onClick={skipFrame}>
          <FastForwardIcon />
        </IconButton>
        <Typography variant='body1'>{videoFileName}</Typography>
        <canvas ref={this.canvas} width={dWidth} height={dHeight} />
      </>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(actions, dispatch);

export default withReducer('Lounge', reducers)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(Lounge))
);
