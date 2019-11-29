'use strict';

import prefixer from '../../utils/reducerPrefixer';

const prefix = '@@TestField';
const actionTypesList = [];

export const actionTypes = prefixer(prefix, actionTypesList);
