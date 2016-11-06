import api.UserTokenDTO;
import auth.MyAuthenticator;
import core.User;
import db.UserDAO;
import db.UserTokenDAO;
import io.dropwizard.auth.AuthenticationException;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import java.util.Calendar;
import java.util.Date;
import java.util.Optional;
import static org.junit.Assert.*;
import static org.mockito.Mockito.when;

public class MyAuthenticatorTest {
    private MyAuthenticator myAuthenticator;
    UserDAO userDAO;
    UserTokenDAO userTokenDAO;

    @Before
    public void setup() {
        userTokenDAO = Mockito.mock(UserTokenDAO.class);
        userDAO = Mockito.mock(UserDAO.class);
        myAuthenticator = new MyAuthenticator(userTokenDAO, userDAO);
    }

    @Test(expected = AuthenticationException.class)
    public void notPresentTokenShouldThrowError() throws io.dropwizard.auth.AuthenticationException {
        when(userTokenDAO.getUserTokenFromToken("bogus")).thenReturn(null);
        myAuthenticator.authenticate("otherBogus");
    }

    @Test(expected = AuthenticationException.class)
    public void outdatedTokenShouldThrowError() throws AuthenticationException {
        when(userTokenDAO.getUserTokenFromToken("key")).thenReturn(new UserTokenDTO("bogus", "key", new Date(0), UserTokenDTO.Status.VALID));
        myAuthenticator.authenticate("key");
    }

    @Test(expected = AuthenticationException.class)
    public void tokenWithStatusInvalidShouldThrowError() throws AuthenticationException {
        when(userTokenDAO.getUserTokenFromToken("key")).thenReturn(new UserTokenDTO("bogus", "key", new Date(0), UserTokenDTO.Status.INVALID));
        myAuthenticator.authenticate("key");
    }

    @Test
    public void correctTokenShouldReturnUser() throws AuthenticationException {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, 1);
        when(userTokenDAO.getUserTokenFromToken("key")).thenReturn(new UserTokenDTO("user", "key", calendar.getTime(), UserTokenDTO.Status.VALID));
        when(userDAO.getUser("user")).thenReturn(new User("user", 0));
        Optional<User> user = myAuthenticator.authenticate("key");
        assertEquals("user", user.get().getName());
    }
}
