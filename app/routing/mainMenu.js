'use strict';

import { Route, Switch } from 'react-router';

import BodyAreaPane from '../containers/HomePage/component/BodyAreaPane';
import MainMenu from '../containers/Lounge/Loadable';
import React from 'react';

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
    exact: false,
    component: MainMenu
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
