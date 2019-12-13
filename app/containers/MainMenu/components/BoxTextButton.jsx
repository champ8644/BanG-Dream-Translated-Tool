'use strict';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { routes } from '../../../routing/mainMenu';
import { styles } from '../styles';
import { withStyles } from '@material-ui/core/styles';

function BoxTextButton(props) {
  return (
    <Paper>
      <Typography gutterBottom variant='h6'>
        Stroop 1
      </Typography>
      <Divider />
      <Button
        className={styles.btn}
        onClick={() => history.push(`${routes.Stroop.locate}/1`)}
      >
        Stroop 1
      </Button>
      <Typography variant='body1'>Reaction Time</Typography>
      <Typography variant='body1' className={styles.indent}>
        Mean
      </Typography>
      <Typography variant='body1' className={styles.indent}>
        Max
      </Typography>
      <Typography gutterBottom variant='body1' className={styles.indent}>
        Min
      </Typography>
      <Typography gutterBottom variant='body1'>
        Accuracy
      </Typography>
    </Paper>
  );
}

export default withStyles(styles)(BoxTextButton);
