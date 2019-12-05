'use strict';

import { Route, Switch } from 'react-router';

import { HashRouter } from 'react-router-dom';
import HomePage from '../containers/HomePage/Loadable';
import NotFoundPage from '../containers/NotFoundPage/Loadable';
import OpenCV from '../containers/OpenCVPage/Loadable';
import PrivacyPolicyPage from '../containers/PrivacyPolicyPage/Loadable';
import ProgressbarPage from '../containers/ProgressbarPage';
import React from 'react';
import ReportBugsPage from '../containers/ReportBugsPage/Loadable';
import SecondPage from '../containers/SecondPage/Loadable';
import TestFieldPage from '../containers/TestFieldPage/Loadable';
import TestingPage from '../containers/TestFieldPage/test';

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
  OpenCV: {
    path: '/opencv',
    exact: true,
    component: OpenCV
  },
  TestFieldPage: {
    path: '/testFieldPage',
    exact: true,
    component: TestFieldPage
  },
  TestingPage: {
    path: '/testingPage',
    exact: true,
    component: TestingPage
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
