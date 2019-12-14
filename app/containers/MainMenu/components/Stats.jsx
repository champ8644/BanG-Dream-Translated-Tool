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
  const bull = <span className={styles.bullet}>•</span>;

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
      <Typography variant='p' gutterBottom color='textSecondary'>
        {bull} Mean 248 ms(SD = 50 ms)
      </Typography>
      <Typography
        variant='h5'
        component='h6'
        className={styles.body}
        gutterBottom
      >
        Accuracy
      </Typography>
      <Typography variant='p' gutterBottom color='textSecondary'>
        {bull} 100%
      </Typography>
    </>
  );
}
