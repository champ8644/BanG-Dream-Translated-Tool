/* eslint-disable no-await-in-loop  */
/* eslint-disable react/destructuring-assignment */
import React, { PureComponent } from 'react';

import { GrowingText } from './BuildingBlocks';
import { styles } from '../styles/CountDown';
import { withStyles } from '@material-ui/core/styles';

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
    const timeOut = ms => new Promise(resolve => setTimeout(resolve, ms));
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
        <div className={styles.centeredText}>
          <GrowingText
            show={this.state.showNumber}
            fade={this.props.fade}
            text={this.state.countNumber}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CountDown);
