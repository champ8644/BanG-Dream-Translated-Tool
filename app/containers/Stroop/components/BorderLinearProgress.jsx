import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/styles';

export default withStyles({
  root: props => {
    if (
      props.colorbackground === 'black' ||
      props.colorbackground === '#000' ||
      props.colorbackground === '#000000'
    )
      return {
        height: 10,
        backgroundColor: '#000000'
      };
    return {
      height: 10,
      backgroundColor: '#FFB1A8'
    };
  },
  bar: props => ({
    borderRadius: 20,
    backgroundColor: '#FF6C5C',
    transition: `transform ${props.delay}ms linear`
  })
})(LinearProgress);
