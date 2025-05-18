package com.propabanda.finance_tracker.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
public class OrderResponseDTO {

    private Long id;
    private String identifier;

    private Long clientId;
    private String clientName;

    private Set<ItemResponseDTO> items;

    private LocalDate contractStartDate;
    private LocalDate contractEndDate;
    private Integer installmentDay;
    private Integer installmentCount;
    private BigDecimal discount;
    private LocalDate emissionDate;
    private Integer paidInstallmentsCount;
    private String contractFilePath;

    private BigDecimal value;
    private BigDecimal discountedValue;
    private BigDecimal paidValue;
    private BigDecimal remainingValue;
    private LocalDate createdAt;
}
