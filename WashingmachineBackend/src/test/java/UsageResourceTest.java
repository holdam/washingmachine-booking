import api.UsageDTO;
import api.UserDTO;
import db.BookingDAO;
import db.UserTokenDAO;
import org.junit.Before;
import org.junit.Test;
import resources.UsageResource;
import resources.UserResource;

import javax.ws.rs.WebApplicationException;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;

public class UsageResourceTest {
    UsageResource usageResource;
    BookingDAO bookingDAO;
    UserTokenDAO userTokenDAO;

    @Before
    public void setup() {
        bookingDAO = mock(BookingDAO.class);
        userTokenDAO = mock(UserTokenDAO.class);
        usageResource = new UsageResource(bookingDAO, userTokenDAO);
    }

    @Test
    public void notLoggedInUserShouldReturnEmptyList() {
        List<UsageDTO> usage = usageResource.getUsageInInterval(null, 0, Long.MAX_VALUE);
        assertEquals(0, usage.size());
    }

    @Test(expected = WebApplicationException.class)
    public void onlyAdminShouldBeAllowedToAccessAdminTool() {
        usageResource.getUsageInIntervalAdmin(CommonTestUtil.defaultUser, 0, Long.MAX_VALUE);
    }


}
