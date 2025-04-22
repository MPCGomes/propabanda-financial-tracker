package com.propabanda.finance_tracker.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
public class DashboardFilterDTO {

    private LocalDate startDate;
    private LocalDate endDate;
    private Set<Long> itemIds;
}
