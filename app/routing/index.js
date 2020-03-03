'use strict';

import { Redirect, Route, Switch } from 'react-router';

import { HashRouter } from 'react-router-dom';
import HomePage from '../containers/HomePage/Loadable';
import NotFoundPage from '../containers/NotFoundPage/Loadable';
import PrivacyPolicyPage from '../containers/PrivacyPolicyPage/Loadable';
import ProgressbarPage from '../containers/ProgressbarPage';
import React from 'react';
import ReportBugsPage from '../containers/ReportBugsPage/Loadable';

export const routes = {
  Root: {
    path: '/',
    exact: true,
    component: () => <Redirect exact from='/' to='home' />
  },
  Home: {
    path: '/home',
    exact: false,
    component: HomePage
  },
  ReportBugsPage: {
    path: '/reportBugsPage',
    exact: true,
    component: ReportBugsPage
  },
  ProgressbarPage: {
    path: '/progressbarPage',
    exact: true,
    component: ProgressbarPage
  },
  PrivacyPolicyPage: {
    path: '/privacyPolicyPage',
    exact: true,
    component: PrivacyPolicyPage
  },
  NotFound: {
    component: NotFoundPage
  }
};

export default () => (
  <HashRouter>
    <Switch>
      {Object.keys(routes).map(a => {
        return (
          <Route
            key={routes[a].path || 'notfound'}
            {...routes[a]}
            component={routes[a].component}
          />
        );
      })}
    </Switch>
  </HashRouter>
);
