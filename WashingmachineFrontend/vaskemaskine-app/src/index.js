import 'babel-polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import {Provider} from 'react-redux';
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
import './index.css';
import getStore from './state/stores/store'
import CalendarContainer from './containers/CalendarViewContainer'

const store = getStore();

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={CalendarContainer}/>
                <Route path="/booking(/:year/:month)" component={CalendarContainer} />
            </Route>
        </Router>
    </Provider>,
  document.getElementById('root')
);