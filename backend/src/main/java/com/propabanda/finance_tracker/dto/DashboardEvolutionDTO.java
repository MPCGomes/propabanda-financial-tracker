package com.propabanda.finance_tracker.dto;

import com.propabanda.finance_tracker.dto.response.OrderResponseDTO;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class DashboardEvolutionDTO {

    private BigDecimal initialBalance;
    private BigDecimal totalIncome;
    private BigDecimal finalBalance;
    private Integer totalOrders;
    private BigDecimal variationPercent;
    private List<OrderResponseDTO> orders;
}
