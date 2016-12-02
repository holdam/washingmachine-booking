import Usage from "../components/Sidebar/Usage/Usage";
import {connect} from 'react-redux';
import {fetchUsage} from '../state/actions/usage';

const mapStateToProps = (state) => {
    return {
        usage: state.usage.usage
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUsage: (startDateToFetchFor, endDateToFetchFor) => {
            dispatch(fetchUsage(startDateToFetchFor, endDateToFetchFor));
        }
    }
};

const UsageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Usage);

export default UsageContainer;