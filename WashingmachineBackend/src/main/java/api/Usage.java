package api;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Usage {
    private String owner;
    private int sumOfWashingMachineUses;
    private int sumOfTumbleDryUses;

    public Usage(String owner, int sumOfWashingMachineUses, int sumOfTumbleDryUses) {
        this.owner = owner;
        this.sumOfWashingMachineUses = sumOfWashingMachineUses;
        this.sumOfTumbleDryUses = sumOfTumbleDryUses;
    }

    @JsonProperty
    public String getOwner() {
        return owner;
    }

    @JsonProperty
    public int getSumOfWashingMachineUses() {
        return sumOfWashingMachineUses;
    }

    @JsonProperty
    public int getSumOfTumbleDryUses() {
        return sumOfTumbleDryUses;
    }
}
