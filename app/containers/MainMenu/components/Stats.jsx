import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  pos: {
    marginBottom: 12
  },
  body: {
    fontSize: '20px'
  }
});

export default function SimpleCard(props) {
  const styles = useStyles();
  const {
    data: { analyse }
  } = props;
  const bull = <span className={styles.bullet}>•</span>;
  let paragraph;
  try {
    paragraph = [
      <span>
        {bull} Mean {analyse.avg.toFixed(2)} ms (SD = {analyse.SD.toFixed(2)})
      </span>,
      <span>
        {bull} {analyse.accuracy.toFixed(2)}% ({analyse.correct}/
        {analyse.length})
      </span>
    ];
  } catch {
    paragraph = ['No Data...', 'No Data...'];
  }
  return (
    <>
      <Typography
        variant='h5'
        component='h6'
        className={styles.body}
        gutterBottom
      >
        Reaction Time
      </Typography>
      <Typography variant='body2' gutterBottom color='textSecondary'>
        {paragraph[0]}
      </Typography>
      <Typography
        variant='h5'
        component='h6'
        className={styles.body}
        gutterBottom
      >
        Accuracy
      </Typography>
      <Typography variant='body2' gutterBottom color='textSecondary'>
        {paragraph[1]}
      </Typography>
    </>
  );
}
