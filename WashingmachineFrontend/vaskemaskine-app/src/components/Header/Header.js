import React from 'react';
import strings from '../../commons/strings';
import LoginContainer from '../../containers/LoginLogoutContainer';
import './Header.css';
import {Navbar, Nav} from 'react-bootstrap';

class Header extends React.Component {
    render() {
        return (
            <div>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            {strings.frontpageTitle}
                        </Navbar.Brand>
                        <Navbar.Toggle />
                        <Nav>
                            <LoginContainer />
                        </Nav>
                    </Navbar.Header>
                </Navbar>
            </div>
        )
    }
}
export default Header;