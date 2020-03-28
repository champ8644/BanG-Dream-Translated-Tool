'use strict';

import { mixins, variables } from '../../../styles/js';

export const styles = theme => {
  return {
    root: {
      ...mixins().appDragEnable
    },
    grow: {
      flexGrow: 1
    },
    toolbarInnerWrapper: {
      display: 'flex'
    },
    toolbar: {
      width: `auto`,
      height: variables().sizes.toolbarHeight
    },
    toolbarTitle: {
      display: 'flex',
      fontSize: '1.5em',
      marginLeft: '1em',
      fontWeight: 'bold',
      color: 'white',
      flexGrow: 1
    },
    appBar: {},
    navBtns: {
      paddingLeft: 5
    },
    noAppDrag: {
      ...mixins().appDragDisable
    },
    navBtnImgs: {
      height: 25,
      width: `auto`,
      ...mixins().noDrag,
      ...mixins().noselect
    },
    disabledNavBtns: {
      backgroundColor: `#f9f9f9`
    },
    invertedNavBtns: {
      [`&:hover`]: {
        filter: `none`
      },
      [`&:not(:hover)`]: {
        filter: `invert(100)`,
        background: variables().styles.primaryColor.main
      }
    },
    rightMargin: {
      marginRight: '1em'
    }
  };
};
