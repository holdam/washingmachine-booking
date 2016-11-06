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
            "number_of_washing_machine_uses SMALLINT NOT NULL," +
            "number_of_tumble_dry_uses SMALLINT NOT NULL," +
            "PRIMARY KEY(id)" +
            ");")
    void createBookingTable();

    @SqlUpdate("INSERT INTO bookings (start_time, end_time, owner, number_of_washing_machine_uses, number_of_tumble_dry_uses) " +
            "VALUES (:bookingDTO.startTime, :bookingDTO.endTime, :bookingDTO.owner, :bookingDTO.numberOfWashingMachineUses, :bookingDTO.numberOfTumbleDryUses)")
    void insertBooking(@BindBean("bookingDTO") BookingDTO bookingDTO);

    @SqlQuery("SELECT * FROM bookings WHERE start_time >= :startTime AND :endTime >= end_time")
    List<BookingDTO> getBookingsInInterval(@Bind("startTime") Date startTime, @Bind("endTime") Date endTime);

    @SqlQuery("SELECT * FROM bookings WHERE start_time < :endTime AND end_time > :startTime")
    List<BookingDTO> getBookingsOverlappingInterval(@Bind("startTime") Date startTime, @Bind("endTime") Date endTime);

    @SqlUpdate("DELETE FROM bookings WHERE id = :id AND owner = :username")
    void deleteBooking(@Bind("username") String username, @Bind("id") int id);

    @SqlQuery("SELECT * FROM bookings WHERE start_time = :start_time AND end_time = :end_time AND owner = :owner")
    BookingDTO getBookingFromOwnerAndDates(@Bind("owner") String owner, @Bind("start_time") Date startTime,
                                           @Bind("end_time") Date endTime);

    @SqlUpdate("UPDATE bookings " +
            "SET start_time = :startTime, end_time = :endTime," +
            "number_of_washing_machine_uses = :numberOfWashingMachineUses," +
            "number_of_tumble_dry_uses = :numberOfTumbleDryUses " +
            "WHERE id = :id AND owner = :username")
    void updateBooking(@Bind("username") String username, @Bind("id") int id,
                       @Bind("startTime") Date startTime, @Bind("endTime") Date endTime,
                       @Bind("numberOfWashingMachineUses") int numberOfWashingMachineUses,
                       @Bind("numberOfTumbleDryUses") int numberOfTumbleDryUses);

    @SqlUpdate("TRUNCATE TABLE bookings")
    void truncateTable();
}
