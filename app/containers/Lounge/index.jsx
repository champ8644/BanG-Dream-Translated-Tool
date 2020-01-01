'use strict';

import * as actions from './actions';

import React, { Component } from 'react';
import {
  makeDialogData,
  makeFrameData,
  makeVideoCapture,
  makeVideoFilePath
} from './selectors';

import { APP_TITLE } from '../../constants/meta';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import { Helmet } from 'react-helmet';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import PieChartIcon from '@material-ui/icons/PieChart';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import StopIcon from '@material-ui/icons/Stop';
import TextField from '@material-ui/core/TextField';
import TheatersIcon from '@material-ui/icons/Theaters';
import TimerIcon from '@material-ui/icons/Timer';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { formatNumber } from './constants/function';
import reducers from './reducers';
import { styles } from './styles';
import { withReducer } from '../../store/reducers/withReducer';
import { withStyles } from '@material-ui/core/styles';

const mapStateToProps = (state, props) => {
  return {
    ...makeVideoFilePath(state),
    ...makeVideoCapture(state),
    ...makeFrameData(state),
    dialog: makeDialogData(state)
  };
};

class Lounge extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  componentDidMount() {
    const { sendCanvas } = this.props;
    sendCanvas(this.canvas);
  }

  render() {
    const {
      classes,
      videoFileName,
      dWidth,
      dHeight,
      startVideo,
      stopVideo,
      previousFrame,
      nextFrame,
      rewindFrame,
      skipFrame,
      openFile,
      frame,
      vCap,
      length,
      handleChangeDialog,
      handleCancelDialog,
      handleConfirmDialog,
      handleKeyDownDialog,
      handleOpenDialog,
      dialog,
      ms,
      percent,
      FPS
    } = this.props;
    return (
      <>
        <Helmet titleTemplate={`%s - ${APP_TITLE}`}>
          <title>OpenCV Tests!</title>
        </Helmet>

        <h1>OpenCV Tests!</h1>
        <Button className={classes.btn} onClick={openFile}>
          Open CV Tests
        </Button>
        {vCap && (
          <>
            <Paper elevation={2} className={classes.paper}>
              <IconButton onClick={rewindFrame}>
                <FastRewindIcon />
              </IconButton>
              <IconButton onClick={previousFrame}>
                <SkipPreviousIcon />
              </IconButton>
              <IconButton onClick={startVideo}>
                <PlayArrowIcon />
              </IconButton>
              <IconButton onClick={stopVideo}>
                <StopIcon />
              </IconButton>
              <IconButton onClick={nextFrame}>
                <SkipNextIcon />
              </IconButton>
              <IconButton onClick={skipFrame}>
                <FastForwardIcon />
              </IconButton>
            </Paper>
            <Tooltip title='Go To selected frame' arrow>
              <Chip
                className={classes.chip}
                icon={<TheatersIcon />}
                label={`Frame: ${formatNumber(frame)}/${formatNumber(length)}`}
                color='secondary'
                variant='outlined'
                clickable
                onClick={() => handleOpenDialog('frame')}
              />
            </Tooltip>
            <Tooltip title='Go To selected time' arrow>
              <Chip
                className={classes.chip}
                icon={<TimerIcon />}
                label={`Time: ${formatNumber(ms)}/${formatNumber(
                  (length * 1000) / FPS
                )} ms`}
                variant='outlined'
                clickable
                onClick={() => handleOpenDialog('ms')}
              />
            </Tooltip>
            <Tooltip title='Go To selected time' arrow>
              <Chip
                className={classes.chip}
                icon={<PieChartIcon />}
                label={`${percent}/100%`}
                variant='outlined'
                clickable
                onClick={() => handleOpenDialog('percent')}
              />
            </Tooltip>
            <Typography variant='body1'>{videoFileName}</Typography>
          </>
        )}
        <canvas ref={this.canvas} width={dWidth} height={dHeight} />

        <Dialog open={dialog.open} onClose={handleCancelDialog}>
          <DialogContent>
            <TextField
              autoFocus
              margin='dense'
              label='Go to frame'
              value={dialog.value}
              onChange={handleChangeDialog}
              onKeyDown={handleKeyDownDialog}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    / {dialog.maxValue}
                  </InputAdornment>
                )
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmDialog} color='primary'>
              Go to {dialog.type}
            </Button>
            <Button onClick={handleCancelDialog} color='primary'>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
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
