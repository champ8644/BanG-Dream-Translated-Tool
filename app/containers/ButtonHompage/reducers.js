import { actionTypes } from './actions';

export const initialState = {
  versionChecked: false,
  loading: true
};

export default function Reducer(state = initialState, action) {
  const { type } = action;
  switch (type) {
    case actionTypes.VERSION_CHECK_PASS:
      return { ...state, versionChecked: true, loading: false };
    case actionTypes.VERSION_CHECK_FAIL:
      return { ...state, versionChecked: false, loading: false };
    case actionTypes.VERSION_CHECK_ERROR:
      return { ...state, versionChecked: false, loading: false };
    case actionTypes.RELOAD:
      return { ...state, versionChecked: false, loading: true };
    default:
      return state;
  }
}
