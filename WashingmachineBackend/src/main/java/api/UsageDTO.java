package api;

public class UsageDTO {
    private int sumOfWashingMachineUses;
    private int sumOfTumbleDryUses;
    private int month;
    private int year;

    public UsageDTO(int sumOfWashingMachineUses, int sumOfTumbleDryUses, int year, int month) {
        this.sumOfWashingMachineUses = sumOfWashingMachineUses;
        this.sumOfTumbleDryUses = sumOfTumbleDryUses;
        this.year = year;
        this.month = month;
    }

    public int getSumOfWashingMachineUses() {
        return sumOfWashingMachineUses;
    }

    public int getSumOfTumbleDryUses() {
        return sumOfTumbleDryUses;
    }

    public int getMonth() {
        return month;
    }

    public int getYear() {
        return year;
    }
}
