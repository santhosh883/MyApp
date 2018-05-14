require('url-polyfill');
require('../utils/moment.js');

import React from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import Immutable from 'immutable';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { grey200 } from 'material-ui/styles/colors';

import Alt from '../utils/alt.js';
import Theme from '../utils/theme.js';
import ModelListing from './ModelListing.jsx';

const AppContainer = () => {
  return (
    <MuiThemeProvider muiTheme={getMuiTheme(Theme, { userAgent: navigator.userAgent })}>
      <div style={{ height: '100%', margin: 'auto' }}>
        <ModelListing />
      </div>
    </MuiThemeProvider>
  );
};

export default AppContainer;
