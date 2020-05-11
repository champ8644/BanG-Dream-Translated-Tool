import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

export const CustomLinearProgress = withStyles({
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

export default function ProgressMultiBar(props) {
  const {
    readyToWork,
    percentLinear,
    NUM_PROCESS,
    completeWork,
    cancelWork
  } = props;
  if (!readyToWork) return <></>;
  return (
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
  );
}
