/* eslint-disable no-await-in-loop  */
/* eslint-disable react/destructuring-assignment */
import React, { PureComponent } from 'react';

import Grow from '@material-ui/core/Grow';
import { timeOut } from '../utils/asyncHelper';
import { withStyles } from '@material-ui/core/styles';

function stroke(stroke, color) {
  let shadow = `0px 0px 0 ${color} `;
  for (let i = -stroke; i <= stroke; i += 1) {
    for (let j = -stroke; j <= stroke; j += 1) {
      shadow += `, ${i}px ${j}px 0 ${color}`;
    }
  }
  return shadow;
}

const stroke5 = stroke(5, '#000');

const styles = theme => {
  return {
    root: {
      left: '50%',
      top: '50%',
      position: 'absolute',
      transform: 'translate(-50%,-50%)',
      fontSize: '10em',
      color: '#FFF',
      textShadow: stroke5
    }
  };
};

class CountDown extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      countNumber: props.from,
      showNumber: false,
      interval: props.interval,
      fade: props.fade
    };
  }

  componentDidMount() {
    this.startAnimations();
  }

  async startAnimations() {
    while (this.state.countNumber > 0) {
      this.setState({ showNumber: true });
      await timeOut(this.state.interval - this.state.fade);
      this.setState({ showNumber: false });
      await timeOut(this.state.fade);
      this.setState(state => ({
        countNumber: state.countNumber - 1
      }));
    }
    this.props.callBack();
  }

  render() {
    const { classes: styles } = this.props;
    return (
      <div className={styles.root}>
        <Grow in={this.state.showNumber} timeout={this.props.fade}>
          <div>{this.state.countNumber}</div>
        </Grow>
      </div>
    );
  }
}

export default withStyles(styles)(CountDown);
