'use strict';

import * as actions from './actions';

import { Button, IconButton, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import { makeVideoCapture, makeVideoFilePath } from './selectors';

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
import cv from 'opencv4nodejs';
import path from 'path';
import reducers from './reducers';
import { remote } from 'electron';
import { styles } from './styles';
import { withReducer } from '../../store/reducers/withReducer';
import { withStyles } from '@material-ui/core/styles';

const { dialog } = remote;
const { app } = remote;

const mapStateToProps = (state, props) => {
  const out = {
    ...makeVideoFilePath(state),
    ...makeVideoCapture(state)
  };
  // if (out.vCap) {
  //   out.frame = out.vCap.get(cv.CAP_PROP_POS_FRAMES);
  //   out.percent = out.vCap.get(cv.CAP_PROP_POS_AVI_RATIO * 100);
  //   out.ms = out.vCap.get(cv.CAP_PROP_POS_MSEC);
  // }
  return out;
};

class Lounge extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  componentDidUpdate() {
    this.ctx = this.canvas.current.getContext('2d');
  }

  openFile() {
    const { selectNewVideo } = this.props;
    const toLocalPath = path.resolve(app.getPath('desktop'));
    const userChosenPath = dialog.showOpenDialog({
      defaultPath: toLocalPath,
      properties: ['openFile'],
      filters: [
        {
          name: 'Video files',
          extensions: ['mkv', 'avi', 'mp4', 'mov', 'flv', 'wmv']
        }
      ]
    });
    if (!userChosenPath) return;
    selectNewVideo(userChosenPath[0]);
  }

  playVideo() {
    const { vCap } = this.props;
    const delay = 10;
    let done = false;
    while (!done) {
      let frame = vCap.read();
      // loop back to start on end of stream reached
      if (frame.empty) {
        vCap.reset();
        frame = vCap.read();
      }

      const outFrame = frame.rescale(1 / this.div);
      const matRGBA =
        outFrame.channels === 1
          ? outFrame.cvtColor(cv.COLOR_GRAY2RGBA)
          : outFrame.cvtColor(cv.COLOR_BGR2RGBA);

      const imgData = new ImageData(
        new Uint8ClampedArray(matRGBA.getData()),
        outFrame.cols,
        outFrame.rows
      );
      // this.canvas.height = outFrame.rows;
      // this.canvas.width = outFrame.cols;
      const ctx = this.canvas.current.getContext('2d');
      ctx.putImageData(imgData, 0, 0);
      // ...

      const key = cv.waitKey(delay);
      done = key !== 255;
    }
  }

  async initVideo(path) {
    const vCap = new cv.VideoCapture(path);
    let begin = Date.now();
    let c = 0;
    const frame_no = 100;
    vCap.set(1, frame_no - 1);
    const playVideo = async () => {
      let frame = vCap.read();
      // loop back to start on end of stream reached
      console.log('frame.empty: ', frame.empty);
      console.log('vCap: ', vCap.get(cv.CAP_PROP_POS_FRAMES));
      //cv.CAP_PROP_FRAME_COUNT
      if (frame.empty) {
        vCap.reset();
        begin = Date.now();
        frame = vCap.read();
      }
      console.log('count', c++);
      const outFrame = frame.rescale(1 / this.div);

      const matRGBA =
        outFrame.channels === 1
          ? outFrame.cvtColor(cv.COLOR_GRAY2RGBA)
          : outFrame.cvtColor(cv.COLOR_BGR2RGBA);

      const imgData = new ImageData(
        new Uint8ClampedArray(matRGBA.getData()),
        outFrame.cols,
        outFrame.rows
      );
      // this.canvas.height = outFrame.rows;
      // this.canvas.width = outFrame.cols;
      const ctx = this.canvas.current.getContext('2d');
      ctx.putImageData(imgData, 0, 0);
      const delay = 1000 / this.FPS - (Date.now() - begin);
      setTimeout(playVideo, delay);
    };
    setTimeout(playVideo, 0);
  }

  render() {
    const { videoFileName, dWidth, dHeight } = this.props;
    return (
      <>
        <Helmet titleTemplate={`%s - ${APP_TITLE}`}>
          <title>OpenCV Tests!</title>
        </Helmet>

        <h1>OpenCV Tests!</h1>
        <Button className={styles.btn} onClick={this.openFile.bind(this)}>
          Open CV Tests
        </Button>
        <IconButton onClick={() => alert('Stop')}>
          <StopIcon />
        </IconButton>
        <IconButton onClick={this.playVideo.bind(this)}>
          <PlayArrowIcon />
        </IconButton>
        <IconButton onClick={() => alert('SkipPrev')}>
          <SkipPreviousIcon />
        </IconButton>
        <IconButton onClick={() => alert('SkipNext')}>
          <SkipNextIcon />
        </IconButton>
        <IconButton onClick={() => alert('Rewind')}>
          <FastRewindIcon />
        </IconButton>
        <IconButton onClick={() => alert('Forword')}>
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
