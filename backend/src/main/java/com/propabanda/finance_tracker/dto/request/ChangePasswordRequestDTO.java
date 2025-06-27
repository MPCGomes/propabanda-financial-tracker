package com.propabanda.finance_tracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequestDTO {
    @NotBlank(message = "Informe a senha atual.")
    private String currentPassword;

    @NotBlank(message = "Informe a nova senha.")
    private String newPassword;
}
