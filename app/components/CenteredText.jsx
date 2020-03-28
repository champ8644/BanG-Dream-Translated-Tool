import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: props => ({
    left: '50%',
    top: '50%',
    position: 'absolute',
    transform: 'translate(-50%,-50%)',
    fontSize: '10em',
    color: props.color
  })
});

export default function CenteredText(props) {
  const styles = useStyles(props);
  const { text, show } = props;
  if (!show) return <></>;
  return <div className={styles.root}>{text}</div>;
}
