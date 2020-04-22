import { videoListMaxWidth } from '../constants/index';

export const styles = theme => ({
  root: {
    display: 'flex',
    margin: theme.spacing(1, 0, 0, 4)
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  },
  header: {
    height: '8em',
    display: 'grid'
  },
  content: {
    flex: '1 0 auto'
  },
  cover: {
    width: videoListMaxWidth
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  playIcon: {
    height: 38,
    width: 38
  },
  loader: props => ({
    position: 'absolute',
    marginLeft: `${props.vCap.dWidth / 2 - 20}px`,
    marginTop: `${props.vCap.dHeight / 2 - 20}px`
  }),
  closeIcon: {
    height: '2em'
  },
  middle: { display: 'flex' }
});
