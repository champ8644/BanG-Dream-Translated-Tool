'use strict';

import { Route, Switch } from 'react-router';

import React from 'react';
import User from '../containers/User/Loadable';

export const routes = {
  User: {
    path: '/home/mainmenu/user',
    locate: '/home/mainmenu/user',
    exact: false,
    component: User
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
