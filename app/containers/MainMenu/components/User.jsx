'use strict';

import React, { Component } from 'react';

import { APP_TITLE } from '../../../constants/meta';
import Card from './Card';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import { Helmet } from 'react-helmet';
import LoadingIndicator from '../../../components/LoadingIndicator';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { routes } from '../../../routing/mainMenu';
import { styles } from '../styles';
import { withStyles } from '@material-ui/core/styles';

const StroopCards = [
  {
    index: 1,
    title: 'Stroop background',
    subTitle: 'answer background color'
  },
  {
    index: 2,
    title: 'Stroop text',
    subTitle: 'answer text meaning'
  },
  {
    index: 3,
    title: 'Stroop color',
    subTitle: 'answer text color'
  }
];

class User extends Component {
  render() {
    const { classes: styles, history, data, loading } = this.props;
    if (loading) return <LoadingIndicator />;
    return (
      <div className={styles.rootBody}>
        <Helmet titleTemplate={`%s - ${APP_TITLE}`}>
          <title>Main Menu!</title>
        </Helmet>
        <Grow in={data !== null}>
          <Grid
            item
            container
            direction='row'
            justify='center'
            alignItems='center'
            spacing={5}
          >
            <Grid item>
              <Paper className={styles.paper1}>
                <Grid direction='column' className={styles.section1}>
                  <Typography
                    gutterBottom
                    variant='h3'
                    className={styles.titlePaper}
                  >
                    Stroop
                  </Typography>
                  <Divider />
                  <Grid
                    item
                    container
                    direction='row'
                    justify='space-around'
                    alignItems='center'
                    spacing={5}
                  >
                    {StroopCards.map(x => (
                      <Grid item key={x.index}>
                        <Card
                          title={x.title}
                          subTitle={x.subTitle}
                          onClick={() =>
                            history.push(`${routes.Stroop.locate}/${x.index}`)
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs>
              <Paper className={styles.paper2}>
                <Grid direction='column' className={styles.section2}>
                  <Typography
                    gutterBottom
                    variant='h3'
                    className={styles.titlePaper}
                  >
                    PVSAT
                  </Typography>
                  <Divider />
                  <Grid
                    item
                    container
                    direction='row'
                    justify='space-around'
                    alignItems='center'
                    spacing={5}
                  >
                    <Grid item>
                      <Card
                        title='PVSAT'
                        subTitle='PVSAT'
                        onClick={() => history.push(`${routes.PVSAT.locate}/1`)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grow>
      </div>
    );
  }
}

export default withStyles(styles)(User);
