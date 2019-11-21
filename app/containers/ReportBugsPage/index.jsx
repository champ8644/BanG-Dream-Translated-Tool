'use strict';

import React, { Component } from 'react';

import { APP_NAME } from '../../constants/meta';
import GenerateErrorReport from '../ErrorBoundary/components/GenerateErrorReport';
import { Helmet } from 'react-helmet';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { log } from '@Log';
import { styles } from './styles';
import { withStyles } from '@material-ui/core/styles';

class ReportBugsPage extends Component {
  render() {
    const { classes: styles } = this.props;
    return (
      <div className={styles.root}>
        <Helmet titleTemplate={`%s - ${APP_NAME}`}>
          <title>Report Bugs</title>
        </Helmet>
        <GenerateErrorReport />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators({}, dispatch);

const mapStateToProps = (state, props) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ReportBugsPage));
