import { videoListMaxWidth } from '../constants/index';

export const styles = theme => ({
  root: {
    display: 'flex',
    marginTop: theme.spacing(1)
  },
  details: {
    display: 'flex',
    flexDirection: 'column'
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
  loader: {
    position: 'absolute',
    marginLeft: '76px',
    marginTop: '52px'
  }
});
