'use strict';

/* eslint global-require: off */

import './styles/scss/app.global.scss';

import { configureStore, history } from './store/configureStore';

import { AppContainer } from 'react-hot-loader';
import React from 'react';
import Root from './containers/App/Root';
import firebase from 'firebase';
import firebaseConfig from '../firebaseConfig.json';
import { render } from 'react-dom';

const MOUNT_POINT = document.getElementById('root');
const store = configureStore();
firebase.initializeApp(firebaseConfig);

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  MOUNT_POINT
);

if (module.hot) {
  module.hot.accept('./containers/App/Root', () => {
    const NextRoot = require('./containers/App/Root').default;
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      MOUNT_POINT
    );
  });
}
