import Grow from '@material-ui/core/Grow';
import LinearProgress from '@material-ui/core/LinearProgress';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

export function GrowingText(props) {
  const { show, fade, text } = props;
  return (
    <Grow in={show} timeout={{ enter: fade, exit: fade }}>
      <div>{text}</div>
    </Grow>
  );
}

export const BorderLinearProgress = withStyles({
  root: {
    height: 10,
    backgroundColor: '#FFB1A8'
  },
  bar: {
    borderRadius: 20,
    backgroundColor: '#FF6C5C'
  }
})(LinearProgress);
