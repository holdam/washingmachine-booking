package core;

public interface BookingService {
    boolean validateEditBooking(long startTime, long endTime, int numberOfWashingMachineUses, int numberOfTumbleDryUses, int id);

    boolean validateCreateBooking(long startTime, long endTime, int numberOfWashingMachineUses, int numberOfTumbleDryUses);
}
