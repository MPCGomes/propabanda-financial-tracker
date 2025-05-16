package com.propabanda.finance_tracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressRequestDTO {

    @NotBlank
    @Size(min = 8, max = 8)
    @Pattern(regexp="\\d{8}")
    private String zipCode;

    @NotBlank
    @Size(min = 2, max = 2)
    private String state;

    @NotBlank
    @Size(max = 100)
    private String city;

    @NotBlank
    @Size(max = 100)
    private String neighbourhood;

    @NotBlank
    @Size(max = 100)
    private String street;

    @NotBlank
    @Size(max = 5)
    private String number;

    @Size(max = 50)
    private String complement;

    @Size(max = 100)
    private String reference;
}
