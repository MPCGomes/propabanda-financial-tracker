package com.propabanda.finance_tracker.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientRequestDTO {

    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Size(min = 14, max = 14)
    private String documentNumber;

    @Valid
    private RepresentantRequestDTO representantRequestDTO;

    @Valid
    private AddressRequestDTO addressRequestDTO;
}
