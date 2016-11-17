import api.BookingDTO;
import core.RoleHelper;
import db.BookingDAO;
import db.UserDAO;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.skife.jdbi.v2.DBI;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class BookingDAOTest {
    private BookingDAO bookingDAO;
    private UserDAO userDAO;
    private final String USERNAME_1 = "user";
    private final String USERNAME_2 = "user2";

    @Before
    public void setup() {
        DBI dbi = new DBI("jdbc:postgresql://localhost:5433/test", "postgres", "root");
        bookingDAO = dbi.onDemand(BookingDAO.class);
        userDAO = dbi.onDemand(UserDAO.class);
        userDAO.createRoleTable();
        userDAO.createUsersTable();
        bookingDAO.createBookingTable();
        userDAO.insertUser(USERNAME_1, "password_that_should_have_been_hashed_and_salted", "bogus", RoleHelper.ROLE_DEFAULT);
        userDAO.insertUser(USERNAME_2, "password_that_should_have_been_hashed_and_salted", "bogus", RoleHelper.ROLE_DEFAULT);
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
        BookingDTO bookingDTO = new BookingDTO(-1, startTime, endTime, USERNAME_1, 1, 1);
        bookingDAO.insertBooking(bookingDTO);
        bookingDTO = bookingDAO.getBookingFromOwnerAndDates(USERNAME_1, startTime, endTime);
        assertEquals(USERNAME_1, bookingDTO.getOwner());
    }

    @Test
    public void shouldBeAbleToFindBookingsInInterval() {
        // Create two bookings with different start end points
        Date startDate1, endDate1, startDate2, endDate2, searchDateStart, searchDateEnd;
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        calendar.set(Calendar.HOUR_OF_DAY, 10);
        startDate1 = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 11);
        endDate1 = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 12);
        startDate2 = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 13);
        endDate2 = calendar.getTime();

        bookingDAO.insertBooking(new BookingDTO(-1, startDate1, endDate1, USERNAME_1, 0, 1));
        bookingDAO.insertBooking(new BookingDTO(-1, startDate2, endDate2, USERNAME_2, 0, 1));

        calendar.set(Calendar.HOUR_OF_DAY, 9);
        searchDateStart = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 14);
        searchDateEnd = calendar.getTime();

        List<BookingDTO> bookings = bookingDAO.getBookingsInInterval(searchDateStart, searchDateEnd, "");
        assertEquals(2, bookings.size());
        assertEquals(endDate1, bookings.get(0).getEndTime());
        assertEquals(USERNAME_1, bookings.get(0).getOwner());
    }

    @Test
    public void shouldBeAbleToUpdateBooking() {
        Date startTime = new Date();
        Date endTime = new Date();
        bookingDAO.insertBooking(new BookingDTO(-1, startTime, endTime, USERNAME_1, 1, 0));
        BookingDTO bookingDTO = bookingDAO.getBookingFromOwnerAndDates(USERNAME_1, startTime, endTime);

        Date newStartDate = new Date(0);
        Date newEndDate = new Date();
        int bookingID = bookingDTO.getId();
        bookingDAO.updateBooking(USERNAME_1, bookingID, newStartDate, newEndDate, 321, 123);
        // Implicitly tests that that dates are updated
        bookingDTO = bookingDAO.getBookingFromOwnerAndDates(USERNAME_1, newStartDate, newEndDate);

        assertEquals("Should not create new row", bookingID, bookingDTO.getId());
        assertEquals(USERNAME_1, bookingDTO.getOwner());
        assertEquals(321, bookingDTO.getNumberOfWashingMachineUses());
        assertEquals(123, bookingDTO.getNumberOfTumbleDryUses());
    }

    @Test
    public void shouldOnlyBeAbleToUpdateAndDeleteOwnBookings() {
        Date startTime = new Date();
        Date endTime = new Date();
        BookingDTO bookingDTO = new BookingDTO(-1, startTime, endTime, USERNAME_2, 1, 1);
        bookingDAO.insertBooking(bookingDTO);
        BookingDTO insertedBooking = bookingDAO.getBookingFromOwnerAndDates(USERNAME_2, startTime, endTime);
        int numberOfAffectedRows = bookingDAO.updateBooking(USERNAME_1, insertedBooking.getId(), new Date(), new Date(), 1, 2);
        assertEquals(0, numberOfAffectedRows);

        numberOfAffectedRows = bookingDAO.deleteBooking(USERNAME_1, insertedBooking.getId());
        assertEquals(0, numberOfAffectedRows);
    }

    @Test
    public void shouldBeAbleToDeleteOwnBookings() {
        Date startTime = new Date();
        Date endTime = new Date();
        BookingDTO bookingDTO = new BookingDTO(-1, startTime, endTime, USERNAME_1, 1, 1);
        bookingDAO.insertBooking(bookingDTO);
        BookingDTO insertedBooking = bookingDAO.getBookingFromOwnerAndDates(USERNAME_1, startTime, endTime);
        int numberOfAffectedRows = bookingDAO.deleteBooking(USERNAME_1, insertedBooking.getId());
        assertEquals(1, numberOfAffectedRows);
    }

    @Test
    public void getBookingsOverlappingIntervalShouldWork() {
        // Create two bookings with different start end points
        Date startDate1, endDate1, startDate2, endDate2, startDate3, endDate3, searchDateStart, searchDateEnd;
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 10);
        calendar.set(Calendar.MINUTE, 0);
        startDate1 = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 11);
        endDate1 = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 12);
        startDate2 = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 13);
        endDate2 = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 15);
        startDate3 = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 18);
        endDate3 = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 10);
        calendar.set(Calendar.MINUTE, 10);
        searchDateStart = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 12);
        searchDateEnd = calendar.getTime();

        bookingDAO.insertBooking(new BookingDTO(-1, startDate1, endDate1, USERNAME_1, 1, 2));
        bookingDAO.insertBooking(new BookingDTO(-1, startDate2, endDate2, USERNAME_2, 2, 2));
        bookingDAO.insertBooking(new BookingDTO(-1, startDate3, endDate3, USERNAME_1, 3, 2));

        // Could probably look at values of the returned values here, but meh
        List<BookingDTO> bookings = bookingDAO.getBookingsOverlappingInterval(searchDateStart, searchDateEnd);
        assertEquals(2, bookings.size());
    }

    @Test
    public void getBookingFromIdShouldWork() {
        Date startTime = new Date();
        Date endTime = new Date();
        BookingDTO bookingDTO = new BookingDTO(-1, startTime, endTime, USERNAME_1, 1, 1);
        bookingDAO.insertBooking(bookingDTO);
        bookingDTO = bookingDAO.getBookingFromOwnerAndDates(USERNAME_1, startTime, endTime);

        BookingDTO bookingDTOToTest = bookingDAO.getBookingFromId(USERNAME_2, bookingDTO.getId());
        assertEquals(null, bookingDTOToTest);
        bookingDTOToTest = bookingDAO.getBookingFromId(USERNAME_1, bookingDTO.getId());
        assertEquals(bookingDTOToTest.getOwner(), USERNAME_1);
    }
}
