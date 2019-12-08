import { makeStyles, withStyles } from '@material-ui/core/styles';

import Grow from '@material-ui/core/Grow';
import LinearProgress from '@material-ui/core/LinearProgress';
import React from 'react';

function stroke(stroke, color) {
  let shadow = `0px 0px 0 ${color} `;
  for (let i = -stroke; i <= stroke; i += 1) {
    for (let j = -stroke; j <= stroke; j += 1) {
      shadow += `, ${i}px ${j}px 0 ${color}`;
    }
  }
  return shadow;
}

const stroke5 = stroke(5, '#000');

const useStyles = makeStyles({
  root: {
    left: '50%',
    top: '50%',
    position: 'absolute',
    transform: 'translate(-50%,-50%)',
    fontSize: '10em',
    textShadow: stroke5
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
  bar: props => ({
    borderRadius: 20,
    backgroundColor: '#FF6C5C',
    transition: `transform ${props.delay}ms linear`
  })
})(LinearProgress);
