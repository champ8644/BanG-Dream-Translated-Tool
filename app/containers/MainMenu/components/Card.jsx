import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import React from 'react';
import Stats from './Stats';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  card: {
    minWidth: 250,
    margin: '1em',
    background: 'floralwhite'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  justCenter: {
    justifyContent: 'center'
  },
  title: {
    fontSize: 14
  },
  subtitle: {
    margin: '0 0 1em 0'
  },
  btn: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: '2.5em',
    flexGrow: 1,
    fontSize: '1.3em',
    textDecoration: 'none !important'
  },
  btn2: {
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
    border: 0,
    borderRadius: 3,
    color: 'white',
    height: '2.5em',
    flexGrow: 1,
    fontSize: '1.3em',
    textDecoration: 'none !important'
  },
  btn3: {
    background: 'linear-gradient(45deg, #3cac02 30%, #abd130 90%)',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
    border: 0,
    borderRadius: 3,
    color: 'white',
    height: '2.5em',
    flexGrow: 0.4,
    fontSize: '1.3em',
    textDecoration: 'none !important'
  },
  body: {
    fontSize: '20px'
  },
  cardContent: {
    paddingBottom: '0'
  }
});

export default function SimpleCard(props) {
  const styles = useStyles();
  const { onClick, title, subTitle } = props;

  return (
    <Card className={styles.card}>
      <CardContent className={styles.cardContent}>
        <Typography variant='h5' component='h2' gutterBottom>
          <u>{title}</u>
        </Typography>
        <Typography
          variant='p'
          className={styles.subtitle}
          color='textSecondary'
        >
          {subTitle}
        </Typography>
      </CardContent>
      <CardActions className={styles.justCenter}>
        <Tooltip title='Start test with no time limit.'>
          <Button className={styles.btn3} onClick={onClick}>
            Demo
          </Button>
        </Tooltip>
      </CardActions>
      <Divider />
      <CardContent className={styles.cardContent}>
        <Stats />
      </CardContent>
      <CardActions>
        <Tooltip title='Record test before medication'>
          <Button className={styles.btn} onClick={onClick}>
            Pre Test
          </Button>
        </Tooltip>
      </CardActions>
      <Divider />
      <CardContent className={styles.cardContent}>
        <Stats />
      </CardContent>
      <CardActions>
        <Tooltip title='Record test after medication.'>
          <Button className={styles.btn2} onClick={onClick}>
            Post Test
          </Button>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
