package com.propabanda.finance_tracker.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ItemResponseDTO {

    private Long id;
    private String name;
    private BigDecimal value;
}
