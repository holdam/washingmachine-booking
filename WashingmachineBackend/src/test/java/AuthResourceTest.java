import core.User;
import core.Util;
import db.UserDAO;
import db.UserTokenDAO;
import org.junit.Before;
import org.junit.Test;
import resources.AuthResource;
import javax.naming.AuthenticationException;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AuthResourceTest {
    private AuthResource authResource;
    private UserTokenDAO userTokenDAO;
    private UserDAO userDAO;

    @Before
    public void setup() {
        userTokenDAO = mock(UserTokenDAO.class);
        userDAO = mock(UserDAO.class);
        authResource = new AuthResource(userTokenDAO, userDAO);
    }

    @Test(expected = AuthenticationException.class)
    public void nonexistantUserShouldReturnError() throws javax.naming.AuthenticationException {
        when(userDAO.getUser("user")).thenReturn(null);
        authResource.signIn("user", "bogus");
    }

    @Test
    public void correctCredentialsShouldResolveInUserToken() throws AuthenticationException {
        when(userDAO.getUser("user")).thenReturn(new User("user", 0));
        when(userDAO.getSaltForUser("user")).thenReturn("salt");
        String hashedAndSaltedPassword = Util.getHashedAndSaltedPassword("password", "salt");
        when(userDAO.authenticateUser("user", hashedAndSaltedPassword)).thenReturn(1);
        authResource.signIn("user", "password");
    }

    @Test(expected = AuthenticationException.class)
    public void incorrectCredentialsShouldResolveInError() throws AuthenticationException {
        when(userDAO.getUser("user")).thenReturn(new User("user", 0));
        when(userDAO.getSaltForUser("user")).thenReturn("salt");
        String hashedAndSaltedPassword = Util.getHashedAndSaltedPassword("wrong_password", "salt");
        when(userDAO.authenticateUser("user", hashedAndSaltedPassword)).thenReturn(1);
        authResource.signIn("user", "password");
    }
}
