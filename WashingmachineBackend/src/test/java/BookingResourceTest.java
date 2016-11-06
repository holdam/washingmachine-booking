import core.User;
import core.Util;
import db.BookingDAO;
import db.UserDAO;
import db.UserTokenDAO;
import exceptions.ValidationErrorException;
import org.junit.Before;
import org.junit.Test;
import resources.AuthResource;
import resources.BookingResource;

import javax.naming.AuthenticationException;
import java.util.Calendar;
import java.util.Date;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class BookingResourceTest {
    private BookingDAO bookingDAO;
    private BookingResource bookingResource;
    private Calendar calendar;

    @Before
    public void setup() {
        bookingDAO = mock(BookingDAO.class);
        bookingResource = new BookingResource(bookingDAO);
        calendar = Calendar.getInstance();
    }

    @Test(expected = ValidationErrorException.class)
    public void shouldNotBeAbleToStartBookingBefore8() {
        calendar.set(Calendar.HOUR_OF_DAY, 7);
        calendar.set(Calendar.MINUTE, 59);
        long startTime = calendar.getTime().getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 10);
        long endTime = calendar.getTime().getTime();
        bookingResource.createBooking(null, startTime, endTime);
    }

    @Test(expected = ValidationErrorException.class)
    public void shouldNotBeAbleToStartBookingAfter22() {
        calendar.set(Calendar.HOUR_OF_DAY, 22);
        calendar.set(Calendar.MINUTE, 1);
        long startTime = calendar.getTime().getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 9);
        calendar.add(Calendar.DAY_OF_YEAR, 1);
        long endTime = calendar.getTime().getTime();
        bookingResource.createBooking(null, startTime, endTime);
    }

    @Test(expected = ValidationErrorException.class)
    public void shouldNotBeAbleToEndBookingAfter22() {
        calendar.set(Calendar.HOUR_OF_DAY, 8);
        long startTime = calendar.getTime().getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 22);
        calendar.set(Calendar.MINUTE, 1);
        long endTime = calendar.getTime().getTime();
        bookingResource.createBooking(null, startTime, endTime);
    }

    @Test(expected = ValidationErrorException.class)
    public void shouldNotBeAbleToEndBookingAfter22ButBefore8() {
        calendar.set(Calendar.HOUR_OF_DAY, 8);
        long startTime = calendar.getTime().getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 6);
        calendar.set(Calendar.MINUTE, 0);
        calendar.add(Calendar.DAY_OF_YEAR, 1);
        long endTime = calendar.getTime().getTime();
        bookingResource.createBooking(null, startTime, endTime);
    }

    @Test(expected = ValidationErrorException.class)
    public void shouldNotBeAbleToBookBackInTime() {
        bookingResource.createBooking(null, new Date(0).getTime(), new Date().getTime());
    }

    @Test(expected = ValidationErrorException.class)
    public void shouldNotBeAbleToHaveStartTimeBeforeEndTime() {
        long startTime = calendar.getTime().getTime();
        calendar.add(Calendar.HOUR_OF_DAY, -1);
        long endTime = calendar.getTime().getTime();
        bookingResource.createBooking(null, startTime, endTime);
    }

    @Test(expected = ValidationErrorException.class)
    public void shouldNotBeAbleToBookLessThanThirtyMinutes() {
        calendar.set(Calendar.HOUR_OF_DAY, 10);
        calendar.set(Calendar.MINUTE, 0);
        long startTime = calendar.getTime().getTime();
        calendar.add(Calendar.MINUTE, 10);
        long endTime = calendar.getTime().getTime();
        bookingResource.createBooking(null, startTime, endTime);
    }

    @Test
    public void shouldNotBeAbleToBookWithoutAnyWashesOrTumbleDries() {}

    @Test
    public void shouldNotBeAbleToBookWithClashingBookings() {

    }
}
