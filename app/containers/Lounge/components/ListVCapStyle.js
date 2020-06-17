import { fade } from '@material-ui/core/styles/colorManipulator';
import green from '@material-ui/core/colors/green';
import { videoListMaxWidth } from '../constants/index';

export const styles = theme => ({
  root: {
    display: 'flex',
    margin: theme.spacing(1, 0, 0, 4)
  },
  details: props => {
    const addProps = {};
    if (props.cancelWork) addProps.backgroundColor = '#fff7f6';
    else if (props.completeWork) addProps.backgroundColor = '#e5f3e6';
    else if (props.readyToWork) addProps.backgroundColor = '#dceffd';
    return {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      ...addProps
    };
  },
  header: {
    height: '8em',
    display: 'grid',
    paddingBottom: 0
  },
  content: {
    flex: '1 0 auto',
    display: 'flex'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  grow: {
    flexGrow: 1,
    display: 'flex'
  },
  column: {
    flexDirection: 'column',
    display: 'flex',
    flexGrow: 1
  },
  row: {
    flexDirection: 'row',
    display: 'flex',
    flexGrow: 1
  },
  flex: {
    display: 'flex'
  },
  playIcon: {
    height: 38,
    width: 38
  },
  chipBar: {
    paddingBottom: theme.spacing(1)
  },
  chip: {
    marginLeft: theme.spacing(1)
  },
  isLoading: props => {
    if (props.vCap && props.vCap.dWidth && props.vCap.dHeight)
      return {
        position: 'absolute',
        marginLeft: `${props.vCap.dWidth / 2 - 20}px`,
        marginTop: `${props.vCap.dHeight / 2 - 20}px`,
        zIndex: 10
      };
    return {};
  },
  isConverting: {
    position: 'absolute',
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    zIndex: 10
  },
  circularWrapper: {
    position: 'relative'
  },
  closeIcon: {
    height: '2em'
  },
  FPSTooltip: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.pxToRem(10),
    fontWeight: theme.typography.fontWeightMedium
  },
  noMaxWidth: {
    maxWidth: 'none'
  },
  refreshButton: {
    margin: theme.spacing(1, 0, 0, 4)
  },
  absolute: {
    position: 'absolute'
  },
  buttonCanvas: props => ({
    '&:hover': {
      zIndex: 1,
      '& $imageBackdrop': {
        opacity: props.cancelWork ? 0.15 : 0
      },
      '& $imageButtonFAB': {
        opacity: props.cancelWork ? 1 : 0
      }
    }
  }),
  imageBackdrop: props => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: props.cancelWork ? 0.5 : 0,
    transition: theme.transitions.create('opacity')
  }),
  imageButtonFAB: () => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: theme.transitions.create('opacity')
  }),
  cover: {
    width: videoListMaxWidth
  },
  basename: props =>
    props.cancelWork ? { color: theme.palette.error.dark } : {},
  FAB: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    WebkitTapHighlightColor: 'transparent',
    // We disable the focus ring for mouse, touch and keyboard users.
    outline: 0,
    border: 0,
    margin: 0, // Remove the margin in Safari
    cursor: 'pointer',
    userSelect: 'none',
    verticalAlign: 'middle',
    '-moz-appearance': 'none', // Reset
    '-webkit-appearance': 'none', // Reset
    textDecoration: 'none',
    '@media print': {
      colorAdjust: 'exact'
    },
    // marginTop: theme.spacing(1),
    ...theme.typography.button,
    boxSizing: 'border-box',
    minHeight: 36,
    transition: theme.transitions.create(
      ['background-color', 'box-shadow', 'border'],
      {
        duration: theme.transitions.duration.short
      }
    ),
    borderRadius: '50%',
    padding: 0,
    minWidth: 0,
    width: 48,
    height: 48,
    boxShadow: theme.shadows[6],
    '&:active': {
      boxShadow: theme.shadows[12]
    },
    color: theme.palette.getContrastText(theme.palette.grey[300]),
    backgroundColor: theme.palette.grey[300],
    '&:hover': {
      backgroundColor: theme.palette.grey.A100,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: theme.palette.grey[300]
      },
      textDecoration: 'none'
    }
  },
  childFAB: {
    width: '100%',
    display: 'inherit',
    alignItems: 'inherit',
    justifyContent: 'inherit'
  },
  refreshFAB: {
    marginTop: theme.spacing(1),
    color: theme.palette.grey[300],
    fontWeight: theme.typography.fontWeightBold,
    WebkitTextStroke: 'thin',
    WebkitTextStrokeColor: 'black',
    textShadow: '1px 1px gray'
  },
  typographyMiddle: {
    position: 'relative'
  },
  switchRoot: {
    marginLeft: '75px'
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
  circularBox: {
    position: 'absolute',
    display: 'inline-block',
    width: '75px',
    textAlign: 'center',
    padding: '3px 8px'
  },
  circularChild: {
    position: 'relative'
  },
  spanBox: props => {
    const { isEvent } = props;
    let mainColor = theme.palette.primary;
    if (isEvent) mainColor = theme.palette.secondary;
    return {
      position: 'absolute',
      display: 'inline-block',
      width: '75px',
      textAlign: 'center',
      backgroundColor: fade(mainColor.main, theme.palette.action.hoverOpacity),
      padding: '3px 8px',
      fontWeight: 700,
      border: '2px',
      borderStyle: 'solid',
      borderColor: mainColor.main,
      color: mainColor.main
    };
  },
  openFolderButton: {
    color: green[500],
    border: `1px solid ${fade(green[500], 0.5)}`,
    '&:hover': {
      border: `1px solid ${green[500]}`,
      backgroundColor: fade(green[500], theme.palette.action.hoverOpacity),
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: 'transparent'
      }
    }
  }
});
