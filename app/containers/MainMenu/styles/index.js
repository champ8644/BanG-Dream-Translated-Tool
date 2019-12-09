'use strict';

import { mixins, variables } from '../../../styles/js';

export const styles = theme => {
  return {
    root: { height: '100%' },
    paper: {},
    btn: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      color: 'white',
      height: '2.5em',
      width: '8em',
      marginTop: '1.5em',
      fontSize: '2.5em',
      textDecoration: 'none !important'
    },
    btn2: {
      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
      color: 'white',
      height: '2.5em',
      width: '8em',
      marginTop: '1.5em',
      fontSize: '2.5em',
      textDecoration: 'none !important'
    }
  };
};
