package api;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UsageDTO {
    public final static String WASHING_MACHINE = "WASHING_MACHINE";
    public final static String TUMBLE_DRIER = "TUMBLE_DRIER";

    private String type;
    private int count;
    private String username;

    public UsageDTO(String type, int count, String username) {
        this.type = type;
        this.count = count;
        this.username = username;
    }

    @JsonProperty
    public String getType() {
        return type;
    }

    @JsonProperty
    public String getUsername() {
        return username;
    }

    @JsonProperty
    public int getCount() {
        return count;
    }
}
