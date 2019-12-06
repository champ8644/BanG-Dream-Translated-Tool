import Grow from '@material-ui/core/Grow';
import React from 'react';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  root: {
    left: '50%',
    top: '50%',
    position: 'absolute',
    transform: 'translate(-50%,-50%)',
    fontSize: '10em'
  }
});

export default function GrowingText(props) {
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
