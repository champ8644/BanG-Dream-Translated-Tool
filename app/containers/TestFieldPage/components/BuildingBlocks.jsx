import { makeStyles, withStyles } from '@material-ui/styles';

import Grow from '@material-ui/core/Grow';
import LinearProgress from '@material-ui/core/LinearProgress';
import React from 'react';

const useStyles = makeStyles({
  root: {
    left: '50%',
    top: '50%',
    position: 'absolute',
    transform: 'translate(-50%,-50%)',
    fontSize: '10em'
  }
});

export function GrowingText(props) {
  const styles = useStyles();
  const { show, fade, text } = props;
  return (
    <div className={styles.root}>
      <Grow in={show} timeout={{ enter: fade, exit: fade }}>
        <div>{text}</div>
      </Grow>
    </div>
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
