import core.User;
import db.UserDAO;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import resources.UserResource;
import static org.junit.Assert.*;


import javax.naming.AuthenticationException;

public class UserResourceTest {
    UserResource userResource;
    UserDAO userDAO;

    @Before
    public void setup() {
        userDAO = Mockito.mock(UserDAO.class);
        userResource = new UserResource(userDAO);
    }

    @Test(expected = AuthenticationException.class)
    public void passwordCannotBeEmpty() throws AuthenticationException {
        userResource.createUser("user", "");
    }

    @Test(expected = AuthenticationException.class)
    public void usernameCannotBeEmpty() throws AuthenticationException {
        userResource.createUser("", "password");
    }

    @Test
    public void shouldBeAbleToCreateUser() throws AuthenticationException {
        User user = userResource.createUser("username", "password");
        assertEquals("username", user.getName());
    }
}
