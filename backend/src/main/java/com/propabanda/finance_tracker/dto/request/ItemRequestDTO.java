package com.propabanda.finance_tracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemRequestDTO {

    @NotBlank
    @Size(max = 100)
    private String name;
}
