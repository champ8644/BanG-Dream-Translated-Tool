'use strict';

import { mixins, variables } from '../../../styles/js';

export const styles = theme => {
  return {
    root: props => {
      return {
        height: '100%',
        display: 'grid',
        backgroundColor: props.backgroundColor
      };
    },
    centeredText: {
      left: '50%',
      top: '50%',
      position: 'absolute',
      transform: 'translate(-50%,-50%)',
      fontSize: '10em'
    }
  };
};
