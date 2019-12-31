'use strict';

import * as actions from './actions';

import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import { APP_TITLE } from '../../constants/meta';
import { Helmet } from 'react-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import reducers from './reducers';
import { withReducer } from '../../store/reducers/withReducer';
import { styles } from './styles';
import { withStyles } from '@material-ui/core/styles';

const mapStateToProps = (state, props) => {
  return {};
};

class Lounge extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  componentDidMount() {
    const ctx = this.canvas.current.getContext('2d');
    ctx.fillRect(0, 0, 100, 100);
  }

  handleClick() {
    this.rect({ x: 50, y: 50, width: 150, height: 150 });
  }

  rect(props) {
    const ctx = this.canvas.current.getContext('2d');
    const { x, y, width, height } = props;
    ctx.fillRect(x, y, width, height);
  }

  render() {
    return (
      <>
        <Helmet titleTemplate={`%s - ${APP_TITLE}`}>
          <title>Third Page!</title>
        </Helmet>

        <h1>This is the third page!</h1>
        <Button className={styles.btn} onClick={this.handleClick}>
          Open CV Tests
        </Button>
        <canvas ref={this.canvas} width={300} height={300} />
      </>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(actions, dispatch);

export default withReducer('Lounge', reducers)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(Lounge))
);
