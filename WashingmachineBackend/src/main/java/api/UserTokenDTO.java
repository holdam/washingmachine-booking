package api;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class UserTokenDTO {
    private Date lifetimeEnds;
    private Status status;
    private String username;
    private String token;

    public enum Status {
        VALID,
        INVALID;

        public static Status getValueFromString(String status) {
            switch (status) {
                case "VALID":
                    return VALID;
                case "INVALID":
                    return INVALID;
            }
            return null;
        }
    }

    public UserTokenDTO(String username, String token, Date lifetimeEnds, Status status) {
        this.username = username;
        this.token = token;
        this.lifetimeEnds = lifetimeEnds;
        this.status = status;
    }


    @JsonProperty
    public String getUsername() {
        return username;
    }

    @JsonProperty
    public String getToken() {
        return token;
    }

    @JsonProperty
    public Date getLifetimeEnds() {
        return lifetimeEnds;
    }

    @JsonProperty
    public Status getStatus() {
        return status;
    }
}


