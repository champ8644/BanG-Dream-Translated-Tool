'use strict';

import { mixins, variables } from '../../../styles/js';

export const styles = theme => {
  return {
    root: {
      height: '100vh'
    },
    subroot: {
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
      fontSize: '6em',
      marginTop: '.5em',
      textAlign: 'center'
    },
    heading1: {
      fontSize: '3.5em',
      textAlign: 'center'
    },
    subTitle: {
      fontSize: '2em',
      marginTop: '.5em'
    },
    largeBtn: {
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      color: 'white',
      // height: '3em',
      // width: '10em',
      marginTop: '2.5em',
      fontSize: '2em',
      textDecoration: 'none !important'
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
