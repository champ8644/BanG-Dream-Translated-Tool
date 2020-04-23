import { videoListMaxWidth } from '../constants/index';

export const styles = theme => ({
  root: {
    display: 'flex',
    margin: theme.spacing(1, 0, 0, 4)
  },
  details: props => {
    let backgroundColor = theme.palette.background.default;
    if (props.cancelWork) backgroundColor = '#fff7f6';
    else if (props.readyToWork) backgroundColor = '#dceffd';
    return {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      backgroundColor
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
  loader: props => ({
    position: 'absolute',
    marginLeft: `${props.vCap.dWidth / 2 - 20}px`,
    marginTop: `${props.vCap.dHeight / 2 - 20}px`,
    zIndex: 10
  }),
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
  FAB: { marginTop: theme.spacing(1) },
  refreshFAB: {
    marginTop: theme.spacing(1),
    color: theme.palette.grey[300],
    fontWeight: theme.typography.fontWeightBold,
    WebkitTextStroke: 'thin',
    WebkitTextStrokeColor: 'black',
    textShadow: '1px 1px gray'
  }
});
