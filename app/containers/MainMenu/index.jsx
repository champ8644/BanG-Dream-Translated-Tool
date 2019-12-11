'use strict';

import * as actions from './actions';

import React, { Component } from 'react';
import { makeHN, makeRawHN } from './selectors';

import { APP_TITLE } from '../../constants/meta';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Paper from '@material-ui/core/Paper';
import Routes from '../../routing/subComponent';
import SearchIcon from '@material-ui/icons/Search';
import { bindActionCreators } from 'redux';
import clsx from 'clsx';
import { connect } from 'react-redux';
import reducers from './reducers';
import { styles } from './styles';
import { withReducer } from '../../store/reducers/withReducer';
import { withStyles } from '@material-ui/core/styles';

const mapStateToProps = (state, props) => {
  return { HN: makeHN(state), rawHN: makeRawHN(state) };
};
class MainMenu extends Component {
  handleSubmitHN() {
    const { history, rawHN } = this.props;
    if (rawHN === '') history.push('/home/mainmenu');
    else history.push(`/home/mainmenu/user?${rawHN}`);
  }

  render() {
    const { classes: styles, handleChangeHN, HN } = this.props;
    return (
      <div className={styles.root}>
        <Helmet titleTemplate={`%s - ${APP_TITLE}`}>
          <title>Main Menu!</title>
        </Helmet>

        <Grid container spacing={3} className={styles.padding}>
          <Grid container item spacing={3} justify='center'>
            <Paper className={clsx(styles.paper, styles.doubleMargin)}>
              <FormControl
                className={clsx(styles.margin, styles.textField)}
                variant='outlined'
              >
                <InputLabel>Enter HN</InputLabel>
                <OutlinedInput
                  id='input-hn'
                  type='text'
                  value={HN}
                  onChange={e => handleChangeHN(e.target.value)}
                  onKeyPress={e =>
                    e.key === 'Enter' ? this.handleSubmitHN() : null
                  }
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={() => this.handleSubmitHN()}
                        edge='end'
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={70}
                />
              </FormControl>
            </Paper>
          </Grid>
        </Grid>
        <Routes />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(actions, dispatch);

export default withReducer('MainMenu', reducers)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(MainMenu))
);
