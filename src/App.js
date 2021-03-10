import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import store from './store/configureStore';
import theme from './theme/theme';

import Header from './components/Header';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <div>Next: Stub out components</div>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
