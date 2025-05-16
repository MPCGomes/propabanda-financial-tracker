package com.propabanda.finance_tracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemRequestDTO {

    @NotBlank(message = "Informe o nome do item.")
    @Size(max = 100, message = "O nome do item pode ter no máximo 100 caracteres.")
    private String name;
}
