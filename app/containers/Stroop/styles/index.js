'use strict';

import { mixins, variables } from '../../../styles/js';

export const styles = theme => {
  return {
    root: props => {
      return {
        height: '100%',
        backgroundColor: props.backgroundColor
      };
    }
  };
};
