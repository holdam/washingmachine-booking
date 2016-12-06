import api.UserTokenDTO;
import core.RoleHelper;
import db.UserDAO;
import db.UserTokenDAO;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.skife.jdbi.v2.DBI;

import java.util.Calendar;
import java.util.Date;

import static org.junit.Assert.assertEquals;

public class UserTokenDAOTest {
    private UserDAO userDAO;
    private UserTokenDAO userTokenDAO;
    private final String USERNAME_1 = "user";
    private final String USERNAME_1_ALTERNATIVE = "UsEr";
    private final String USERNAME_2 = "user2";
    private final String USER_1_PASSWORD = "password_that_should_have_been_hashed_and_salted";
    private final String USER_1_SALT = "salt";
    private final String USER_1_TOKEN = "token";
    private final String USER_2_TOKEN = "token2";

    @Before
    public void setup() {
        DBI dbi = new DBI("jdbc:postgresql://localhost:5432/test", "postgres", "root");
        userDAO = dbi.onDemand(UserDAO.class);
        userTokenDAO = dbi.onDemand(UserTokenDAO.class);
        userDAO.createRoleTable();
        userDAO.createUsersTable();
        userTokenDAO.createUserTokenTable();
        userDAO.insertUser(USERNAME_1, USER_1_PASSWORD, USER_1_SALT, "name1", "apartment1", RoleHelper.ROLE_DEFAULT);
        userDAO.insertUser(USERNAME_2, USER_1_PASSWORD, USER_1_SALT, "name2", "apartment2", RoleHelper.ROLE_DEFAULT);
    }

    @After
    public void tearDown() {
        userTokenDAO.truncateTable();
        userDAO.truncateUsersTable();
    }

    @Test
    public void createUserTokenShouldWork() {
        int numberInserted = insertUserTokenForUser1();
        assertEquals(1, numberInserted);
    }

    @Test
    public void getUserTokenFromUsernameShouldWork() {
        insertUserTokenForUser1();
        UserTokenDTO userTokenDTO = userTokenDAO.getUserTokenFromUsername(USERNAME_1);
        assertEquals(UserTokenDTO.Status.VALID, userTokenDTO.getStatus());
        assertEquals(USER_1_TOKEN, userTokenDTO.getToken());
        assertEquals(USERNAME_1, userTokenDTO.getUsername());

        userTokenDTO = userTokenDAO.getUserTokenFromUsername(USERNAME_2);
        assertEquals(null, userTokenDTO);
    }

    @Test
    public void getUserTokenFromTokenShouldWork() {
        insertUserTokenForUser1();
        UserTokenDTO userTokenDTO = userTokenDAO.getUserTokenFromToken(USER_1_TOKEN);
        assertEquals(UserTokenDTO.Status.VALID, userTokenDTO.getStatus());
        assertEquals(USER_1_TOKEN, userTokenDTO.getToken());
        assertEquals(USERNAME_1, userTokenDTO.getUsername());

        userTokenDTO = userTokenDAO.getUserTokenFromUsername("bogus");
        assertEquals(null, userTokenDTO);
    }

    @Test
    public void deleteUserTokenFromUsernameShouldWork() {
        insertUserTokenForUser1();
        int numberDeleted = userTokenDAO.deleteUserTokenFromUsername(USERNAME_1);
        assertEquals(1, numberDeleted);
        numberDeleted = userTokenDAO.deleteUserTokenFromUsername(USERNAME_1);
        assertEquals(0, numberDeleted);
    }

    @Test
    public void setNewTimeForTokenShouldWork() {
        insertUserTokenForUser1();
        insertUserTokenForUser2();
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, 10);
        int numberUpdated = userTokenDAO.setNewTimeForToken(USER_1_TOKEN, calendar.getTime());
        assertEquals(1, numberUpdated);
        UserTokenDTO userTokenDTO = userTokenDAO.getUserTokenFromToken(USER_1_TOKEN);

        Calendar calendar2 = Calendar.getInstance();
        calendar2.setTime(userTokenDTO.getLifetimeEnds());

        assertEquals(calendar.get(Calendar.DAY_OF_YEAR), calendar2.get(Calendar.DAY_OF_YEAR));
        assertEquals(calendar.get(Calendar.MONTH), calendar2.get(Calendar.MONTH));
        assertEquals(calendar.get(Calendar.YEAR), calendar2.get(Calendar.YEAR));
    }

    @Test
    public void getUsernameFromTokenShouldWork() {
        insertUserTokenForUser1();
        String username = userTokenDAO.getUsernameFromToken(USER_1_TOKEN);
        assertEquals(USERNAME_1, username);
    }

    @Test
    public void usernameCasingForGetUserTokenFromUsernameShouldNotMatter() {
        insertUserTokenForUser1();
        UserTokenDTO token = userTokenDAO.getUserTokenFromUsername(USERNAME_1_ALTERNATIVE);
        assertEquals(USER_1_TOKEN, token.getToken());
    }

    @Test
    public void usernameCasingForDeleteUserTokenFromUsernameShouldNotMatter() {
        insertUserTokenForUser1();
        int rowsDeleted = userTokenDAO.deleteUserTokenFromUsername(USERNAME_1_ALTERNATIVE);
        assertEquals(1, rowsDeleted);
    }


    private int insertUserTokenForUser1() {
        UserTokenDTO userTokenDTO = new UserTokenDTO(USERNAME_1, USER_1_TOKEN, new Date(), UserTokenDTO.Status.VALID);
        return userTokenDAO.createUserToken(userTokenDTO);
    }
    private int insertUserTokenForUser2() {
        UserTokenDTO userTokenDTO = new UserTokenDTO(USERNAME_2, USER_2_TOKEN, new Date(), UserTokenDTO.Status.VALID);
        return userTokenDAO.createUserToken(userTokenDTO);
    }
}