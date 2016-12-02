package api;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UsageAdminExportDTO {
    private String realName;
    private String apartment;
    private int month;
    private int year;
    private int sumOfWashingMachineUses;
    private int sumOfTumbleDryUses;

    public UsageAdminExportDTO(String realName, String apartment, int month, int year, int sumOfWashingMachineUses, int sumOfTumbleDryUses) {
        this.realName = realName;
        this.apartment = apartment;
        this.month = month;
        this.year = year;
        this.sumOfWashingMachineUses = sumOfWashingMachineUses;
        this.sumOfTumbleDryUses = sumOfTumbleDryUses;
    }

    public String getRealName() {
        return realName;
    }

    public String getApartment() {
        return apartment;
    }

    public int getMonth() {
        return month;
    }

    public int getYear() {
        return year;
    }

    public int getSumOfWashingMachineUses() {
        return sumOfWashingMachineUses;
    }

    public int getSumOfTumbleDryUses() {
        return sumOfTumbleDryUses;
    }
}
