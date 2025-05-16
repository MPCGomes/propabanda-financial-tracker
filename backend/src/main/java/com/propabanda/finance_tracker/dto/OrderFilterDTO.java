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

    private LocalDate startDate; // data inicial  (inclusive) – opcional
    private LocalDate  endDate;   // data final    (inclusive) – opcional
    private List<Long> itemIds;   // ids de itens  – opcional
}
