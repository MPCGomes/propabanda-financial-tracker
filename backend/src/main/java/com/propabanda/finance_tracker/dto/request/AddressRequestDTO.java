package com.propabanda.finance_tracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressRequestDTO {

    @NotBlank(message = "Informe o CEP.")
    @Pattern(regexp = "\\d{8}", message = "O CEP deve conter 8 dígitos numéricos (somente números).")
    private String zipCode;

    @NotBlank(message = "Informe a UF (estado).")
    @Pattern(regexp = "[A-Z]{2}", message = "A UF deve conter 2 letras maiúsculas.")
    private String state;

    @NotBlank(message = "Informe a cidade.")
    @Size(max = 100, message = "A cidade pode ter no máximo 100 caracteres.")
    private String city;

    @NotBlank(message = "Informe o bairro.")
    @Size(max = 100, message = "O bairro pode ter no máximo 100 caracteres.")
    private String neighbourhood;

    @NotBlank(message = "Informe a rua ou avenida.")
    @Size(max = 100, message = "A rua/avenida pode ter no máximo 100 caracteres.")
    private String street;

    @NotBlank(message = "Informe o número.")
    @Pattern(regexp = "\\d{1,5}", message = "O número deve conter apenas dígitos (até 5).")
    private String number;

    @Size(max = 50, message = "O complemento pode ter no máximo 50 caracteres.")
    private String complement;

    @Size(max = 100, message = "A referência pode ter no máximo 100 caracteres.")
    private String reference;
}
