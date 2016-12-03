import Sidebar from "../components/Sidebar/Sidebar";
import {connect} from 'react-redux';
import {fetchUsage} from '../state/actions/usage';
import {isAdmin} from '../commons/util';

const mapStateToProps = (state) => {
    return {
        usage: state.usage.usage,
        isAdmin: isAdmin(state.login.role)
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUsage: (startDateToFetchFor, endDateToFetchFor) => {
            dispatch(fetchUsage(startDateToFetchFor, endDateToFetchFor));
        }
    }
};

const SidebarContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Sidebar);

export default SidebarContainer;