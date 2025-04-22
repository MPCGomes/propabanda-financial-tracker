package com.propabanda.finance_tracker.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ItemPerformanceDTO {

    private Long itemId;
    private String itemName;

    private BigDecimal totalRevenue;
    private BigDecimal percentageOfTotal;
    private BigDecimal variation;
}
