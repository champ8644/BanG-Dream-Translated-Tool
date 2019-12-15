import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';

export default withStyles({
  root: {
    height: 10,
    backgroundColor: '#FFB1A8'
  },
  bar: props => ({
    borderRadius: 20,
    backgroundColor: '#FF6C5C',
    transition: `transform ${props.delay}ms linear`
  })
})(LinearProgress);
