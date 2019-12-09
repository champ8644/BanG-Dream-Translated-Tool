'use strict';

import * as actions from './actions';

import React, { Component } from 'react';

import { APP_TITLE } from '../../constants/meta';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import reducers from './reducers';
import { routes } from '../../routing';
import { withReducer } from '../../store/reducers/withReducer';

const mapStateToProps = (state, props) => {
  return {};
};

class ThirdPage extends Component {
  render() {
    return (
      <>
        <Helmet titleTemplate={`%s - ${APP_TITLE}`}>
          <title>Third Page!</title>
        </Helmet>
        <h1>This is the third page!</h1>
        <Link to={routes.Home.path}>Go back</Link>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(actions, dispatch);

export default withReducer('ThirdPage', reducers)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ThirdPage)
);
