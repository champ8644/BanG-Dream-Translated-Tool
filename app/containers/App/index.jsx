'use strict';

import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles
} from '@material-ui/core/styles';
import React, { Component } from 'react';
import { copyJsonFileToSettings, freshInstall } from '../Settings/actions';
import { styles, theme } from './styles';

import Alerts from '../Alerts';
import CssBaseline from '@material-ui/core/CssBaseline';
import ErrorBoundary from '../ErrorBoundary';
import { IS_PROD } from '../../constants/env';
import Routes from '../../routing';
import SettingsDialog from '../Settings';
import Titlebar from './components/Titlebar';
import { bindActionCreators } from 'redux';
import { bootLoader } from '../../utils/bootHelper';
import { connect } from 'react-redux';
// import { logEvent } from '../../utils/analyticsHelper';
import { isConnected } from '../../utils/isOnline';
import { log } from '@Log';
import reducers from './reducers';
import { settingsStorage } from '../../utils/storageHelper';
import { withReducer } from '../../store/reducers/withReducer';

const appTheme = createMuiTheme(theme());

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.allowWritingJsonToSettings = false;
  }

  componentDidMount() {
    this.componentWillMounting();
    try {
      bootLoader.cleanRotationFiles();
    } catch (e) {
      log.error(e, `App -> componentDidMount`);
    }
  }

  async componentWillMounting() {
    try {
      this.setFreshInstall();
      if (this.allowWritingJsonToSettings) {
        this.writeJsonToSettings();
      }

      this.runAnalytics();
    } catch (e) {
      log.error(e, `App -> componentWillMounting`);
    }
  }

  setFreshInstall() {
    try {
      const { _freshInstall } = this.props;
      const isFreshInstallSettings = settingsStorage.getItems(['freshInstall']);
      let isFreshInstall = 0;

      switch (isFreshInstallSettings.freshInstall) {
        case undefined:
        case null:
          // app was just installed
          isFreshInstall = 1;
          break;
        case 1:
          // second boot after installation
          isFreshInstall = 0;
          break;
        case -1:
          // isFreshInstall was reset
          isFreshInstall = 1;
          break;
        case 0:
        default:
          // more than 2 boot ups have occured
          isFreshInstall = 0;
          this.allowWritingJsonToSettings = true;
          return null;
      }

      _freshInstall({ isFreshInstall });
    } catch (e) {
      log.error(e, `App -> setFreshInstall`);
    }
  }

  writeJsonToSettings() {
    try {
      const { _copyJsonFileToSettings } = this.props;
      const settingsFromStorage = settingsStorage.getAll();
      _copyJsonFileToSettings({ ...settingsFromStorage });
    } catch (e) {
      log.error(e, `App -> writeJsonToSettings`);
    }
  }

  runAnalytics() {
    const isAnalyticsEnabledSettings = settingsStorage.getItems([
      'enableAnalytics'
    ]);
    try {
      if (isAnalyticsEnabledSettings.enableAnalytics && IS_PROD) {
        isConnected()
          .then(connected => {
            // logEvent('screenview', { cd: '/Home' });
            // logEvent(`pageview`, { dp: '/Home' });

            return connected;
          })
          .catch(() => {});
      }
    } catch (e) {
      log.error(e, `App -> runAnalytics`);
    }
  }

  render() {
    const { classes: styles } = this.props;
    return (
      <div className={styles.root}>
        <CssBaseline>
          <MuiThemeProvider theme={appTheme}>
            <Titlebar />
            <Alerts />
            <ErrorBoundary>
              <SettingsDialog />
              <Routes />
            </ErrorBoundary>
          </MuiThemeProvider>
        </CssBaseline>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators(
    {
      _copyJsonFileToSettings: ({ ...data }) => (_, getState) => {
        dispatch(copyJsonFileToSettings({ ...data }));
      },

      _freshInstall: ({ ...data }) => (_, getState) => {
        dispatch(freshInstall({ ...data }, getState));
      }
    },
    dispatch
  );

const mapStateToProps = (state, props) => {
  return {};
};

export default withReducer('App', reducers)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(App))
);
