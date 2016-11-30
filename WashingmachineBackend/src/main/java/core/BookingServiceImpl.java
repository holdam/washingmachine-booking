package core;

import api.BookingDTO;
import db.BookingDAO;
import exceptions.ValidationErrorException;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class BookingServiceImpl implements BookingService {
    private BookingDAO bookingDAO;

    public BookingServiceImpl(BookingDAO bookingDAO) {
        this.bookingDAO = bookingDAO;
    }

    @Override
    public boolean validateEditBooking(long startTime, long endTime, int numberOfWashingMachineUses, int numberOfTumbleDryUses, int id) {
        Date startDate = Util.convertMillisToDateAndFloorToNearest5Minutes(startTime);
        Date endDate = Util.convertMillisToDateAndFloorToNearest5Minutes(endTime);
        List<BookingDTO> overlappingBookingDTOs = bookingDAO.getBookingsOverlappingInterval(startDate, endDate);

        if (overlappingBookingDTOs.size() > 0 && overlappingBookingDTOs.get(0).getId() != id) {
            return false;
        }

        return commonValidationsForBooking(startTime, endTime, numberOfWashingMachineUses, numberOfTumbleDryUses);
    }

    @Override
    public boolean validateCreateBooking(long startTime, long endTime, int numberOfWashingMachineUses, int numberOfTumbleDryUses) {
        Date startDate = Util.convertMillisToDateAndFloorToNearest5Minutes(startTime);
        Date endDate = Util.convertMillisToDateAndFloorToNearest5Minutes(endTime);
        List<BookingDTO> overlappingBookingDTOs = bookingDAO.getBookingsOverlappingInterval(startDate, endDate);

        if (overlappingBookingDTOs.size() > 0 || startDate.before(new Date())) {
            return false;
        }

        return commonValidationsForBooking(startTime, endTime, numberOfWashingMachineUses, numberOfTumbleDryUses);
    }

    private boolean commonValidationsForBooking(long startTime, long endTime, int numberOfWashingMachineUses, int numberOfTumbleDryUses) throws ValidationErrorException {
        Date startDate = Util.convertMillisToDateAndFloorToNearest5Minutes(startTime);
        Date endDate = Util.convertMillisToDateAndFloorToNearest5Minutes(endTime);
        Calendar startDateCalendar = Calendar.getInstance();
        Calendar endDateCalendar = Calendar.getInstance();
        startDateCalendar.setTimeInMillis(startTime);
        endDateCalendar.setTimeInMillis(endTime);

        long timeDifference = endTime - startTime;
        boolean timeDifferenceGreaterThan30Minutes = (timeDifference / 1000 / 60) >= 30;

        if (startDate.after(endDate) ||
                (endDateCalendar.get(Calendar.HOUR_OF_DAY) < 8 || (endDateCalendar.get(Calendar.HOUR_OF_DAY) >= 22 && endDateCalendar.get(Calendar.MINUTE) > 0)) ||
                (startDateCalendar.get(Calendar.HOUR_OF_DAY) < 8 || (startDateCalendar.get(Calendar.HOUR_OF_DAY) >= 22 && startDateCalendar.get(Calendar.MINUTE) > 0)) ||
                !timeDifferenceGreaterThan30Minutes ||
                (numberOfTumbleDryUses <= 0 && numberOfWashingMachineUses <= 0)) {
            return false;
        }

        return true;
    }
}
