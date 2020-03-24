'use strict';

import * as actions from './actions';

import React, { Component } from 'react';
import {
  makeCurrentFrame,
  makeDialogData,
  makeOverlayMode,
  makePercentLinear,
  makeProgress,
  makeProgressBar,
  makeSlider,
  makeSliderObj,
  makeStatusData,
  makeVideoCapture,
  makeVideoFilePath,
  makeWillUpdateNextFrame
} from './selectors';

import { APP_TITLE } from '../../constants/meta';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import IconButton from '@material-ui/core/IconButton';
// import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import PieChartIcon from '@material-ui/icons/PieChart';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import Slider from '@material-ui/core/Slider';
import SpeedIcon from '@material-ui/icons/Speed';
import StopIcon from '@material-ui/icons/Stop';
import TextField from '@material-ui/core/TextField';
import TheatersIcon from '@material-ui/icons/Theaters';
import TimerIcon from '@material-ui/icons/Timer';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { bindActionCreators } from 'redux';
import clsx from 'clsx';
import { connect } from 'react-redux';
import electron from 'electron';
import { formatNumber } from './constants/function';
import { radioObj } from './constants/config';
import reducers from './reducers';
import { styles } from './styles';
import { withReducer } from '../../store/reducers/withReducer';
import { withStyles } from '@material-ui/core/styles';

const { ipcRenderer } = electron;

const CustomLinearProgress = withStyles({
  root: props => ({
    height: 10,
    backgroundColor: props.background || '#FFB1A8'
  }),
  bar: props => ({
    borderRadius: 20,
    backgroundColor: '#FF6C5C',
    transition: `transform ${props.delay}ms linear`
  })
})(LinearProgress);

const mapStateToProps = (state, props) => {
  return {
    ...makeVideoFilePath(state),
    vCap: makeVideoCapture(state),
    ...makeCurrentFrame(state),
    progress: makeProgress(state),
    progressFull: makeProgressBar(state),
    dialog: makeDialogData(state),
    status: makeStatusData(state),
    valueSlider: makeSlider(state),
    willUpdateNextFrame: makeWillUpdateNextFrame(state),
    overlayMode: makeOverlayMode(state),
    sliderObj: makeSliderObj(state),
    percentLinear: makePercentLinear(state)
  };
};

function SliderTemplate(props) {
  const {
    name,
    handleChangeSlider,
    valueSlider,
    handleCommittedSlider,
    classes,
    max,
    commitOnChange
  } = props;
  return (
    <Grid container spacing={2} alignItems='center'>
      <Grid item>
        <Typography
          id={`${name}-slider`}
          className={classes.sliderLabel}
          gutterBottom
        >
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </Typography>
      </Grid>
      <Grid item xs>
        <Slider
          name={name}
          value={valueSlider[name]}
          onChange={(e, value) => {
            handleChangeSlider(name, value);
            if (commitOnChange) handleCommittedSlider();
          }}
          onChangeCommitted={(e, value) => {
            handleChangeSlider(name, value);
            handleCommittedSlider();
          }}
          valueLabelDisplay='auto'
          max={max}
        />
      </Grid>
    </Grid>
  );
}

function RadioTemplate(props) {
  const { name } = props;
  return (
    <FormControlLabel
      value={name}
      control={<Radio color='primary' />}
      label={name}
    />
  );
}

