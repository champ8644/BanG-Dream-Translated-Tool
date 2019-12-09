'use strict';

import { Route, Switch } from 'react-router';

import BodyAreaPane from '../containers/HomePage/components/BodyAreaPane';
import MainSubcomponent from '../containers/MainSubcomponent/Loadable';
import PVSAT from '../containers/TestFieldPage/test';
import React from 'react';
import Stroop from '../containers/TestFieldPage';

export const routes = {
  Home: {
    path: '/home',
    exact: true,
    component: BodyAreaPane
  },
  Main: {
    path: '/home/main',
    exact: true,
    component: MainSubcomponent
  },
  Stroop: {
    path: '/home/stroop',
    exact: true,
    component: Stroop
  },
  PVSAT: {
    path: '/home/pvsat',
    exact: true,
    component: PVSAT
  }
};

export default () => (
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
);
