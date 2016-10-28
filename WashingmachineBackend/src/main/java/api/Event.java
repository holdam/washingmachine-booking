package api;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class Event {
    private Date startTime;
    private Date endTime;
    private String owner;

    public Event(Date startTime, Date endTime, String owner) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.owner = owner;
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
}
