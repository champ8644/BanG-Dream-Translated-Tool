import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import React from 'react';
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
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
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
  body: {
    fontSize: '20px'
  }
});

export default function SimpleCard(props) {
  const classes = useStyles();
  const { onClick, title, subTitle } = props;
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant='h5' component='h2' gutterBottom>
          {title}
        </Typography>
        <Divider />
        <Typography className={classes.pos} color='textSecondary'>
          {subTitle}
        </Typography>
        <Typography
          variant='h5'
          component='h6'
          className={classes.body}
          gutterBottom
        >
          Reaction Time
        </Typography>
        <Typography variant='body1' component='body1' gutterBottom>
          {bull} Max
          <br />
          {bull} Mean
          <br />
        </Typography>
        <Typography
          variant='h5'
          component='h6'
          className={classes.body}
          gutterBottom
        >
          Accuracy
        </Typography>
        <Typography variant='body1' component='body1' gutterBottom>
          {bull} Final
        </Typography>
      </CardContent>
      <Divider />
      <CardActions>
        <Button className={classes.btn} onClick={onClick}>
          Pre Test
        </Button>
      </CardActions>
      <Divider />
      <CardActions>
        <Button className={classes.btn2} onClick={onClick}>
          Post Test
        </Button>
      </CardActions>
    </Card>
  );
}
