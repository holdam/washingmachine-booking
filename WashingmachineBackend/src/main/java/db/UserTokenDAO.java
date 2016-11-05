package db;

import api.UserTokenDTO;
import db.mappers.UserTokenMapper;
import org.skife.jdbi.v2.sqlobject.Bind;
import org.skife.jdbi.v2.sqlobject.BindBean;
import org.skife.jdbi.v2.sqlobject.SqlQuery;
import org.skife.jdbi.v2.sqlobject.SqlUpdate;
import org.skife.jdbi.v2.sqlobject.customizers.RegisterMapper;

@RegisterMapper(UserTokenMapper.class)
public interface UserTokenDAO {
    @SqlUpdate("CREATE TABLE IF NOT EXISTS user_tokens (" +
            "id SERIAL," +
            "username VARCHAR(100) NOT NULL references users(username)," +
            "token TEXT NOT NULL," +
            "lifetime_ends DATE NOT NULL," +
            "status VARCHAR(7) NOT NULL," +
            "PRIMARY KEY(id)," +
            "UNIQUE(username)" +
            ");")
    void createUserTokenTable();

    @SqlUpdate("INSERT INTO user_tokens (username, token, lifetime_ends, status) " +
            "VALUES (:userTokenDTO.username, :userTokenDTO.token, :userTokenDTO.lifetimeEnds, :userTokenDTO.status)")
    void createUserToken(@BindBean("userTokenDTO") UserTokenDTO userTokenDTO);

    @SqlQuery("SELECT * FROM user_tokens WHERE username = :username")
    UserTokenDTO getUserTokenFromUsername(@Bind("username") String username);

    @SqlQuery("SELECT * FROM user_tokens WHERE token = :userToken")
    UserTokenDTO getUserTokenFromToken(@Bind("userToken") String userToken);

    @SqlUpdate("DELETE FROM user_tokens WHERE username = :username")
    void deleteUserTokenFromUsername(@Bind("username") String username);
}

/*

package db;

import api.BookingDTO;
import org.skife.jdbi.v2.sqlobject.Bind;
import org.skife.jdbi.v2.sqlobject.BindBean;
import org.skife.jdbi.v2.sqlobject.SqlQuery;
import org.skife.jdbi.v2.sqlobject.SqlUpdate;
import org.skife.jdbi.v2.sqlobject.customizers.RegisterMapper;

import java.util.Date;
import java.util.List;

@RegisterMapper(BookingMapper.class)
public interface BookingDAO {

    @SqlUpdate("CREATE TABLE IF NOT EXISTS bookings (" +
            "id SERIAL," +
            "start_time TIMESTAMP NOT NULL," +
            "end_time TIMESTAMP NOT NULL," +
            "owner VARCHAR(100) NOT NULL references users(username)," +
            "PRIMARY KEY(id)" +
            ");")
    void createBookingTable();

    @SqlUpdate("INSERT INTO bookings (start_time, end_time, owner) VALUES (:booking.startTime, :booking.endTime, :booking.owner)")
    void insertBooking(@BindBean("booking") BookingDTO booking);

    @SqlQuery("SELECT * FROM bookings WHERE start_time < :endTime AND end_time > :startTime")
    List<BookingDTO> getBookingsOverlappingInterval(@Bind("startTime") Date startTime, @Bind("endTime") Date endTime);

    @SqlQuery("SELECT * FROM bookings WHERE start_time >= :startTime AND :endTime <= end_time")
    List<BookingDTO> getBookingsInInterval(@Bind("startTime") Date startTime, @Bind("endTime") Date endTime);

    @SqlUpdate("DELETE FROM bookings WHERE start_time = :startTime AND end_time = :endTime AND owner = :username")
    void deleteBooking(@Bind("username") String username, @Bind("startTime") Date startTime, @Bind("endTime") Date endTime);

    @SqlUpdate("UPDATE bookings SET start_time = :startTimeNew, end_time = :endTimeNew WHERE " +
            "start_time = :startTimeOld AND end_time = :endTimeOld AND owner = :username")
    void updateBooking(@Bind("username") String username, @Bind("startTimeOld") Date startTimeOld, @Bind("endTimeOld") Date endTimeOld,
                       @Bind("startTimeNew") Date startTimeNew, @Bind("endTimeNew") Date endTimeNew);
}

 */
