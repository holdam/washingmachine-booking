package db.mappers;

import api.UsageDTO;
import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

public class UsageMapper implements ResultSetMapper<UsageDTO> {

    @Override
    public UsageDTO map(int i, ResultSet resultSet, StatementContext statementContext) throws SQLException {
        try {
            Date date = new SimpleDateFormat("MMM", Locale.ENGLISH).parse(resultSet.getString("mon"));
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            return new UsageDTO(resultSet.getInt("sum_of_washing_machine_uses"), resultSet.getInt("sum_of_tumble_dry_uses"),
                    resultSet.getInt("year"), calendar.get(Calendar.MONTH));
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return null;
    }
}
