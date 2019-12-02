'use strict';

import { mixins, variables } from '../../../styles/js';

export const styles = theme => {
  return {
    root: {
      height: '100%'
    },
    centeredText: {
      left: '50%',
      top: '50%',
      position: 'absolute',
      transform: 'translate(-50%,-50%)',
      fontSize: '15em'
    }
  };
};
