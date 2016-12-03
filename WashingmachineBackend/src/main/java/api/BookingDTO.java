package api;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class BookingDTO {
    private int id;
    private Date startTime;
    private Date endTime;
    private String owner;
    private String apartment;
    private String realName;
    private int numberOfTumbleDryUses;
    private int numberOfWashingMachineUses;

    public BookingDTO(Date startTime, Date endTime, String owner, int numberOfWashingMachineUses, int numberOfTumbleDryUses) {
        this(-1, startTime, endTime, owner, "", "", numberOfWashingMachineUses, numberOfTumbleDryUses);
    }

    public BookingDTO(int id, Date startTime, Date endTime, String owner, String apartment, String realName, int numberOfWashingMachineUses, int numberOfTumbleDryUses) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.owner = owner;
        this.apartment = apartment;
        this.realName = realName;
        this.numberOfTumbleDryUses = numberOfTumbleDryUses;
        this.numberOfWashingMachineUses = numberOfWashingMachineUses;
    }

    @JsonProperty
    public int getNumberOfTumbleDryUses() {
        return numberOfTumbleDryUses;
    }

    @JsonProperty
    public int getNumberOfWashingMachineUses() {
        return numberOfWashingMachineUses;
    }

    @JsonProperty
    public Date getStartTime() {
        return startTime;
    }

    @JsonProperty
    public Date getEndTime() {
        return endTime;
    }

    @JsonProperty
    public String getOwner() {
        return owner;
    }

    @JsonProperty
    public int getId() {
        return id;
    }

    public String getApartment() {
        return apartment;
    }

    public String getRealName() {
        return realName;
    }
}
