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

export default function CenteredText(props) {
  const styles = useStyles();
  const { children } = props;
  return <div className={styles.root}>{children}</div>;
}
