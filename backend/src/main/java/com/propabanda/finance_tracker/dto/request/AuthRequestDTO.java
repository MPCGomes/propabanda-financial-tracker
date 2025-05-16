package com.propabanda.finance_tracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthRequestDTO {

    @NotBlank(message = "Informe o CPF.")
    private String documentNumber;

    @NotBlank(message = "Informe a senha.")
    private String password;
}
