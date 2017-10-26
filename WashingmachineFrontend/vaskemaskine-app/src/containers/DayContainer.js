import {connect} from 'react-redux';
import Day from '../components/Views/CalendarView/Calendar/Day/Day';
import {startCreateBookingFlow} from '../state/actions/createBookingFlow';
import {startEditBookingFlow} from '../state/actions/editBookingFlow';

const mapStateToProps = (state) => ({
    bookings: state.bookings.bookings,
    username: state.login.username,
    isLoggedIn: !!state.login.username
});

const mapDispatchToProps = (dispatch) => ({
    onClick: (date) => {
        dispatch(startCreateBookingFlow(date))
    },
    onBookingClick: (id, owner, startTime, endTime, numberOfWashingMachineUses, numberOfTumbleDryUses, date) => {
        dispatch(startEditBookingFlow(id, owner, startTime, endTime, numberOfWashingMachineUses, numberOfTumbleDryUses, date));
    }
});

const DayContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Day);

export default DayContainer;
