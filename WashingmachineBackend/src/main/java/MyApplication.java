import auth.CookieCredentialAuthFilter;
import auth.MyAuthenticator;
import com.codahale.metrics.MetricRegistry;
import core.BookingService;
import core.BookingServiceImpl;
import api.UserDTO;
import db.BookingDAO;
import db.UserDAO;
import db.UserTokenDAO;
import filters.NoCacheFilter;
import io.dropwizard.Application;
import io.dropwizard.auth.AuthDynamicFeature;
import io.dropwizard.auth.AuthValueFactoryProvider;
import io.dropwizard.auth.CachingAuthenticator;
import io.dropwizard.jdbi.DBIFactory;
import io.dropwizard.setup.Environment;
import org.skife.jdbi.v2.DBI;
import resources.AuthResource;
import resources.BookingResource;
import resources.UsageResource;
import resources.UserResource;
import filters.CSRFFilter;

public class MyApplication extends Application<MyConfiguration> {

    public static void main(String[] args) throws Exception {
        new MyApplication().run(args);
    }

    public void run(MyConfiguration config, Environment environment) throws Exception {
        final DBIFactory factory = new DBIFactory();
        final DBI jdbi = factory.build(environment, config.getDataSourceFactory(), "postgresql");
        final BookingDAO bookingDAO = jdbi.onDemand(BookingDAO.class);
        final UserDAO userDAO = jdbi.onDemand(UserDAO.class);
        final UserTokenDAO userTokenDAO = jdbi.onDemand(UserTokenDAO.class);
        final BookingService bookingService = new BookingServiceImpl(bookingDAO);

        // Sets up tables if they don't exist
        userDAO.createRoleTable();
        userDAO.createUsersTable();
        bookingDAO.createBookingTable();
        userTokenDAO.createUserTokenTable();


        // Authorization with caching
        CachingAuthenticator<String, UserDTO> cachingAuthenticator = new CachingAuthenticator<>(
                new MetricRegistry(),
                new MyAuthenticator(userTokenDAO, userDAO, config.getTokenLifetime()),
                config.getAuthenticationCachePolicy()
        );
        environment.jersey().register(new AuthDynamicFeature(
                new CookieCredentialAuthFilter.Builder<UserDTO>()
                        .setAuthenticator(cachingAuthenticator)
                        .buildAuthFilter()));
        environment.jersey().register(new AuthValueFactoryProvider.Binder<>(UserDTO.class));

        // Filters
        environment.jersey().register(new CSRFFilter(config.getTargetsOrigin()));
        environment.jersey().register(new NoCacheFilter());

        // Resources
        environment.jersey().register(new BookingResource(bookingDAO, userTokenDAO, bookingService));
        environment.jersey().register(new UserResource(userDAO, userTokenDAO));
        environment.jersey().register(new AuthResource(userTokenDAO, userDAO, config.getTokenLifetime(), config.getDomain()));
        environment.jersey().register(new UsageResource(bookingDAO, userTokenDAO));
    }
}
