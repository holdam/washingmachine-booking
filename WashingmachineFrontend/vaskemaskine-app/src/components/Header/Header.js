import React from 'react';
import strings from '../../commons/strings';
import LoginContainer from '../../containers/LoginLogoutContainer';
import GlobalErrorMessagesContainer from '../../containers/GlobalErrorMessagesContainer';
import './Header.css';
import {Navbar, Nav} from 'react-bootstrap';

class Header extends React.Component {
    render() {
        return (
            <div className="App">
                <GlobalErrorMessagesContainer />
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            {strings.frontpageTitle}
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Nav>
                        <LoginContainer />
                    </Nav>
                </Navbar>
                {this.props.children}
            </div>
        )
    }
}
export default Header;