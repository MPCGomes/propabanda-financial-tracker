package com.propabanda.finance_tracker.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class DashboardPerformanceDTO {

    private BigDecimal finalBalance;
    private List<ItemPerformanceDTO> itemPerformances;
}
