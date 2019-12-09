'use strict';

import { Redirect, Route, Switch } from 'react-router';

import BodyAreaPane from '../containers/HomePage/component/BodyAreaPane';
import MainMenu from '../containers/MainMenu/Loadable';
import PVSAT from '../containers/TestFieldPage/test';
import React from 'react';
import Stroop from '../containers/Stroop/Loadable';

export const routes = {
  Home: {
    path: '/home',
    locate: '/home',
    exact: true,
    component: BodyAreaPane
  },
  MainMenu: {
    path: '/home/mainmenu',
    locate: '/home/mainmenu',
    exact: true,
    component: MainMenu
  },
  RootStroop: {
    path: '/home/stroop',
    exact: true,
    component: () => <Redirect to='/home/mainmenu' />
  },
  Stroop: {
    path: '/home/stroop/:id',
    locate: '/home/stroop',
    exact: true,
    component: Stroop
  },
  RootPVSAT: {
    path: '/home/pvsat',
    exact: true,
    component: () => <Redirect to='/home/mainmenu' />
  },
  PVSAT: {
    path: '/home/pvsat/:id',
    locate: '/home/pvsat',
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
