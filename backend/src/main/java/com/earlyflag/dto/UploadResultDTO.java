package com.earlyflag.dto;

public class UploadResultDTO {
    private int inserted;
    public UploadResultDTO() {}
    public UploadResultDTO(int inserted) { this.inserted = inserted; }
    public int getInserted() { return inserted; }
    public void setInserted(int inserted) { this.inserted = inserted; }
}