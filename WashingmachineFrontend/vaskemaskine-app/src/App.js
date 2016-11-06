import React from 'react';
import './App.css';
import CalendarAndUsageContainer from './containers/CalendarAndUsageContainer';
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import washingMachineApp from './state/reducers/reducers';
import {Provider} from 'react-redux';
import Header from './components/Header/Header'

class App extends React.Component {
    render() {
        const loggerMiddleware = createLogger();
        let store = createStore(washingMachineApp, applyMiddleware(thunkMiddleware, loggerMiddleware));
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


// TODO battleplan:
    // lav så vi kan sende requests mens man er logget ind
    // "createBooking"
    //
    // lav events "pæne" i kalenderen - egne skal være farvet en anden farve
    // gør så man kan oprette events færdig
    // gør så man kan redigere events
    //
// TODO hent bookings
// TODO evt. farv lørdag/søndag i en anden farve
// TODO vis forbrug evt. for forskellige længder af perioder?

// TODO lav bruger / login evt bare i i topbar
// TODO admin/kasser panel
// login vil være at gemme noge ti local storage el lign som kan sendes
// TODO reminder - spørg om de vil have når man booker, evt. default vlrdu i profil
// TODO https
// TODO teting + proptypes

// TODO may have problems with milliseconds if different timezone - kan måske bare bruge UTC til alting...