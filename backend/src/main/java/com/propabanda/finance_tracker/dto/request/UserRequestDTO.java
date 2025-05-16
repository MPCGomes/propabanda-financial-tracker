package com.propabanda.finance_tracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequestDTO {

    @NotBlank(message = "Informe o CPF do usuário.")
    @Pattern(regexp = "\\d{11}", message = "O CPF deve conter 11 dígitos numéricos.")
    private String documentNumber;

    @NotBlank(message = "Informe o nome de usuário.")
    @Size(max = 60, message = "O nome de usuário pode ter no máximo 60 caracteres.")
    private String username;

    @NotBlank(message = "Informe a senha.")
    private String password;

    @NotBlank(message = "Informe o perfil (role) do usuário.")
    private String role;
}
