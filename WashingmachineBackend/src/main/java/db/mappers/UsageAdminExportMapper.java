package db.mappers;

import api.UsageAdminExportDTO;
import org.skife.jdbi.v2.StatementContext;
import org.skife.jdbi.v2.tweak.ResultSetMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

public class UsageAdminExportMapper implements ResultSetMapper<UsageAdminExportDTO> {
    @Override
    public UsageAdminExportDTO map(int i, ResultSet resultSet, StatementContext statementContext) throws SQLException {
        try {
            Date date = new SimpleDateFormat("MMM", Locale.ENGLISH).parse(resultSet.getString("mon"));
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            return new UsageAdminExportDTO(resultSet.getString("name"), resultSet.getString("apartment"),
                    calendar.get(Calendar.MONTH), resultSet.getInt("year"), resultSet.getInt("sum_of_washing_machine_uses"),
                    resultSet.getInt("sum_of_tumble_dry_uses"));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }
}
