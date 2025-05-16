package com.propabanda.finance_tracker.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RepresentantRequestDTO {

    @NotBlank(message = "Informe o nome do representante.")
    @Size(max = 100, message = "O nome pode ter no máximo 100 caracteres.")
    private String name;

    @NotBlank(message = "Informe o e-mail do representante.")
    @Email(message = "E-mail inválido.")
    @Size(max = 100, message = "O e-mail pode ter no máximo 100 caracteres.")
    private String email;

    @NotBlank(message = "Informe o telefone do representante.")
    @Pattern(regexp = "\\d{10,11}", message = "O telefone deve conter 10 ou 11 dígitos numéricos.")
    private String phone;
}
