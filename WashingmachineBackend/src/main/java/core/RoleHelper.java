package core;


public class RoleHelper {
    public static final int ROLE_ADMIN = 0;
    public static final int ROLE_DEFAULT = 1;

    public static boolean isAdmin(int role) {
        return role == ROLE_ADMIN;
    }

}
