import React from 'react';
import strings from '../../commons/strings';
import LoginContainer from '../../containers/LoginLogoutContainer';
import './Header.css';

class Header extends React.Component {
    render() {
        return (
            <div className="App">
                <header>
                    <LoginContainer />
                    <h2>{strings.frontpageTitle}</h2>
                </header>
                {this.props.children}
            </div>
        )
    }
}

export default Header;