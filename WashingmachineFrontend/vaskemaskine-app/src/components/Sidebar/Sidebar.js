import React from 'react';
import './Sidebar.css'
import Usage from './Usage/Usage'
import Admin from './Admin/Admin'

class Sidebar extends React.Component {
    render() {
        return (
            <div className="sidebar">
                <Usage
                    usage={this.props.usage}
                    fetchUsage={this.props.fetchUsage}
                />
                {(this.props.isAdmin) ? <Admin/> : null}
            </div>
        )
    }
}

export default Sidebar;