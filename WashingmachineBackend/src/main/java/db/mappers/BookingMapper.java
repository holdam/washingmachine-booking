package db.mappers;

import api.BookingDTO;
import core.Util;
import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class BookingMapper implements ResultSetMapper<BookingDTO> {
    @Override
    public BookingDTO map(int i, ResultSet resultSet, StatementContext statementContext) throws SQLException {
        return new BookingDTO(resultSet.getInt("id"),
                Util.convertMillisToDateAndFloorToNearest5Minutes(resultSet.getTimestamp("start_time").getTime()),
                Util.convertMillisToDateAndFloorToNearest5Minutes(resultSet.getTimestamp("end_time").getTime()),
                resultSet.getString("owner"),
                resultSet.getInt("number_of_washing_machine_uses"),
                resultSet.getInt("number_of_tumble_dry_uses"));
    }
}
