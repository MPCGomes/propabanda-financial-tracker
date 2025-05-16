package com.propabanda.finance_tracker.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class OrderFilterDTO {

    private String search;
    private String sortBy;
    private String direction;

    private LocalDate startDate;
    private LocalDate  endDate;
    private List<Long> itemIds;
}
