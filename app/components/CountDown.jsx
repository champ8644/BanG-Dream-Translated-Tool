/* eslint-disable no-await-in-loop  */
/* eslint-disable react/destructuring-assignment */
import React, { PureComponent } from 'react';
import { isDark, toHex } from '../utils/colorHelper';

import CrossHair from './CrossHair';
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

const styles = theme => {
  return {
    root: props => {
      return {
        height: '100%',
        backgroundColor: props.background || 'black'
      };
    },
    centeredText: props => {
      const backgroundColor = props.background || 'black';
      let hex = toHex(backgroundColor);
      if (hex === null) hex = '#000000';
      if (isDark(hex))
        return {
          left: '50%',
          top: '50%',
          position: 'absolute',
          transform: 'translate(-50%,-50%)',
          fontSize: '10em',
          color: '#000000',
          textShadow: stroke(5, '#FFFFFF')
        };
      return {
        left: '50%',
        top: '50%',
        position: 'absolute',
        transform: 'translate(-50%,-50%)',
        fontSize: '10em',
        color: '#FFFFFF',
        textShadow: stroke(5, '#000000')
      };
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
      fade: props.fade,
      showCrossHair: false
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
    this.setState({ showCrossHair: true });
    await timeOut(this.state.interval - this.state.fade);
    this.setState({ showCrossHair: false });
    await timeOut(500);
    this.props.callBack();
  }

  render() {
    const { classes: styles } = this.props;
    return (
      <div className={styles.root}>
        <div className={styles.centeredText}>
          <Grow in={this.state.showNumber} timeout={this.props.fade}>
            <div>{this.state.countNumber}</div>
          </Grow>
        </div>
        <CrossHair
          className={styles.centeredText}
          show={this.state.showCrossHair}
          backgroundColor='black'
        />
      </div>
    );
  }
}

export default withStyles(styles)(CountDown);
