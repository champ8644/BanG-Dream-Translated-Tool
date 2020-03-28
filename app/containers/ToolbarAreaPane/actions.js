'use strict';

import prefixer from '../../utils/reducerPrefixer';

const prefix = '@@Toolbar';
const actionTypesList = [];

export const actionTypes = prefixer(prefix, actionTypesList);
