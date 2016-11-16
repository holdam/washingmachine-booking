import {connect} from 'react-redux';
import GlobalErrorMessage from '../components/Header/GlobalErrorMessage/GlobalErrorMessage';

const mapStateToProps = (state) => {
    return {
        errorMessage: state.globalErrorMessages.errorMessage
    }
};

const GlobalErrorMessagesContainer = connect(
    mapStateToProps
)(GlobalErrorMessage);

export default GlobalErrorMessagesContainer;