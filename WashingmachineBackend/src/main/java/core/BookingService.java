package core;

import api.BookingDTO;

import java.util.Date;

public interface BookingService {
    /**
     * Updates the booking in the database with the given {@id} with the given parameters if valid,
     * otherwise throws ValidationErrorException if illegal.
     * @param id
     * @param startDate
     * @param endDate
     * @param numberOfWashingMachineUses
     * @param numberOfTumbleDryUses
     * @param username
     * @return The updated booking
     */
    BookingDTO validateAndUpdateBooking(int id, Date startDate, Date endDate, int numberOfWashingMachineUses, int numberOfTumbleDryUses, String username);

    /**
     * Inserts booking if valid, otherwise throws ValidationErrorException. 
     * @param startDate
     * @param endDate
     * @param numberOfWashingMachineUses
     * @param numberOfTumbleDryUses
     * @param username
     * @return The newly created and inserted booking
     */
    BookingDTO validateAndCreateBooking(Date startDate, Date endDate, int numberOfWashingMachineUses, int numberOfTumbleDryUses, String username);
}
