'use strict';

import { mixins, variables } from '../../../styles/js';

export const styles = theme => {
  return {
    root: {
      height: '100%',
      backgroundColor: variables().styles.backgroundColor.main
    },
    centeredText: {
      left: '50%',
      top: '50%',
      position: 'absolute',
      transform: 'translate(-50%,-50%)',
      fontSize: '5em'
    },
    btnWrapper: {
      ...mixins().center,
      width: '100%',
      textAlign: 'center'
    },
    btn: {
      margin: 10
    }
  };
};
