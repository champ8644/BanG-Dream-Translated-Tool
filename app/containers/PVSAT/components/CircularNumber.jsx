import Fab from '@material-ui/core/Fab';
import Grow from '@material-ui/core/Grow';
import React from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';

import { time } from '../constants/constant';

const useStyles = makeStyles({
  root: {
    display: 'block',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)'
  },
  eachNode: props => {
    const { index, total, radius } = props;
    const rad = (2 * index * Math.PI) / total;
    const [transX, transY] = [radius * Math.sin(rad), radius * Math.cos(rad)];
    return {
      display: 'block',
      position: 'absolute',
      left: `calc(50% + ${transX}px)`,
      top: `calc(50% - ${transY}px)`,
      transform: 'translate(-50%,-50%)',
      fontSize: '5em'
    };
  },
  fab: props => {
    const { index, disabled } = props;
    let background = 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)';
    if (index % 2 === 0)
      background = 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)';
    if (disabled)
      background = 'linear-gradient(45deg, #DCDCDC 30%, #C0C0C0 90%)';
    return {
      fontSize: '2.8rem',
      background,
      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
      color: 'white',
      height: '2.1em',
      width: '2.1em'
    };
  }
});

function EachCircularNumber(props) {
  const styles = useStyles(props);
  const { index, total, text, onClick, disabled } = props;
  return (
    <div className={styles.eachNode} index={index} total={total}>
      <Fab
        className={styles.fab}
        index={index}
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </Fab>
    </div>
  );
}

export default function CircularNumber(props) {
  const styles = useStyles(props);
  const { total, answering, show, disabled } = props;
  return (
    <Grow in={show} timeout={{ enter: time.fade, exit: time.fade }}>
      <div className={styles.root}>
        {_.range(1, total + 1).map(x => (
          <EachCircularNumber
            key={x}
            index={x}
            total={total}
            text={x}
            radius={250}
            disabled={disabled}
            onClick={() => answering(Number(x))}
          />
        ))}
      </div>
    </Grow>
  );
}
