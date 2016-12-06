import React from 'react';
import './App.css';
import Header from './components/Header/Header'
import Sidebar from './containers/SidebarContainer'

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Header/>
                <Sidebar />
                {this.props.children}
            </div>
        )
    }
}


export default App;




// TODO nuværende release
// find ud hvordan vi deployer fedest (ikke fordi det er nødvendigt, men fordi det er sjovt) - docker?
// gå ned til nuværende dag hvis i mobilview


// TODO EVT:
// reminder - spørg om de vil have når man booker, evt. default vlrdu i profil
// find ud af hvornår der skal slettes og kunne redigeres
// may have problems with milliseconds if different timezone - kan måske bare bruge UTC til alting...
// update password and that kind of shit
// avoid spam and probably better password creation (more restrict than just nonempty passwords)
// websockets til at hente ting live ?

// TODO når prod:
// https + safe cookie
