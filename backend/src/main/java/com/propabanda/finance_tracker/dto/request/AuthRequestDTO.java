package com.propabanda.finance_tracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthRequestDTO {

    @NotBlank
    private String documentNumber;

    @NotBlank
    private String password;
}
