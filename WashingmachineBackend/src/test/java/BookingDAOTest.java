import api.BookingDTO;
import core.RoleHelper;
import db.BookingDAO;
import db.UserDAO;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.skife.jdbi.v2.DBI;
import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class BookingDAOTest {
    BookingDAO bookingDAO;
    UserDAO userDAO;

    @Before
    public void setup() {
        DBI dbi = new DBI("jdbc:postgresql://localhost:5433/test", "postgres", "root");
        bookingDAO = dbi.onDemand(BookingDAO.class);
        userDAO = dbi.onDemand(UserDAO.class);
        userDAO.createRoleTable();
        userDAO.createUsersTable();
        bookingDAO.createBookingTable();
        userDAO.insertUser("user", "password_that_should_have_been_hashed_and_salted", "bogus", RoleHelper.ROLE_DEFAULT);
        userDAO.insertUser("user2", "password_that_should_have_been_hashed_and_salted", "bogus", RoleHelper.ROLE_DEFAULT);
    }

    @After
    public void tearDown() throws InterruptedException {
        bookingDAO.truncateTable();
        userDAO.truncateUsersTable();
    }

    @Test
    public void shouldBeAbleToFindBookingAfterItsInsertion() {
        Date startTime = new Date();
        Date endTime = new Date();
        BookingDTO bookingDTO = new BookingDTO(-1, startTime, endTime, "user", 1, 1);
        bookingDAO.insertBooking(bookingDTO);
        bookingDTO = bookingDAO.getBookingFromOwnerAndDates("user", startTime, endTime);
        assertEquals("user", bookingDTO.getOwner());
    }

    @Test
    public void shouldBeAbleToFindBookingsInInterval() {
        // Create two bookings with different start end points
        Date startDate1, endDate1, startDate2, endDate2, searchDateStart, searchDateEnd;
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 10);
        startDate1 = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 11);
        endDate1 = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 12);
        startDate2 = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 13);
        endDate2 = calendar.getTime();

        bookingDAO.insertBooking(new BookingDTO(-1, startDate1, endDate1, "user", 0, 1));
        bookingDAO.insertBooking(new BookingDTO(-1, startDate2, endDate2, "user2", 0, 1));

        calendar.set(Calendar.HOUR_OF_DAY, 9);
        searchDateStart = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 14);
        searchDateEnd = calendar.getTime();

        List<BookingDTO> bookings = bookingDAO.getBookingsInInterval(searchDateStart, searchDateEnd);
        assertEquals(2, bookings.size());
        assertEquals(endDate1, bookings.get(0).getEndTime());
        assertEquals("user", bookings.get(0).getOwner());
    }

    @Test
    public void shouldBeAbleToUpdateBooking() {
        Date startTime = new Date();
        Date endTime = new Date();
        bookingDAO.insertBooking(new BookingDTO(-1, startTime, endTime, "user", 1, 0));
        BookingDTO bookingDTO = bookingDAO.getBookingFromOwnerAndDates("user", startTime, endTime);

        Date newStartDate = new Date(0);
        Date newEndDate = new Date();
        int bookingID = bookingDTO.getId();
        bookingDAO.updateBooking("user", bookingID, newStartDate, newEndDate, 321, 123);
        // Implicitly tests that that dates are updated
        bookingDTO = bookingDAO.getBookingFromOwnerAndDates("user", newStartDate, newEndDate);

        assertEquals("Should not create new row", bookingID, bookingDTO.getId());
        assertEquals("user", bookingDTO.getOwner());
        assertEquals(321, bookingDTO.getNumberOfWashingMachineUses());
        assertEquals(123, bookingDTO.getNumberOfTumbleDryUses());
    }



    // Only be able to modify own (delete, update)
    // Get overlapping virker
    // getBookingFromOwnerAndDates virker
}
