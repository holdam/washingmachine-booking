import React from 'react';
import logo from './logo.svg';
import './App.css';
import CalendarAndUsage from './CalendarAndUsage/CalendarAndUsage';
import strings from './strings'
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
import {createStore} from 'redux';
import washingMachineApp from './reducers';
import {createBooking} from './actions';

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
        console.log(store.getState());

        let unsub = store.subscribe(() =>
            console.log(store.getState())
        );

        store.dispatch(createBooking(0, 100, 'me'));
        store.dispatch(createBooking(0, 105, 'me'));
        store.dispatch(createBooking(0, 105, 'me'));
        store.dispatch(createBooking(32, 123, 'mre'));

        unsub();

        return (
            <Router history={browserHistory}>
                <Route path="/" component={Header}>
                    <IndexRoute component={CalendarAndUsage} />
                    <Route path="/booking/:year/:month" component={CalendarAndUsage} />
                </Route>
            </Router>
        )
    }
}


export default App;

// TODO når der klikkes på dag skal der åbnes mulighed for booking
// mulighed for at vælge hvor mange vask
// slet booking / rediger

// TODO hent bookings evt. fake med json array til at starte med
// TODO evt. farv lørdag/søndag i en anden farve
// TODO vis forbrug evt. for forskellige længder af perioder?
// TODO admin/kasser panel
// TODO lav bruger / login evt bare i i topbar
// login vil være at gemme noge ti local storage el lign som kan sendes
// TODO reminder - spørg om de vil have når man booker, evt. default vlrdu i profil
// TODO https
// TODO can prob remove my own representations of dates lol
// TODO teting0