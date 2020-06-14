import { APP_VERSION } from '../../constants/meta';
import firebase from 'firebase';
import { minorCompare } from '../../utils/compareVersion';
import { name } from './config.json';
import prefixer from '../../utils/reducerPrefixer';

const prefix = `@@${name}`;
const actionTypesList = [];
const db = firebase.firestore();

actionTypesList.push('VERSION_CHECK_PASS');
actionTypesList.push('VERSION_CHECK_FAIL');
actionTypesList.push('VERSION_CHECK_ERROR');
export function firebaseCheck() {
  return async dispatch => {
    try {
      const doc = await db
        .collection('version')
        .doc('version')
        .get();
      if (doc.exists) {
        const { version: cloudVersion } = doc.data();
        if (minorCompare(cloudVersion, APP_VERSION) <= 0) {
          return dispatch({
            type: actionTypes.VERSION_CHECK_PASS
          });
        }
      }
      dispatch({
        type: actionTypes.VERSION_CHECK_FAIL
      });
    } catch (err) {
      throw err;
    }
  };
}

export const actionTypes = prefixer(prefix, actionTypesList);
