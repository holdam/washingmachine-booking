import React from 'react';
import './App.css';
import CalendarAndUsageContainer from './containers/CalendarAndUsageContainer';
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
import {Provider} from 'react-redux';
import Header from './components/Header/Header'
import getStore from './state/stores/store'

class App extends React.Component {
    render() {
        const store = getStore();
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




// TODO nuværende release
// brug navn og lejlighed til visning af reservationer + det navn der står i toppen
// csv fil med reservatoner
// erstat for loops

// TODO næste release
// landing apage
// admin/kasser panel



// TODO EVT:
// reminder - spørg om de vil have når man booker, evt. default vlrdu i profil
// find ud af hvornår der skal slettes og kunne redigeres
// may have problems with milliseconds if different timezone - kan måske bare bruge UTC til alting...
// update password and that kind of shit
// avoid spam and probably better password creation (more restrict than just nonempty passwords)
// websockets til at hente ting live ?

// TODO når prod:
// https + safe cookie
