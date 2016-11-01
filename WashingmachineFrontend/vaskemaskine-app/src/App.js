import React from 'react';
import logo from './logo.svg';
import './App.css';
import CalendarAndUsageContainer from './containers/CalendarAndUsageContainer';
import strings from './strings'
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
import {createStore} from 'redux';
import washingMachineApp from './state/reducers/reducers';
import {Provider} from 'react-redux';

class Header extends React.Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>{strings.frontpageTitle}</h2>
                </div>
                {this.props.children}
            </div>
        )
    }
}

class App extends React.Component {
    render() {
        let store = createStore(washingMachineApp);
        return (
            <Provider store={store}>
                <Router history={browserHistory}>
                    <Route path="/" component={Header}>
                        <IndexRoute component={CalendarAndUsageContainer}/>
                        <Route path="/booking(/:year/:month)" component={CalendarAndUsageContainer} />
                    </Route>
                </Router>
            </Provider>
        )
    }
}


export default App;

// TODO hent bookings evt. fake med json array til at starte med
// TODO evt. farv lørdag/søndag i en anden farve
// TODO vis forbrug evt. for forskellige længder af perioder?

// TODO lav bruger / login evt bare i i topbar
// TODO admin/kasser panel
// login vil være at gemme noge ti local storage el lign som kan sendes
// TODO reminder - spørg om de vil have når man booker, evt. default vlrdu i profil
// TODO https
// TODO can prob remove my own representations of dates lol
// TODO teting0
