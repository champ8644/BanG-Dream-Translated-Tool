import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';

export default withStyles({
  root: props => {
    return {
      height: 10,
      backgroundColor: props.background || '#FFB1A8'
    };
  },
  bar: props => ({
    borderRadius: 20,
    backgroundColor: '#FF6C5C',
    transition: `transform ${props.delay}ms linear`
  })
})(LinearProgress);
