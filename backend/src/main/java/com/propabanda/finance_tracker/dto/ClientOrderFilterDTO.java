package com.propabanda.finance_tracker.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientOrderFilterDTO {

    private String itemSearch;
    private String sortBy;
    private String direction;
}