class Lounge extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  componentDidMount() {
    const { sendCanvas, updateLinear } = this.props;
    sendCanvas(this.canvas);
    ipcRenderer.on('message-from-worker', (e, arg) => {
      const { command, payload } = arg;
      switch (command) {
        case 'update-progress':
        case 'finish-progress':
        case 'cancel-progress':
          updateLinear(payload);
          break;
        default:
      }
    });
  }

  componentDidUpdate() {
    const { vCap, willUpdateNextFrame } = this.props;
    if (willUpdateNextFrame) vCap.show();
  }

  render() {
    const {
      classes,
      videoFileName,
      startVideo,
      stopVideo,
      previousFrame,
      nextFrame,
      rewindFrame,
      skipFrame,
      openFile,
      vCap,
      handleChangeDialog,
      handleCancelDialog,
      handleConfirmDialog,
      handleKeyDownDialog,
      handleOpenDialog,
      handleCanvasClick,
      dialog,
      status,
      valueSlider,
      handleChangeSlider,
      exporting,
      progress,
      progressFull,
      importing,
      frame,
      ms,
      percent,
      overlayMode,
      handleRadioSelect,
      handleCommittedSlider,
      sliderObj,
      commitOnChange,
      mainEventBtn,
      sendMessage,
      percentLinear
    } = this.props;

    return (
      <div className={classes.root}>
        <Helmet titleTemplate={`%s - ${APP_TITLE}`}>
          <title>BanG Dream Translator Tools!</title>
        </Helmet>

        <Grid container>
          <Grid item>
            <h1>BanG Dream Translator Tools!</h1>
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            {videoFileName && (
              <Typography variant='h4' className={classes.TitleFileName}>
                File name: {videoFileName}
              </Typography>
            )}
          </Grid>
        </Grid>
        <Button className={classes.btn} onClick={openFile}>
          Open file
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
                label={`Frame: ${formatNumber(frame)} / ${formatNumber(
                  vCap.length
                )}`}
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
                label={`Time: ${formatNumber(ms)} / ${formatNumber(
                  (vCap.length * 1000) / vCap.FPS
                )} ms`}
                variant='outlined'
                color='primary'
                clickable
                onClick={() => handleOpenDialog('ms')}
              />
            </Tooltip>
            <Chip
              className={classes.chip}
              icon={<PieChartIcon />}
              label={`${formatNumber(percent)} / 100 %`}
              variant='outlined'
            />
            {percentLinear !== null && (
              <Paper className={classes.paperLinear}>
                <CustomLinearProgress
                  delay={percentLinear.delay}
                  variant='determinate'
                  value={percentLinear.percent}
                />
                <Chip
                  className={classes.chip}
                  icon={<DonutLargeIcon />}
                  label={`${formatNumber(percentLinear.percent)} / 100 %`}
                  variant='outlined'
                />
                <Chip
                  className={classes.chip}
                  icon={<SpeedIcon />}
                  color='primary'
                  label={`FPS: ${formatNumber(percentLinear.FPS)}`}
                  variant='outlined'
                />
                <Chip
                  className={classes.chip}
                  icon={<AccessAlarmIcon />}
                  color='secondary'
                  label={`Estimated time left: ${percentLinear.timeLeft}`}
                  variant='outlined'
                />
                <Chip
                  className={classes.chip}
                  icon={<HourglassEmptyIcon />}
                  color='secondary'
                  label={`Time Elapsed: ${percentLinear.timePassed} / ${
                    percentLinear.timeAll
                  }`}
                  variant='outlined'
                />
              </Paper>
            )}
            <Grid container>
              {radioObj.length > 0 && (
                <Grid item>
                  <Paper className={classes.paperRadio}>
                    <FormControl
                      component='fieldset'
                      className={classes.formControl}
                    >
                      <FormLabel component='legend'>Overlay mode</FormLabel>
                      <RadioGroup
                        name='overlayRadio'
                        value={overlayMode}
                        onChange={handleRadioSelect}
                      >
                        {radioObj.map(name => (
                          <RadioTemplate name={name} key={name} />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Paper>
                </Grid>
              )}
              <Grid item>
                <div className={classes.buttonSliderContainer}>
                  {radioObj.length > 0 && (
                    <>
                      <Button className={classes.btn} onClick={exporting}>
                        Export
                      </Button>
                      <Button
                        className={clsx(classes.btn, classes.marginLeft)}
                        onClick={importing}
                      >
                        Import
                      </Button>
                      <Button
                        className={clsx(classes.btn, classes.marginLeft)}
                        onClick={mainEventBtn}
                      >
                        Main Event
                      </Button>
                    </>
                  )}
                  <Button
                    className={clsx(classes.btn, classes.marginLeft)}
                    onClick={() => sendMessage(-1)}
                  >
                    Start Main Jobs
                  </Button>
                  <Button
                    className={clsx(classes.btn, classes.marginLeft)}
                    onClick={() => sendMessage(1000)}
                  >
                    Start Until 1000 frames
                  </Button>
                  <Button
                    className={clsx(classes.btn, classes.marginLeft)}
                    onClick={() => sendMessage()}
                  >
                    Start Until End of Clip
                  </Button>
                  {/* <Button
                    className={clsx(classes.btn, classes.marginLeft)}
                    onClick={() => sendMessage(100)}
                  >
                    Start Until 100 frames
                  </Button>
                  
                  <Button
                    className={clsx(classes.btn, classes.marginLeft)}
                    onClick={() => sendMessage(10000)}
                  >
                    Start Until 10000 frames
                  </Button> */}
                </div>
                {sliderObj && (
                  <Paper className={classes.PaperSlider}>
                    {sliderObj.map(({ name, max }) => (
                      <SliderTemplate
                        name={name}
                        handleChangeSlider={handleChangeSlider}
                        valueSlider={valueSlider}
                        handleCommittedSlider={handleCommittedSlider}
                        classes={classes}
                        max={max}
                        key={name}
                        commitOnChange={commitOnChange}
                      />
                    ))}
                  </Paper>
                )}
              </Grid>
            </Grid>
            {progressFull > 0 && (
              <LinearProgress
                variant='determinate'
                value={(progress / progressFull) * 100}
              />
            )}
            <Grid container>
              <Grid item>
                <canvas
                  className={classes.canvas}
                  ref={this.canvas}
                  width={vCap.dWidth}
                  height={vCap.dHeight}
                  onMouseDown={handleCanvasClick}
                />
              </Grid>
              {status.show && (
                <>
                  <Grid item>
                    <Paper className={classes.Papers}>
                      <Typography variant='h6' className={classes.text1}>
                        Coord: {`${status.clientX},${status.clientY}`}
                      </Typography>
                      <Typography
                        variant='h6'
                        className={classes.text1}
                        style={{ backgroundColor: status.color.hex }}
                      >
                        {`Color: ${status.color.hex}`}
                      </Typography>
                      <Typography
                        variant='h6'
                        className={classes.text1}
                        style={{ backgroundColor: status.color.hex }}
                      >
                        {`RGB: (${status.color.r},${status.color.g},${
                          status.color.b
                        })`}
                      </Typography>
                    </Paper>
                  </Grid>
                </>
              )}
            </Grid>
          </>
        )}

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
                    / {formatNumber(dialog.maxValue)} {dialog.type}
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
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(actions, dispatch);

export default withReducer('Lounge', reducers)(
  connect(
    mapStateToProps,
    mapDispatchToProps
    //   ,null,{
    //     areStatesEqual = (next, prev) =>{
    //       console.log('next',next);
    //       return false;
    // }
    // }
  )(withStyles(styles)(Lounge))
);
