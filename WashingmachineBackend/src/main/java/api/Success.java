package api;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Success {
    private String error;

    private boolean success;

    public Success(String error, boolean success) {
        this.error = error;
        this.success = success;
    }

    @JsonProperty
    public String getError() {
        return error;
    }

    @JsonProperty
    public boolean isSuccess() {
        return success;
    }
}
