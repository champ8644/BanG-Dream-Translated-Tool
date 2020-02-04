'use strict';

import * as actions from './actions';

import React, { Component } from 'react';
import {
  makeCurrentFrame,
  makeDialogData,
  makeOverlayMode,
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
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
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
import StopIcon from '@material-ui/icons/Stop';
import TextField from '@material-ui/core/TextField';
import TheatersIcon from '@material-ui/icons/Theaters';
import TimerIcon from '@material-ui/icons/Timer';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { bindActionCreators } from 'redux';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { formatNumber } from './constants/function';
import reducers from './reducers';
import { styles } from './styles';
import { withReducer } from '../../store/reducers/withReducer';
import { withStyles } from '@material-ui/core/styles';

const radioObj = ['none', 'nameLabelGenerator', 'subtitleFinder', 'GRAYFinder'];

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
    sliderObj: makeSliderObj(state)
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
    const { sendCanvas } = this.props;
    sendCanvas(this.canvas);
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
      commitOnChange
    } = this.props;

    return (
      <div className={classes.root}>
        <Helmet titleTemplate={`%s - ${APP_TITLE}`}>
          <title>OpenCV Tests!</title>
        </Helmet>

        <Grid container>
          <Grid item>
            <h1>OpenCV Tests!</h1>
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
            <Grid container>
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
              <Grid item>
                <div className={classes.buttonSliderContainer}>
                  <Button className={classes.btn} onClick={exporting}>
                    Export
                  </Button>
                  <Button
                    className={clsx(classes.btn, classes.marginLeft)}
                    onClick={importing}
                  >
                    Import
                  </Button>
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
