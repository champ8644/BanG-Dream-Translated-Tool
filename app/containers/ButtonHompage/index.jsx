'use strict';

import * as actions from './actions';

import React, { useEffect } from 'react';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { name } from './config.json';
import reducers from './reducers';
import { routes } from '../../routing/mainMenu';
import selectorGenerator from './selectors';
import { withReducer } from '../../store/reducers/withReducer';

function Main(props) {
  const { classes, history, firebaseCheck, versionChecked, loading } = props;
  useEffect(() => {
    firebaseCheck();
  }, []);
  if (loading)
    return (
      <Button className={classes.btn} disabled>
        Loading... <CircularProgress />
      </Button>
    );
  if (versionChecked)
    return (
      <Button
        className={classes.btn}
        onClick={() => history.push(routes.MainMenu.locate)}
      >
        Start!
      </Button>
    );
  return (
    <Button
      Button
      variant='outlined'
      color='secondary'
      className={classes.largeBtn}
      disabled
    >
      Your app version is outdated
      <br />
      Please contact app provider for new version.
    </Button>
  );
}

const mapStateToProps = (state, props) => {
  return selectorGenerator()(state, props);
};

const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(actions, dispatch);

export default withReducer(name, reducers)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Main)
);
