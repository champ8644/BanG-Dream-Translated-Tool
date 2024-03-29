'use strict';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { mixins, variables } from '../../../styles/js';

export const styles = theme => {
  return {
    root: {
      height: 'calc(100vh - 78px)',
      padding: theme.spacing(3, 5)
    },
    switchRoot: {
      alignSelf: 'center',
      display: 'flex'
    },
    switchBase: {
      color: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: fade(
          theme.palette.primary.main,
          theme.palette.action.hoverOpacity
        ),
        '@media (hover: none)': {
          backgroundColor: 'transparent'
        }
      }
    },
    track: {
      backgroundColor: theme.palette.primary.main
    },
    chip: {
      margin: theme.spacing(0.5)
    },
    chipBar: {
      paddingBottom: theme.spacing(2)
    },
    marginTop: {
      marginTop: theme.spacing(3)
    },
    marginLeft: { marginLeft: '1em' },
    marginDivider: { margin: '1em' },
    formControlInput: {
      marginLeft: theme.spacing(3)
    },
    paperTop: {
      height: '100px',
      display: 'flex',
      justifyContent: 'center',
      padding: '2em'
    },
    paper: {
      display: 'inline-block',
      margin: theme.spacing(0, 1.5, 0, 3)
    },
    paperTitle: {
      padding: theme.spacing(1),
      margin: theme.spacing(2)
    },
    TitleFileName: {
      margin: theme.spacing(2.5, 4)
    },
    paperWatch: {
      marginLeft: '1rem',
      alignSelf: 'center',
      padding: '0 1rem'
    },
    videoEachHeader: {
      margin: theme.spacing(0, 0, 0, 4)
    },
    videoEachPath: {
      margin: theme.spacing(0, 0, 0, 1)
    },
    canvas: {
      marginTop: theme.spacing(3)
    },
    Papers: {
      padding: theme.spacing(2),
      margin: theme.spacing(2)
    },
    paperRadio: {
      margin: theme.spacing(3, 3, 3, 0)
    },
    formControl: {
      margin: theme.spacing(3)
    },
    PaperSlider: {
      width: '500px',
      padding: theme.spacing(2),
      margin: theme.spacing(3, 3, 3, 0)
    },
    buttonSliderContainer: {
      margin: theme.spacing(3, 3, 0, 0)
    },
    paper1: {
      display: 'flex',
      justifyContent: 'center',
      padding: '1em',
      background: '#86A8E7'
    },
    paper2: {
      display: 'flex',
      justifyContent: 'center',
      padding: '1em',
      background: '#F26DAF'
    },
    paper3: {
      display: 'flex',
      justifyContent: 'center',
      padding: '1em'
    },
    paperLinear: {
      width: '100%',
      marginTop: theme.spacing(3),
      '& > * + *': {
        marginTop: theme.spacing(2)
      }
    },
    sliderLabel: {
      width: '3rem'
    },
    titlePaper: {
      justifyContent: 'center',
      display: 'flex',
      color: 'white',
      textShadow: '2px 2px #000000'
    },
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
      height: '2.5em',
      flexGrow: 1,
      fontSize: '1.3em',
      textDecoration: 'none !important'
    },
    btnDisabled: {
      background: 'gray'
    },
    btn3: {
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
    rootBody: {
      marginTop: theme.spacing(3),
      display: 'contents'
    },
    section1: {
      margin: theme.spacing(1)
    },
    section2: {
      margin: theme.spacing(1)
    },
    section3: {
      margin: theme.spacing(3, 1, 1)
    },
    padding: { padding: '2em' },
    frontHN: {
      margin: theme.spacing(0, 2, 0, 1)
    },
    flex: { display: 'flex' },
    indent: {
      margin: theme.spacing(0, 0, 0, 3)
    },
    spanBoxTrue: {
      // position: 'absolute',
      display: 'flex',
      // width: '75px',
      textAlign: 'center',
      alignSelf: 'center',
      height: '30px',
      backgroundColor: fade(
        theme.palette.secondary.main,
        theme.palette.action.hoverOpacity
      ),
      padding: '3px 8px',
      fontWeight: 700,
      border: '2px',
      borderStyle: 'solid',
      borderColor: theme.palette.secondary.main,
      color: theme.palette.secondary.main
    },
    spanBoxFalse: {
      // position: 'absolute',
      display: 'inline-block',
      alignSelf: 'center',
      height: '30px',
      // width: '75px',
      textAlign: 'center',
      backgroundColor: fade(
        theme.palette.primary.main,
        theme.palette.action.hoverOpacity
      ),
      padding: '3px 8px',
      fontWeight: 700,
      border: '2px',
      borderStyle: 'solid',
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.main
    }
  };
};
