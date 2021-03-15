import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PublicRoute from './routers/PublicRoute';
import PrivateRoute from './routers/PrivateRoute';

import store from './store/configureStore';
import theme from './theme/theme';

import Header from './components/Header';
import Landing from './components/Landing';
import Dashbourd from './components/Dashboard';
import Project from './components/Project';
import NotFound from './components/NotFound';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Header />
          <Switch>
            <PublicRoute exact path="/" component={Landing} />
            <PrivateRoute exact path="/dashboard" component={Dashbourd} />
            <PrivateRoute path="/project/:id" component={Project} />
            <Route path="*" component={NotFound} />
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
