package resources;

import api.BookingDTO;
import core.User;
import core.Util;
import db.BookingDAO;
import exceptions.ValidationErrorException;
import io.dropwizard.auth.Auth;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Path("/booking")
@Produces(MediaType.APPLICATION_JSON)
public class BookingResource {
    private BookingDAO bookingDAO;

    public BookingResource(BookingDAO bookingDAO) {
        this.bookingDAO = bookingDAO;
    }

    @POST
    public BookingDTO createBooking(@Auth User user,
                                    @FormParam("startTime") @NotNull @Min(0) Long startTime,
                                    @FormParam("endTime") @NotNull @Min(0) Long endTime,
                                    @FormParam("numberOfWashingMachineUses") @NotNull int numberOfWashingMachineUses,
                                    @FormParam("numberOfTumbleDryUses") @NotNull int numberOfTumbleDryUses) {
        validateBookingCreation(startTime, endTime, numberOfWashingMachineUses, numberOfTumbleDryUses);
        Date startDate = Util.convertMillisToDateAndFloorToNearest5Minutes(startTime);
        Date endDate = Util.convertMillisToDateAndFloorToNearest5Minutes(endTime);
        // -1 for now, we will get correct id after insertion
        BookingDTO bookingDTOForInsertion = new BookingDTO(-1, startDate, endDate,
                user.getName(), numberOfTumbleDryUses, numberOfWashingMachineUses);
        bookingDAO.insertBooking(bookingDTOForInsertion);
        return bookingDAO.getBookingFromOwnerAndDates(user.getName(), startDate, endDate);
    }

    @PUT
    public BookingDTO editBooking(@Auth User user, @FormParam("id") int id,
                                  @FormParam("startTime") @NotNull @Min(0) Long startTime,
                                  @FormParam("endTime") @NotNull @Min(0) Long endTime,
                                  @FormParam("numberOfWashingMachineUses") @NotNull int numberOfWashingMachineUses,
                                  @FormParam("numberOfTumbleDryUses") @NotNull int numberOfTumbleDryUses) {
        validateBookingEdit(startTime, endTime, numberOfWashingMachineUses, numberOfTumbleDryUses, id);
        bookingDAO.updateBooking(user.getName(), id, Util.convertMillisToDateAndFloorToNearest5Minutes(startTime),
                Util.convertMillisToDateAndFloorToNearest5Minutes(endTime), numberOfWashingMachineUses, numberOfTumbleDryUses);
        return bookingDAO.getBookingFromId(user.getName(), id);
    }

    @GET
    @Path("/interval")
    public List<BookingDTO> getBookingsInInterval(@QueryParam("startTime") @NotNull @Min(0) Long startTime,
                                                  @QueryParam("endTime") @NotNull @Min(0) Long endTime) {
        return bookingDAO.getBookingsInInterval(Util.convertMillisToDateAndFloorToNearest5Minutes(startTime), Util.convertMillisToDateAndFloorToNearest5Minutes(endTime));
    }

    @DELETE
    public void deleteBooking(@Auth User user, @FormParam("id") @NotNull int id) {
        bookingDAO.deleteBooking(user.getName(), id);
    }

    private void validateBookingEdit(long startTime, long endTime, int numberOfWashingMachineUses, int numberOfTumbleDryUses, int id) {
        Date startDate = Util.convertMillisToDateAndFloorToNearest5Minutes(startTime);
        Date endDate = Util.convertMillisToDateAndFloorToNearest5Minutes(endTime);
        List<BookingDTO> overlappingBookingDTOs = bookingDAO.getBookingsOverlappingInterval(startDate, endDate);

        if (overlappingBookingDTOs.size() > 0 && overlappingBookingDTOs.get(0).getId() != id) {
            throw new ValidationErrorException();
        }

        commonValidationsForBooking(startTime, endTime, numberOfWashingMachineUses, numberOfTumbleDryUses);
    }

    private void validateBookingCreation(long startTime, long endTime, int numberOfWashingMachineUses, int numberOfTumbleDryUses) {
        Date startDate = Util.convertMillisToDateAndFloorToNearest5Minutes(startTime);
        Date endDate = Util.convertMillisToDateAndFloorToNearest5Minutes(endTime);
        List<BookingDTO> overlappingBookingDTOs = bookingDAO.getBookingsOverlappingInterval(startDate, endDate);

        if (overlappingBookingDTOs.size() > 0 ) {
            throw new ValidationErrorException();
        }

        commonValidationsForBooking(startTime, endTime, numberOfWashingMachineUses, numberOfTumbleDryUses);
    }

    private void commonValidationsForBooking(long startTime, long endTime, int numberOfWashingMachineUses, int numberOfTumbleDryUses) throws ValidationErrorException {
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
                startDate.before(new Date()) ||
                !timeDifferenceGreaterThan30Minutes ||
                (numberOfTumbleDryUses <= 0 && numberOfWashingMachineUses <= 0)) {
            throw new ValidationErrorException();
        }
    }
}
