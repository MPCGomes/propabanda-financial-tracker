package com.propabanda.finance_tracker.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientResponseDTO {

    private Long id;
    private String name;
    private String documentNumber;
    private RepresentantResponseDTO representantResponseDTO;
    private AddressResponseDTO addressResponseDTO;
}
