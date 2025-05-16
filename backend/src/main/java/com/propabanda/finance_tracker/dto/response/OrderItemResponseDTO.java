package com.propabanda.finance_tracker.dto.response;

import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class OrderItemResponseDTO {

    private Long itemId;
    private String itemName;
    private Integer quantity;
    private BigDecimal unitPriceSnapshot;
    private BigDecimal total;
}
