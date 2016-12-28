package db.mappers;

import api.BookingDTO;
import core.Util;
import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;

public class BookingMapper implements ResultSetMapper<BookingDTO> {
    @Override
    public BookingDTO map(int i, ResultSet resultSet, StatementContext statementContext) throws SQLException {
        return  BookingDTO.createBookingWithId(resultSet.getInt("id"),
                new Date(resultSet.getTimestamp("start_time").getTime()),
                new Date(resultSet.getTimestamp("end_time").getTime()),
                resultSet.getString("owner"),
                resultSet.getString("apartment"),
                resultSet.getString("name"),
                resultSet.getInt("number_of_washing_machine_uses"),
                resultSet.getInt("number_of_tumble_dry_uses"));
    }
}
