import api.SuccessDTO;
import core.RoleHelper;
import core.User;
import db.UserDAO;
import db.UserTokenDAO;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import resources.UserResource;
import static org.junit.Assert.*;
import static org.mockito.Mockito.when;


import javax.naming.AuthenticationException;
import javax.ws.rs.core.Cookie;

public class UserResourceTest {
    UserResource userResource;
    UserDAO userDAO;
    UserTokenDAO userTokenDAO;

    @Before
    public void setup() {
        userDAO = Mockito.mock(UserDAO.class);
        userTokenDAO = Mockito.mock(UserTokenDAO.class);
        userResource = new UserResource(userDAO, userTokenDAO);
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

    @Test
    public void doesUsernameExistAlreadyShouldWork() {
        SuccessDTO success = userResource.doesUsernameExistAlready("user");
        assertEquals(true, success.isSuccess());
        when(userDAO.getUser("user")).thenReturn(new User("user", RoleHelper.ROLE_DEFAULT));
        success = userResource.doesUsernameExistAlready("user");
        assertEquals(false, success.isSuccess());
    }

    @Test
    public void userFromUserAccessTokenShouldWork() {
        when(userTokenDAO.getUsernameFromToken("token")).thenReturn("user");
        when(userDAO.getUser("user")).thenReturn(new User("user", RoleHelper.ROLE_DEFAULT));
        User user = userResource.userFromUserAccessToken(new Cookie("token", "token"));
        assertEquals("user", user.getName());
        assertEquals(RoleHelper.ROLE_DEFAULT, user.getRole());
    }
}
