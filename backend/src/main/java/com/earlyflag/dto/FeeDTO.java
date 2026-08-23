package com.earlyflag.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class FeeDTO {
    private LocalDate dueDate;
    private BigDecimal amount;
    private String paidStatus;

    public FeeDTO() {
    }

    public FeeDTO(LocalDate dueDate, BigDecimal amount, String paidStatus) {
        this.dueDate = dueDate;
        this.amount = amount;
        this.paidStatus = paidStatus;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPaidStatus() {
        return paidStatus;
    }

    public void setPaidStatus(String paidStatus) {
        this.paidStatus = paidStatus;
    }
}