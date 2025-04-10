package com.propabanda.finance_tracker.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressResponseDTO {

    private String zipCode;
    private String state;
    private String city;
    private String neighbourhood;
    private String street;
    private String number;
    private String complement;
    private String reference;
}
