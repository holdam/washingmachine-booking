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
// width of calendar? (for some reason seven equal rows whatever is not working)
// find ud hvordan vi deployer fedest (ikke fordi det er nødvendigt, men fordi det er sjovt) - docker?
// new icon
// gå ned til nuværende dag hvis i mobilview
// help function til end of month sart of month days given month


// TODO når domæne
// https + safe cookie

// TODO EVT:
// reminder - spørg om de vil have når man booker, evt. default vlrdu i profil
// find ud af hvornår der skal slettes og kunne redigeres
// IMPORTANT: may have problems with milliseconds if different timezone - kan måske bare bruge UTC til alting...
// update password and that kind of shit
// avoid spam and probably better password creation (more restrict than just nonempty passwords)
// websockets til at hente ting live ?


// HOW TO BUILD SHOULD BE AUTOMATED

// SSH to server
// Update repo on server
// Build backend JAR:
//   mvn package -DskipTests,
//   shutdown old server (e.g. using kill PID),
//   then run it: nohup java -jar target/{"NAME OF THE JAR FILE BUILT"} server configuration-prod.yaml &
// Build frontend:
//   npm install,
//   npm run build,
//   rm -r /data/www/*
//   mv build/* /data/www/

// TODO ret brugeren til så vi bruger ordentligt kode til prod

