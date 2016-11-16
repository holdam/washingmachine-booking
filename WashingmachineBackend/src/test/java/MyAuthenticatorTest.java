import api.UserTokenDTO;
import auth.MyAuthenticator;
import core.User;
import db.UserDAO;
import db.UserTokenDAO;
import io.dropwizard.auth.AuthenticationException;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mockito;
import java.util.Calendar;
import java.util.Date;
import java.util.Optional;
import static org.junit.Assert.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class MyAuthenticatorTest {
    private MyAuthenticator myAuthenticator;
    private UserDAO userDAO;
    private UserTokenDAO userTokenDAO;
    private int tokenLifeTime;

    @Before
    public void setup() {
        tokenLifeTime = 7;
        userTokenDAO = Mockito.mock(UserTokenDAO.class);
        userDAO = Mockito.mock(UserDAO.class);
        myAuthenticator = new MyAuthenticator(userTokenDAO, userDAO, tokenLifeTime);
        when(userDAO.getUser("user")).thenReturn(new User("user", 0));
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
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, 1);
        when(userTokenDAO.getUserTokenFromToken("key")).thenReturn(new UserTokenDTO("bogus", "key", calendar.getTime(), UserTokenDTO.Status.INVALID));
        myAuthenticator.authenticate("key");
    }

    @Test
    public void correctTokenShouldReturnUser() throws AuthenticationException {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, 1);
        when(userTokenDAO.getUserTokenFromToken("key")).thenReturn(new UserTokenDTO("user", "key", calendar.getTime(), UserTokenDTO.Status.VALID));
        Optional<User> user = myAuthenticator.authenticate("key");
        assertEquals("user", user.get().getName());
    }

    @Test
    public void shouldUpdateTokenIfAboutToRunOut() throws AuthenticationException {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.HOUR_OF_DAY, 12);
        when(userTokenDAO.getUserTokenFromToken("token")).thenReturn(new UserTokenDTO("user", "token", calendar.getTime(), UserTokenDTO.Status.VALID));
        myAuthenticator.authenticate("token");

        ArgumentCaptor<Date> dateCaptor = ArgumentCaptor.forClass(Date.class);
        verify(userTokenDAO, times(1)).setNewTimeForToken(Mockito.eq("token"), dateCaptor.capture());

        calendar.add(Calendar.DAY_OF_YEAR, 7);
        calendar.add(Calendar.HOUR_OF_DAY, -12);
        Calendar calendar2 = Calendar.getInstance();
        calendar2.setTime(dateCaptor.getValue());

        assertEquals(calendar.get(Calendar.DAY_OF_YEAR), calendar2.get(Calendar.DAY_OF_YEAR));
        assertEquals(calendar.get(Calendar.HOUR_OF_DAY), calendar2.get(Calendar.HOUR_OF_DAY));
        assertEquals(calendar.get(Calendar.MINUTE), calendar2.get(Calendar.MINUTE));
    }
}
