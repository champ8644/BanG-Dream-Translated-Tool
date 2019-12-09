'use strict';

import * as actions from './actions';

import React, { Component } from 'react';

import { APP_TITLE } from '../../constants/meta';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import Paper from '@material-ui/core/Paper';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import reducers from './reducers';
import { routes } from '../../routing/mainMenu';
import { styles } from './styles';
import { withReducer } from '../../store/reducers/withReducer';
import { withStyles } from '@material-ui/core/styles';

const mapStateToProps = (state, props) => {
  return {};
};

class MainMenu extends Component {
  render() {
    const { classes: styles, history } = this.props;
    return (
      <div className={styles.root}>
        <Helmet titleTemplate={`%s - ${APP_TITLE}`}>
          <title>Main Menu!</title>
        </Helmet>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={styles.paper}>
              <Button
                className={styles.btn}
                onClick={() => history.push(`${routes.Stroop.locate}`)}
              >
                Stroop
              </Button>
              <Button
                className={styles.btn2}
                onClick={() => history.push(`${routes.PVSAT.locate}/1`)}
              >
                PVSAT
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className={styles.paper}>xs=12 sm=6</Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className={styles.paper}>xs=12 sm=6</Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={styles.paper}>xs=6 sm=3</Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={styles.paper}>xs=6 sm=3</Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={styles.paper}>xs=6 sm=3</Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={styles.paper}>xs=6 sm=3</Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(actions, dispatch);

export default withReducer('MainMenu', reducers)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(MainMenu))
);
