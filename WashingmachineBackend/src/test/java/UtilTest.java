import core.Util;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import java.util.Calendar;
import java.util.Date;

public class UtilTest {

    @Test
    public void bookingMinutesShouldBeConvertedDownToNearest5Minutes() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 10);
        calendar.set(Calendar.MINUTE, 3);
        Date startTime = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 12);
        calendar.set(Calendar.MINUTE, 47);
        Date endTime = calendar.getTime();

        calendar.set(Calendar.HOUR_OF_DAY, 10);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date correctStartTime = calendar.getTime();
        calendar.set(Calendar.HOUR_OF_DAY, 12);
        calendar.set(Calendar.MINUTE, 45);
        Date correctEndTime = calendar.getTime();

        Date returnedStartDate = Util.convertMillisToDateAndFloorToNearest5Minutes(startTime.getTime());
        Assert.assertEquals(returnedStartDate.getTime(), correctStartTime.getTime());

        Date returnedEndDate = Util.convertMillisToDateAndFloorToNearest5Minutes(endTime.getTime());
        Assert.assertEquals(returnedEndDate.getTime(), correctEndTime.getTime());

    }
}
