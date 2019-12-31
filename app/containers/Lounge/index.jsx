'use strict';

import * as actions from './actions';

import React, { Component } from 'react';

import { Button, Typography } from '@material-ui/core';
import { APP_TITLE } from '../../constants/meta';
import { Helmet } from 'react-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import reducers from './reducers';
import { withReducer } from '../../store/reducers/withReducer';
import { styles } from './styles';
import { withStyles } from '@material-ui/core/styles';
import { remote } from 'electron';
import path from 'path';
import { makeVideoFilePath, makeVideoFileName } from './selectors';
import cv from 'opencv4nodejs';

const { dialog } = remote;
const { app } = remote;

const mapStateToProps = (state, props) => {
  return {
    videoFilePath: makeVideoFilePath(state),
    videoFileName: makeVideoFileName(state)
  };
};

class Lounge extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.FPS = 30;
    this.src = new cv.Mat(height, width, cv.CV_8UC4);
    this.dst = new cv.Mat(height, width, cv.CV_8UC1);
    this.cap = new cv.VideoCapture(videoSource);
  }

  componentDidMount() {
    const ctx = this.canvas.current.getContext('2d');
    ctx.fillRect(0, 0, 100, 100);
    setTimeout(processVideo, 0);
  }

  handleClick() {
    const { selectNewVideo } = this.props;
    this.rect({ x: 50, y: 50, width: 150, height: 150 });
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

  rect(props) {
    const ctx = this.canvas.current.getContext('2d');
    const { x, y, width, height } = props;
    ctx.fillRect(x, y, width, height);
  }

  processVideo() {
    const { cap, dst, src, FPS } = this;
    let begin = Date.now();
    cap.read(src);
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.imshow('canvasOutput', dst);
    // schedule next one.
    let delay = 1000 / FPS - (Date.now() - begin);
    setTimeout(processVideo, delay);
  }

  render() {
    const { videoFileName } = this.props;
    return (
      <>
        <Helmet titleTemplate={`%s - ${APP_TITLE}`}>
          <title>Third Page!</title>
        </Helmet>

        <h1>This is the third page!</h1>
        <Button className={styles.btn} onClick={this.handleClick.bind(this)}>
          Open CV Tests
        </Button>
        <Typography variant='body1'>{videoFileName}</Typography>
        <canvas ref={this.canvas} width={300} height={300} />
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
