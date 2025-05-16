package com.propabanda.finance_tracker.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
public class OrderRequestDTO {

    @NotNull
    private Long clientId;

    @NotNull @Valid
    private Set<Long> items;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal value;

    @NotNull
    private LocalDate contractStartDate;

    @NotNull
    private LocalDate contractEndDate;

    @NotNull
    @Min(1)
    @Max(31)
    private Integer installmentDay;

    @NotNull
    @Min(1)
    private Integer installmentCount;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal discount;

    @NotNull
    private LocalDate emissionDate;

    @NotNull
    @Min(0)
    private Integer paidInstallmentsCount;

    private String contractFilePath;
}
