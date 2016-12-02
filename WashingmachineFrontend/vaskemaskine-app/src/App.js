import React from 'react';
import './App.css';
import Header from './components/Header/Header'
import UsageContainer from './containers/UsageContainer';
import Sidebar from './components/Sidebar/Sidebar'

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Header/>
                <Sidebar>
                    <UsageContainer />
                </Sidebar>
                {this.props.children}
            </div>
        )
    }
}


export default App;




// TODO nuværende release
// brug navn og lejlighed til visning af reservationer + det navn der står i toppen
// csv fil med reservatoner - kasser "panel" i sidebar - omstruktuer det hele
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
