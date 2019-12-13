'use strict';

import * as actions from './actions';

import React, { Component } from 'react';
import { makeData, makeDisplayHN, makeHN, makeLoading } from './selectors';

import { APP_TITLE } from '../../constants/meta';
import Grid from '@material-ui/core/Grid';
import HNsearchbox from './components/HNsearchbox';
import { Helmet } from 'react-helmet';
import User from './components/User';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import reducers from './reducers';
import { styles } from './styles';
import { withReducer } from '../../store/reducers/withReducer';
import { withStyles } from '@material-ui/core/styles';

const mapStateToProps = (state, props) => {
  return {
    HN: makeHN(state),
    displayHN: makeDisplayHN(state),
    loading: makeLoading(state),
    data: makeData(state)
  };
};

class MainMenu extends Component {
  render() {
    const {
      classes: styles,
      handleChangeHN,
      handleSubmitHN,
      displayHN,
      HN,
      history,
      fetchFireData,
      loading,
      data
    } = this.props;
    return (
      <div className={styles.root}>
        <Helmet titleTemplate={`%s - ${APP_TITLE}`}>
          <title>Main Menu!</title>
        </Helmet>
        <Grid container spacing={3} className={styles.padding}>
          <Grid container item spacing={3} justify='center'>
            <HNsearchbox
              HN={displayHN}
              handleChangeHN={handleChangeHN}
              handleSubmitHN={handleSubmitHN}
            />
          </Grid>

          <Grid container item spacing={3} justify='center'>
            <User
              fetchFireData={fetchFireData}
              history={history}
              HN={HN}
              loading={loading}
              data={data}
            />
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
