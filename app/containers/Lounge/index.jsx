'use strict';

import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import PieChartIcon from '@material-ui/icons/PieChart';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import StopIcon from '@material-ui/icons/Stop';
import TheatersIcon from '@material-ui/icons/Theaters';
import TimerIcon from '@material-ui/icons/Timer';
import clsx from 'clsx';
import electron from 'electron';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { IS_DEV } from '../../constants/env';
import { APP_TITLE } from '../../constants/meta';
import { withReducer } from '../../store/reducers/withReducer';
import * as actions from './actions';
import ListVCap from './components/ListVCap';
import ProgressChipbar from './components/ProgressChipBar';
import ProgressMultiBar, {
  CustomLinearProgress
} from './components/ProgressMultiBar';
import { NUM_MAX_PROCESS } from './constants';
import {
  autoOpenFileName,
  defaultVCapBeginFrame,
  isAutoOpen,
  radioObj,
  ws
} from './constants/config';
import { formatNumber } from './constants/function';
import reducers from './reducers';
import {
  makeCloseConvertingDialog,
  makeCurrentFrame,
  makeDialogData,
  makeDisplayNumProcess,
  makeMainProgressMultiBarProps,
  makeNumProcess,
  makeOverlayMode,
  makeProgress,
  makeProgressBar,
  makeQueue,
  makeSlider,
  makeSliderObj,
  makeStatusData,
  makeVideoCapture,
  makeVideoFilePath,
  makeWillUpdateNextFrame,
  makeWorkingStatus,
  makeAutoStart,
  makeWatchPath
} from './selectors';
import { styles } from './styles';

const { ipcRenderer } = electron;

