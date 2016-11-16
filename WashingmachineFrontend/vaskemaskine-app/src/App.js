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


// TODO kun kunne redigere egne events - lav fejlbesked hvis man prøver (modal ligennde ting)
// TODO skjul data der ikke er ens egne (?)
// TODO testing af backend hvor der er TODOS
// TODO evt. farv lørdag/søndag i en anden farve
// TODO crsf + xss (bare tjek det ikke virker?)
// TODO limit så man ikke kan bruge andet end hvert 5. minut (eller bare reducer til nærmeste 5. minut)
// TODO rename createmodal + flow
// TODO rev tabel til bookings
// TODO store til prod og dev
// lav events "pæne" i kalenderen - egne skal være farvet en anden farve

// TODO reminder - spørg om de vil have når man booker, evt. default vlrdu i profil
// TODO https
// TODO teting + proptypes

// TODO may have problems with milliseconds if different timezone - kan måske bare bruge UTC til alting...
// TODO might not want to let people delete in all cases....


// TODO admin/kasser panel/forbrug
// TODO vis forbrug evt. for forskellige længder af perioder?