import {
  makeProgressMultiBarProps,
  makeVideoCaptureEach,
  makeWorkingStatus
} from '../selectors';

import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import Grow from '@material-ui/core/Grow';
import IconButton from '@material-ui/core/IconButton';
import ProgressChipBar from './ProgressChipBar';
import ProgressMultiBar from './ProgressMultiBar';
import React from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';
import StopIcon from '@material-ui/icons/Stop';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import path from 'path';
import { styles } from './ListVCapStyle';
import { withStyles } from '@material-ui/core/styles';
import { ws } from '../constants/config';

const makeMapStateToProps = () => {
  return (state, props) => ({
    ...makeProgressMultiBarProps()(state, props),
    vCap: makeVideoCaptureEach()(state, props),
    workingStatus: makeWorkingStatus(state)
  });
};

function ListVCap(props) {
  const {
    classes,
    percentLinear,
    NUM_PROCESS,
    completeWork,
    cancelWork,
    readyToWork,
    path: videoFilePath,
    vCap,
    onClose,
    onCancel,
    onRefresh,
    workingStatus,
    showFPS,
    onSwitchFPS
  } = props;
  const canvasRef = React.useRef();
  const [isLoading, setLoading] = React.useState(true);
  React.useEffect(() => {
    vCap.setCanvas(canvasRef);
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = 'lightgray';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setTimeout(() => {
      vCap
        .asyncNonWhiteRead(Math.round(vCap.length / 4))
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    }, 0);
  }, []);
  return (
    <Card className={classes.root}>
      {isLoading && (
        <div className={classes.circularWrapper}>
          <CircularProgress
            className={classes.isLoading}
            disableShrink
            color='secondary'
          />
        </div>
      )}
      {readyToWork && !cancelWork && !completeWork && (
        <div className={classes.circularWrapper}>
          <CircularProgress className={classes.isConverting} size={30} />
        </div>
      )}
      <div className={classes.flex}>
        <ButtonBase
          focusRipple
          className={classes.buttonCanvas}
          focusVisibleClassName={classes.focusVisible}
          disabled={!cancelWork}
          onClick={onRefresh}
        >
          <span className={classes.imageBackdrop} />
          <span className={classes.imageButtonFAB}>
            <div>
              <div className={classes.FAB}>
                <span className={classes.childFAB}>
                  <RefreshIcon />
                </span>
              </div>
              <Typography
                component='h4'
                variant='h4'
                className={classes.refreshFAB}
              >
                Refresh
              </Typography>
            </div>
          </span>
          <canvas
            className={classes.cover}
            ref={canvasRef}
            width={vCap.dWidth}
            height={vCap.dHeight}
            // onMouseDown={handleCanvasClick}
          />
        </ButtonBase>
      </div>
      <div className={classes.details}>
        <div className={classes.row}>
          <div className={classes.column}>
            <CardContent className={classes.header}>
              <Tooltip
                title={videoFilePath}
                arrow
                placement='top-start'
                classes={{ tooltip: classes.noMaxWidth }}
              >
                <Typography
                  component='h5'
                  variant='h5'
                  noWrap
                  className={classes.basename}
                >
                  {path.basename(videoFilePath)}
                  {cancelWork && ' (Cancelled)'}
                </Typography>
              </Tooltip>
              <Typography
                variant='subtitle1'
                color='textSecondary'
                noWrap
                gutterBottom={false}
              >
                {path.dirname(videoFilePath)}
              </Typography>
            </CardContent>
            <div className={classes.grow}>
              <Grow in={(cancelWork || readyToWork) && !completeWork}>
                <div>
                  {cancelWork ? (
                    <Button
                      variant='contained'
                      size='small'
                      color='primary'
                      className={classes.refreshButton}
                      startIcon={<RefreshIcon />}
                      onClick={onRefresh}
                    >
                      Refresh
                    </Button>
                  ) : (
                    readyToWork && (
                      <Button
                        variant='contained'
                        size='small'
                        color='secondary'
                        className={classes.refreshButton}
                        startIcon={<StopIcon />}
                        onClick={onCancel}
                        disabled={workingStatus !== ws.converting}
                      >
                        Stop working
                      </Button>
                    )
                  )}
                </div>
              </Grow>
            </div>
            <div className={classes.chipBar}>
              <ProgressChipBar
                readyToWork={readyToWork}
                percentLinear={percentLinear}
                showFPS={showFPS}
                onSwitchFPS={onSwitchFPS}
                FPS={vCap.FPS}
              />
            </div>
          </div>
          <Tooltip title='Close this video' arrow>
            <IconButton
              color='secondary'
              className={classes.closeIcon}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </div>
        <ProgressMultiBar
          readyToWork={readyToWork}
          completeWork={completeWork}
          cancelWork={cancelWork}
          percentLinear={percentLinear}
          NUM_PROCESS={NUM_PROCESS}
        />
      </div>
    </Card>
  );
}

export default connect(makeMapStateToProps)(withStyles(styles)(ListVCap));
