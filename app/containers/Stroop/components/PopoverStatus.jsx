import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  popover: {},
  typography: {
    padding: theme.spacing(2),
    fontSize: '5rem'
  }
}));

export default function PPopover(props) {
  const { type, show } = props;
  const styles = useStyles();
  let text;
  switch (type) {
    case 'time out':
      text = 'หมดเวลา';
      break;
    case 'wrong':
      text = 'ผิด';
      break;
    case 'correct':
      text = 'ถูกต้อง';
      break;
    default:
      text = '';
      break;
  }
  return (
    <Popover
      open={show}
      className={styles.popover}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'center'
      }}
    >
      <Typography className={styles.typography}>{text}</Typography>
    </Popover>
  );
}

// eslint-disable-next-line no-unused-vars
function SimplePopover() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button
        aria-describedby={id}
        variant='contained'
        color='primary'
        onClick={handleClick}
      >
        Open Popover
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <Typography className={classes.typography}>
          The content of the Popover.
        </Typography>
      </Popover>
    </div>
  );
}
