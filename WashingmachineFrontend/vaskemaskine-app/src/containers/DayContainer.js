import {connect} from 'react-redux';
import Day from '../components/CalendarAndUsage/Calendar/Day/Day';
import {startBookingFlow} from '../state/actions/bookingFlow';
import {startEditBookingFlow} from '../state/actions/editBookingFlow';

const mapStateToProps = (state) => {
    return {
        bookings: state.bookings.bookings,
        username: state.login.username
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onClick: (date) => {
            dispatch(startBookingFlow(date))
        },
        onBookingClick: (id, owner, startTime, endTime, numberOfWashingMachineUses, numberOfTumbleDryUses, date) => {
            dispatch(startEditBookingFlow(id, owner, startTime, endTime, numberOfWashingMachineUses, numberOfTumbleDryUses, date));
        }
    }
};

const DayContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Day);

export default DayContainer;