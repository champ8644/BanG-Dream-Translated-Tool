import {
  makeCancelWork,
  makeCompleteWork,
  makeNumProcess,
  makePercentLinear,
  makeReadyToWork
} from '../selectors';

import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import Chip from '@material-ui/core/Chip';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import Grid from '@material-ui/core/Grid';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import SpeedIcon from '@material-ui/icons/Speed';
import { connect } from 'react-redux';
import { formatNumber } from '../constants/function';
import { styles } from '../styles';
import { withStyles } from '@material-ui/core/styles';

const makeMapStateToProps = () => {
  return (state, props) => ({
    percentLinear: makePercentLinear()(state, props),
    readyToWork: makeReadyToWork()(state, props),
    cancelWork: makeCancelWork()(state, props),
    completeWork: makeCompleteWork()(state, props),
    NUM_PROCESS: makeNumProcess(state)
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
    path
  } = props;
  if (!readyToWork) return <div>{path}</div>;
  return (
    <Paper className={classes.paperLinear}>
      <Grid container>
        {Array.from(Array(NUM_PROCESS).keys()).map(
          index =>
            percentLinear.bar[index] !== null && (
              <Grid item xs key={index}>
                <CustomLinearProgress
                  delay={percentLinear.bar[index].delay}
                  variant='determinate'
                  value={percentLinear.bar[index].percent}
                  isfirst={index === 0 ? 1 : 0}
                  islast={index === NUM_PROCESS - 1 ? 1 : 0}
                  iscomplete={completeWork ? 1 : 0}
                  iserror={cancelWork ? 1 : 0}
                />
              </Grid>
            )
        )}
      </Grid>
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
  );
}

export default connect(makeMapStateToProps)(withStyles(styles)(ListVCap));
