'use strict';

import { mixins, variables } from '../../../styles/js';

export const styles = theme => {
  return {
    root: {
      height: '100vh',
      background: variables().styles.backgroundColor.main
    },
    paper: { display: 'flex', justifyContent: 'center', padding: '1em' },
    btn: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      color: 'white',
      height: '2.5em',
      flexGrow: 1,
      fontSize: '1.3em',
      textDecoration: 'none !important'
    },
    btn2: {
      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
      color: 'white',
      padding: '0 1em',
      height: '2.5em',
      fontSize: '2em',
      textDecoration: 'none !important'
    },
    doubleMargin: {
      margin: theme.spacing(2)
    },
    margin: {
      margin: theme.spacing(1)
    },
    withoutLabel: {
      marginTop: theme.spacing(3)
    },
    textField: { margin: theme.spacing(1) },
    padding: { padding: '2em' }
  };
};
