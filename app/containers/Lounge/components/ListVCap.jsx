import {
  makeCancelWork,
  makeCompleteWork,
  makeNumProcess,
  makePercentLinear,
  makeReadyToWork,
  makeVideoCaptureEach
} from '../selectors';

import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import Grid from '@material-ui/core/Grid';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import React from 'react';
import SpeedIcon from '@material-ui/icons/Speed';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { formatNumber } from '../constants/function';
import path from 'path';
import { styles } from './ListVCapStyle';
import { withStyles } from '@material-ui/core/styles';

const makeMapStateToProps = () => {
  return (state, props) => ({
    percentLinear: makePercentLinear()(state, props),
    readyToWork: makeReadyToWork()(state, props),
    cancelWork: makeCancelWork()(state, props),
    completeWork: makeCompleteWork()(state, props),
    NUM_PROCESS: makeNumProcess(state),
    vCap: makeVideoCaptureEach()(state, props)
  });
};

const CustomLinearProgress = withStyles({
  root: props => {
    let backgroundColor = '#FFB1A8';
    if (props.iscomplete) backgroundColor = '#8FFFC3';
    if (props.iserror) backgroundColor = '#FF8F87';
    return {
      height: 10,
      backgroundColor
    };
  },
  bar: props => {
    const borderRad = { L: '0px', R: '20px' };
    if (props.isfirst) borderRad.L = '20px';
    if (!props.islast && props.value === 100) borderRad.R = '0px';
    let backgroundColor = '#FF6C5C';
    if (props.iscomplete) backgroundColor = '#1DB364';
    if (props.iserror) backgroundColor = '#FF2819';
    return {
      backgroundColor,
      transition: `transform ${props.delay}ms linear`,
      borderRadius: `${borderRad.L} ${borderRad.R} ${borderRad.R} ${
        borderRad.L
      }`
    };
  }
})(LinearProgress);

function ListVCap(props) {
  const {
    classes,
    percentLinear,
    NUM_PROCESS,
    completeWork,
    cancelWork,
    readyToWork,
    path: videoFilePath,
    vCap
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
        .asyncRead(Math.round(vCap.length / 4))
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    }, 0);
  }, []);
  return (
    <Card className={classes.root}>
      {isLoading && (
        <CircularProgress className={classes.loader} disableShrink />
      )}
      <div className={classes.flex}>
        <canvas
          className={classes.cover}
          ref={canvasRef}
          width={vCap.dWidth}
          height={vCap.dHeight}
          // onMouseDown={handleCanvasClick}
        />
      </div>
      <div className={classes.details}>
        <div className={classes.row}>
          <div className={classes.column}>
            <CardContent className={classes.header}>
              <Typography component='h5' variant='h5' noWrap>
                {path.basename(videoFilePath)}
              </Typography>
              <Typography variant='subtitle1' color='textSecondary' noWrap>
                {path.dirname(videoFilePath)}
              </Typography>
            </CardContent>
            <div className={classes.grow} />
            {/* <div className={classes.controls}>
              <IconButton aria-label='previous'>
                <SkipPreviousIcon />
              </IconButton>
              <IconButton aria-label='play/pause'>
                <PlayArrowIcon className={classes.playIcon} />
              </IconButton>
              <IconButton aria-label='next'>
                <SkipNextIcon />
              </IconButton>
            </div> */}
            <div className={classes.chipBar}>
              {readyToWork && (
                <>
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
                </>
              )}
            </div>
          </div>
          <Tooltip title='Close this video' arrow>
            <IconButton color='secondary' className={classes.closeIcon}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </div>
        {readyToWork && (
          <Grid container>
            {percentLinear.bar.map((bar, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <Grid item xs key={idx}>
                <CustomLinearProgress
                  delay={bar.delay}
                  variant='determinate'
                  value={bar.percent}
                  isfirst={idx === 0 ? 1 : 0}
                  islast={idx === NUM_PROCESS - 1 ? 1 : 0}
                  iscomplete={completeWork ? 1 : 0}
                  iserror={cancelWork ? 1 : 0}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    </Card>
  );
}

export default connect(makeMapStateToProps)(withStyles(styles)(ListVCap));
