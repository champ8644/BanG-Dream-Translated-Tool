'use strict';

import React, { Component } from 'react';

import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { styles } from '../styles';
import { withStyles } from '@material-ui/core/styles';

class Demographic extends Component {
  render() {
    const { classes: styles, data } = this.props;
    return (
      <div className={styles.rootDemog}>
        <Grow in={data !== null}>
          <Paper className={clsx(styles.paper, styles.doubleMargin)}>
            <Grid
              item
              container
              direction='row'
              justify='center'
              alignItems='center'
              spacing={3}
            >
              <Grid item>
                <Typography>
                  นาย ก อังคารไม่ชา
                  <br />
                  ชาย, 60 ปี
                </Typography>
              </Grid>
              <Divider orientation='vertical' />
              <Grid item>Hello</Grid>
            </Grid>
          </Paper>
        </Grow>
      </div>
    );
  }
}

export default withStyles(styles)(Demographic);
