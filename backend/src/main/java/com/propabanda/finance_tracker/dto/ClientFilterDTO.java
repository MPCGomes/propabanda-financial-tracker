package com.propabanda.finance_tracker.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientFilterDTO {

    private String search;
    private String sortBy;
    private String direction;
}
