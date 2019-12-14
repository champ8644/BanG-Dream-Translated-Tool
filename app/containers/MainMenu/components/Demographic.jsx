'use strict';

import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
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
          <Paper className={clsx(styles.paperTop, styles.doubleMargin)}>
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
              <Divider
                orientation='vertical'
                className={styles.marginDivider}
              />
              <Grid item>
                <Tooltip title='Start test with no time limit.'>
                  <Button className={styles.btn} onClick={() => {}}>
                    Update Data
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
          </Paper>
        </Grow>
      </div>
    );
  }
}

export default withStyles(styles)(Demographic);
