'use strict';

import { mixins, variables } from '../../../styles/js';

function stroke(stroke, color) {
  let shadow = '';
  for (let i = -stroke; i <= stroke; i += 1) {
    for (let j = -stroke; j <= stroke; j += 1) {
      shadow += `${i}px ${j}px 0 ${color}, `;
    }
  }
  return shadow;
}

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
      fontSize: '10em'
    },
    linearProgress: {},
    countDown: {
      textShadow: stroke(2, '#000')
    }
  };
};
