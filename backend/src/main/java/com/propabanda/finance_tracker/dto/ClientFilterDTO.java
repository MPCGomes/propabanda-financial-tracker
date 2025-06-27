package com.propabanda.finance_tracker.dto;

import com.propabanda.finance_tracker.model.ClientStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientFilterDTO {

    private String search;
    private String sortBy;
    private String direction;
    private ClientStatus status;
}
