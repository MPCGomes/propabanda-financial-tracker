package com.propabanda.finance_tracker.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponseDTO {

    private Long id;
    private String documentNumber;
    private String role;
}
