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



// TODO final features i den her "release"
// ikke finger cursor når ikke logget ind (elt evt. lad den åbne lav bruger modal)
// rev tabel til bookings
// proptypes
// flash login mislykkedes
// websockets til at hente ting live ?
// få usage ned i bunden
// refetch bookings efter logge ind

// TODO næste release
// admin/kasser panel/forbrug
// vis forbrug evt. for forskellige længder af perioder?
// landing apage



// TODO EVT:
// reminder - spørg om de vil have når man booker, evt. default vlrdu i profil
// find ud af hvornår der skal slettes og kunne redigeres
// may have problems with milliseconds if different timezone - kan måske bare bruge UTC til alting...
// update password and that kind of shit
// avoid spam and probably better password creation (more restrict than just nonempty passwords)

// TODO når prod:
// https + safe cookie
