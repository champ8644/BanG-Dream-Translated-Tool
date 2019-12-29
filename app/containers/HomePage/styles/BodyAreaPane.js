'use strict';

import { mixins, variables } from '../../../styles/js';

export const styles = theme => {
  return {
    root: {
      padding: 20,
      display: 'grid',
      justifyItems: 'center'
    },
    btnWrapper: {
      ...mixins().center,
      width: '100%',
      textAlign: 'center'
    },
    title: {
      fontSize: '7em',
      marginTop: '.5em',
      textAlign: 'center'
    },
    title2: {
      fontSize: '4em',
      textAlign: 'center'
    },
    subTitle: {
      fontSize: '2em',
      marginTop: '.5em'
    },
    btn: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      color: 'white',
      height: '3em',
      width: '10em',
      marginTop: '1.5em',
      fontSize: '3em',
      textDecoration: 'none !important'
    },
    btn2: {
      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
      color: 'white',
      height: '3em',
      width: '10em',
      marginTop: '1.5em',
      fontSize: '3em',
      textDecoration: 'none !important'
    }
  };
};
