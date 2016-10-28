package core;

import java.security.Principal;

public class User implements Principal {
    private String name;
    private int role;

    public User(String name, int role) {
        this.name = name;
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public int getRole() {
        return role;
    }
}
