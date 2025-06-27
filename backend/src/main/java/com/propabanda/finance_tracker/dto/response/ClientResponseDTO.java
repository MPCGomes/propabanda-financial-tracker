package com.propabanda.finance_tracker.dto.response;

import com.propabanda.finance_tracker.model.ClientStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ClientResponseDTO {

    private Long id;
    private String name;
    private String documentNumber;
    private RepresentativeResponseDTO representativeResponseDTO;
    private AddressResponseDTO addressResponseDTO;
    private ClientStatus status;
    private LocalDate createdAt;
}
