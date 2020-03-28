import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';
import { styles } from './styles';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

function LoadingIndicator(props) {
  const { classes: styles } = props;
  return (
    <div>
      <CircularProgress
        color='secondary'
        className={styles.progress}
        size={50}
      />
    </div>
  );
}

export default withRouter(withStyles(styles)(LoadingIndicator));
