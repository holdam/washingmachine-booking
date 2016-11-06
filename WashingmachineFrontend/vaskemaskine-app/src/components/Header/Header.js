import React from 'react';
import strings from '../../strings';
import Login from './Login/Login';

class Header extends React.Component {
    render() {
        return (
            <div className="App">
                <header>
                    <Login/>
                    <h2>{strings.frontpageTitle}</h2>
                </header>
                {this.props.children}
            </div>
        )
    }
}

export default Header;