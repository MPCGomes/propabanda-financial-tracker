package com.propabanda.finance_tracker.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class OrderItemResponseDTO {
    private Long itemId;
    private String itemName;
    private BigDecimal priceAtOrder;
}
