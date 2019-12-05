'use strict';

import { mixins, variables } from '../../../styles/js';

// /// Mixin to place items on a circle
// /// @author Hugo Giraudel
// /// @author Ana Tudor
// /// @param {Integer} $item-count - Number of items on the circle
// /// @param {Length} $circle-size - Large circle size
// /// @param {Length} $item-size - Single item size
// @mixin on-circle($item-count, $circle-size, $item-size) {
//   position: relative;
//   width:  $circle-size;
//   height: $circle-size;
//   border-radius: 50%;
//   padding: 0;
//   list-style: none;

//   > * {
//     display: block;
//     position: absolute;
//     top:  50%;
//     left: 50%;
//     margin: -($item-size / 2);
//     width:  $item-size;
//     height: $item-size;

//     $angle: (360 / $item-count);
//     $rot: 0;

//     @for $i from 1 through $item-count {
//       &:nth-of-type(#{$i}) {
//         transform: rotate($rot * 1deg) translate($circle-size / 2) rotate($rot * -1deg);
//       }

//       $rot: $rot + $angle;
//     }
//   }
// }

// .circle-container {
//   @include on-circle($item-count: 8, $circle-size: 20em, $item-size: 6em);
//   margin: 5em auto 0;
//   border: solid 5px tomato;

//   img {
//     display: block;
//     max-width: 100%;
//     border-radius: 50%;
//     filter: grayscale(100%);
//     border: solid 5px tomato;
//     transition: .15s;

//     &:hover {
//       filter: grayscale(0);
//     }
//   }
// }

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
    linearProgress: {}
  };
};
