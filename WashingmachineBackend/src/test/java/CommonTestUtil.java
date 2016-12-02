import api.UserDTO;
import core.RoleHelper;

public class CommonTestUtil {
    private final static String USERNAME_DEFAULT = "user";
    private final static String APARTMENT_DEFAULT = "apartment";
    private final static String NAME_DEFAULT = "name";

    public final static UserDTO defaultUser = new UserDTO(USERNAME_DEFAULT, RoleHelper.ROLE_DEFAULT, NAME_DEFAULT, APARTMENT_DEFAULT);
}
