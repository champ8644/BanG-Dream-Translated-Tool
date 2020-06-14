import { createSelector } from 'reselect';
import { initialState } from './reducers';
import { name } from './config.json';

const getState = (state, props) => (state ? state[name] : initialState);

const selectorGenerator = () =>
  createSelector(
    getState,
    state => ({
      versionChecked: state.versionChecked,
      loading: state.loading
    })
  );

export default selectorGenerator;
