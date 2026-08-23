package com.earlyflag.dto;

import java.util.ArrayList;
import java.util.List;

public class CsvUploadResponseDTO {
    private boolean success;
    private String message;
    private int recordsProcessed;
    private List<String> errors = new ArrayList<>();

    public CsvUploadResponseDTO() {
    }

    public CsvUploadResponseDTO(boolean success, String message, int recordsProcessed, List<String> errors) {
        this.success = success;
        this.message = message;
        this.recordsProcessed = recordsProcessed;
        this.errors = errors != null ? errors : new ArrayList<>();
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getRecordsProcessed() {
        return recordsProcessed;
    }

    public void setRecordsProcessed(int recordsProcessed) {
        this.recordsProcessed = recordsProcessed;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors != null ? errors : new ArrayList<>();
    }
}
