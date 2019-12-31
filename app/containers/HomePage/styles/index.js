'use strict';

import { mixins, variables } from '../../../styles/js';

export const styles = theme => {
  return {
    root: { overflow: 'auto' },
    grid: {
      width: `100%`
    },
    body: {
      height: 'calc(100vh - 70px)',
      overflowY: 'auto'
    }
  };
};
