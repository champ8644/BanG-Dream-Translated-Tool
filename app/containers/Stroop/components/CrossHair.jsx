import React from 'react';
import { isDark } from '../../../utils/colorHelper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: props => {
    let color = 'white';
    if (props.backgroundColor !== undefined)
      if (!isDark(props.backgroundColor)) color = 'black';
    return {
      left: '50%',
      top: '50%',
      position: 'absolute',
      transform: 'translate(-50%,-50%)',
      fontSize: '12em',
      color
    };
  }
});

export default function CrossHair(props) {
  const styles = useStyles(props);
  const { show } = props;
  if (!show) return <></>;
  return <div className={styles.root}>+</div>;
}
