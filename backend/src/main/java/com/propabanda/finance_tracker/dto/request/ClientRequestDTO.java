package com.propabanda.finance_tracker.dto.request;

import com.propabanda.finance_tracker.model.ClientStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientRequestDTO {

    @NotBlank(message = "Informe o nome do cliente.")
    @Size(max = 100, message = "O nome pode ter no máximo 100 caracteres.")
    private String name;

    @NotBlank(message = "Informe o CPF ou o CNPJ.")
    @Pattern(
            regexp = "\\d{11,14}",
            message = "O CPF ou CNPJ deve conter entre 11 e 14 dígitos numéricos."
    )
    private String documentNumber;

    @Valid
    private RepresentativeRequestDTO representativeRequestDTO;

    @Valid
    private AddressRequestDTO addressRequestDTO;

    @NotNull(message = "Informe o status do cliente.")
    private ClientStatus status;
}
