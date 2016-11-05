package db;

import api.BookingDTO;
import db.mappers.BookingMapper;
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

    @SqlUpdate("INSERT INTO bookings (start_time, end_time, owner) VALUES (:bookingDTO.startTime, :bookingDTO.endTime, :bookingDTO.owner)")
    void insertBooking(@BindBean("bookingDTO") BookingDTO bookingDTO);

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
