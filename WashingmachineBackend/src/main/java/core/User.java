package core;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.security.Principal;

public class User implements Principal {
    private String name;
    private int role;

    public User(String name, int role) {
        this.name = name;
        this.role = role;
    }

    @JsonProperty
    public String getName() {
        return name;
    }

    @JsonProperty
    public int getRole() {
        return role;
    }
}