/* eslint-disable react/no-array-index-key */
const ProcessMenuItem = Array.from(Array(NUM_MAX_PROCESS)).map((_, x) => (
  <MenuItem value={x + 1} key={x + 1}>
    {x + 1}
  </MenuItem>
));
/* eslint-enable react/no-array-index-key */

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
    NUM_PROCESS: makeNumProcess(state),
    displayNumProcess: makeDisplayNumProcess(state),
    queue: makeQueue(state),
    workingStatus: makeWorkingStatus(state),
    closeConvertingDialog: makeCloseConvertingDialog(state),
    mainProgressProps: makeMainProgressMultiBarProps()(state),
    autoStart: makeAutoStart(state),
    watchPath: makeWatchPath(state)
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
    this.dialogFrame = React.createRef();
  }

  componentDidMount() {
    const {
      sendCanvas,
      updateLinear,
      beginLinear,
      finishLinear,
      cancelLinear,
      openFile,
      updateThumbnail,
      answerType
    } = this.props;
    sendCanvas(this.canvas);
    ipcRenderer.on('message-from-worker', (e, arg) => {
      const { command, payload } = arg;
      switch (command) {
        case 'begin-progress':
          beginLinear(payload);
          break;
        case 'update-progress':
          updateLinear(payload);
          break;
        case 'update-thumbnail':
          updateThumbnail(payload);
          break;
        case 'finish-progress':
          finishLinear(payload);
          break;
        case 'cancel-progress':
          cancelLinear(payload);
          break;
        case 'answer-type':
          answerType(payload);
          break;
        default:
      }
    });
    if (isAutoOpen) openFile(autoOpenFileName);
  }

  componentDidUpdate() {
    const { vCap, willUpdateNextFrame } = this.props;
    if (willUpdateNextFrame) {
      vCap.show(defaultVCapBeginFrame);
    }
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
      progress,
      progressFull,
      frame,
      ms,
      percent,
      overlayMode,
      handleRadioSelect,
      handleCommittedSlider,
      sliderObj,
      commitOnChange,
      devQueue,
      handleNumProcess,
      displayNumProcess,
      addQueue,
      queue,
      startQueue,
      stopQueue,
      onCloseVCapList,
      onCancelVCapList,
      onRefreshVCapList,
      workingStatus,
      handleCancelCloseConvertingDialog,
      handleConfirmCloseConvertingDialog,
      closeConvertingDialog,
      onSwitchFPSVCapList,
      exportingLounge,
      importingLounge,
      devLounge,
      handleSwitchVCapList,
      mainProgressProps: {
        readyToWork,
        percentLinear,
        NUM_PROCESS,
        completeWork,
        cancelWork,
        showFPS
      },
      captureVCap,
      addWatcher,
      clearWatcher,
      autoStart,
      handleAutoStart,
      watchPath
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
        <Grid container>
          <Grid item>
            {watchPath ? (
              <Tooltip title='Clear watched folder' arrow>
                <Button className={classes.btn2} onClick={clearWatcher}>
                  Clear Watcher
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title='Tracking a folder for new file' arrow>
                <Button className={classes.btn} onClick={addWatcher}>
                  Watch Folder
                </Button>
              </Tooltip>
            )}
          </Grid>
          <Grid item>
            <Switch
              classes={{
                root: classes.switchRoot,
                switchBase: classes.switchBase,
                track: classes.track
              }}
              checked={!!autoStart}
              onChange={handleAutoStart}
            />
          </Grid>
          <Grid item classes={{ root: classes.flex }}>
            <span
              className={autoStart ? classes.spanBoxTrue : classes.spanBoxFalse}
            >
              {autoStart ? 'AutoStart: On' : 'AutoStart: Off'}
            </span>
          </Grid>
          <Grid item classes={{ root: classes.flex }}>
            {watchPath && (
              <Paper classes={{ root: classes.paperWatch }}>
                <Typography variant='h6'>Watching on: {watchPath}</Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
        <div className={classes.buttonSliderContainer}>
          <Tooltip title='Add new video(s)' arrow>
            <Button className={classes.btn} onClick={addQueue}>
              Add queue
            </Button>
          </Tooltip>

          <FormControl className={classes.formControlInput}>
            <InputLabel id='input-label-num-process'>Process</InputLabel>
            <Select
              id='select-num-process'
              value={displayNumProcess}
              onChange={handleNumProcess}
            >
              {ProcessMenuItem}
            </Select>
          </FormControl>
          {IS_DEV && (
            <Button
              className={clsx(classes.btn, classes.marginLeft)}
              onClick={() => openFile()}
            >
              Open file
            </Button>
          )}
          {queue.length > 0 && (
            <>
              <Button
                className={clsx(classes.btn, classes.marginLeft)}
                onClick={startQueue}
                disabled={workingStatus !== ws.idle}
              >
                Start queue
              </Button>
              <Button
                className={clsx(classes.btn, classes.marginLeft)}
                onClick={stopQueue}
                disabled={workingStatus !== ws.converting}
              >
                Stop queue
              </Button>
            </>
          )}
        </div>
        {vCap && (
          <div className={classes.buttonSliderContainer}>
            {radioObj.length > 0 && (
              <>
                <Button className={classes.btn} onClick={exportingLounge}>
                  Export
                </Button>
                <Button
                  className={clsx(classes.btn, classes.marginLeft)}
                  onClick={importingLounge}
                >
                  Import
                </Button>
              </>
            )}
            {IS_DEV && (
              <>
                <Button
                  className={clsx(classes.btn, classes.marginLeft)}
                  onClick={() => devQueue({ test: true })}
                >
                  Start Testing
                </Button>
                <Button
                  className={clsx(classes.btn, classes.marginLeft)}
                  onClick={() => devLounge()}
                >
                  Start Lounge
                </Button>
                <Button
                  className={clsx(classes.btn, classes.marginLeft)}
                  onClick={() => devLounge({ test: true })}
                >
                  Lounge Test
                </Button>
                <Button
                  className={clsx(classes.btn, classes.marginLeft)}
                  onClick={() => devQueue({ end: 1000 })}
                >
                  Start Until 1000 frames
                </Button>
                <Button
                  className={clsx(classes.btn, classes.marginLeft)}
                  onClick={() => devQueue({ end: 10000 })}
                >
                  Start Until 10000 frames
                </Button>
                <Button
                  className={clsx(classes.btn, classes.marginLeft)}
                  onClick={captureVCap}
                >
                  Capture
                </Button>
              </>
            )}
            <Button
              className={clsx(classes.btn, classes.marginLeft)}
              onClick={() => devQueue()}
            >
              Start Converting
            </Button>
          </div>
        )}
        {readyToWork && (
          <Paper className={classes.paperLinear}>
            <ProgressMultiBar
              readyToWork={readyToWork}
              completeWork={completeWork}
              cancelWork={cancelWork}
              percentLinear={percentLinear}
              NUM_PROCESS={NUM_PROCESS}
            />
            <div className={classes.chipBar}>
              <ProgressChipbar
                readyToWork={readyToWork}
                percentLinear={percentLinear}
                showFPS={showFPS}
                FPS={vCap.FPS}
                onSwitchFPS={onSwitchFPSVCapList.bind(this, vCap.path)}
              />
            </div>
          </Paper>
        )}
        {queue.length > 0 && (
          <div className={classes.marginTop}>
            {queue.map(path => (
              <ListVCap
                path={path}
                key={path}
                onClose={onCloseVCapList.bind(this, path)}
                onCancel={onCancelVCapList.bind(this, path)}
                onRefresh={onRefreshVCapList.bind(this, path)}
                onSwitchFPS={onSwitchFPSVCapList.bind(this, path)}
                handleSwitch={handleSwitchVCapList.bind(this, path)}
              />
            ))}
          </div>
        )}
        {vCap && (
          <>
            {/* {readyToWork && (
              <ListVCap
                vCap={{
                  percentLinear,
                  NUM_PROCESS,
                  completeWork,
                  cancelWork
                }}
                classes={classes}
              />
            )} */}
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
                      onClick={() =>
                        handleOpenDialog('frame', formatNumber(frame))
                      }
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
                      onClick={() => handleOpenDialog('ms', formatNumber(ms))}
                    />
                  </Tooltip>
                  <Chip
                    className={classes.chip}
                    icon={<PieChartIcon />}
                    label={`${formatNumber(percent)} / 100 %`}
                    variant='outlined'
                  />
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
            {/* {progressFull > 0 && (
              <LinearProgress
                variant='determinate'
                value={(progress / progressFull) * 100}
              />
            )} */}
            {progressFull > 0 && (
              <CustomLinearProgress
                variant='determinate'
                value={(progress / progressFull) * 100}
                isfirst={1}
                islast={1}
                iscomplete={progress / progressFull >= 1 ? 1 : undefined}
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

        <Dialog
          open={dialog.open}
          onClose={handleCancelDialog}
          onEntering={() => this.dialogFrame.current.select()}
        >
          <DialogContent>
            <TextField
              autoFocus
              margin='dense'
              label='Go to frame'
              value={dialog.value}
              onChange={handleChangeDialog}
              onKeyDown={handleKeyDownDialog}
              inputRef={this.dialogFrame}
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

        <Dialog
          open={closeConvertingDialog.open}
          onClose={handleCancelCloseConvertingDialog}
        >
          <DialogTitle>Confirm closing on going process.</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to close this process from &apos;
              {closeConvertingDialog.path}&apos;? Any unsaved data will be
              forever lost.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleConfirmCloseConvertingDialog}
              color='secondary'
            >
              Ok, I don&apos;t need this data
            </Button>
            <Button onClick={handleCancelCloseConvertingDialog} color='primary'>
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
