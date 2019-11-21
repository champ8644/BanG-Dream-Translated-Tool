'use strict';

import React from 'react';
import { Switch, Route } from 'react-router';
import { HashRouter } from 'react-router-dom';
import HomePage from '../containers/HomePage/Loadable';
import SecondPage from '../containers/SecondPage/Loadable';
import ReportBugsPage from '../containers/ReportBugsPage/Loadable';
import ProgressbarPage from '../containers/ProgressbarPage';
import PrivacyPolicyPage from '../containers/PrivacyPolicyPage/Loadable';
import NotFoundPage from '../containers/NotFoundPage/Loadable';

export const routes = {
  Home: {
    path: '/',
    exact: true,
    component: HomePage
  },
  SecondPage: {
    path: '/secondPage',
    exact: true,
    component: SecondPage
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
      {Object.keys(routes).map(a => (
        <Route
          key={routes[a].path || 'notfound'}
          {...routes[a]}
          component={routes[a].component}
        />
      ))}
    </Switch>
  </HashRouter>
);
