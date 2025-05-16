package com.propabanda.finance_tracker.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientRequestDTO {

    @NotBlank(message = "Informe o nome do cliente.")
    @Size(max = 100, message = "O nome pode ter no máximo 100 caracteres.")
    private String name;

    @NotBlank(message = "Informe o CPF/CNPJ.")
    @Size(min = 14, max = 14, message = "O CPF/CNPJ deve conter 14 dígitos (somente números).")
    private String documentNumber;

    @Valid
    private RepresentantRequestDTO representantRequestDTO;

    @Valid
    private AddressRequestDTO addressRequestDTO;
}
