package api;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.security.Principal;

public class UserDTO implements Principal {
    private String username;
    private int role;
    private String realName;
    private String apartment;

    public UserDTO(String username, int role, String realName, String apartment) {
        this.username = username;
        this.role = role;
        this.realName = realName;
        this.apartment = apartment;
    }

    @JsonProperty
    public String getRealName() {
        return realName;
    }

    @JsonProperty
    public String getApartment() {
        return apartment;
    }

    @JsonProperty
    public String getName() {
        return username;
    }

    @JsonProperty
    public int getRole() {
        return role;
    }
}
