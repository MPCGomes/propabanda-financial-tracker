package com.propabanda.finance_tracker.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
public class OrderRequestDTO {

    @NotNull(message = "Informe o cliente.")
    private Long clientId;

    @NotNull(message = "Informe ao menos um item.")
    @Valid
    private Set<Long> items;

    @NotNull(message = "Informe o valor do pedido.")
    @DecimalMin(value = "0.00", message = "O valor deve ser positivo.")
    private BigDecimal value;

    @NotNull(message = "Informe a data de início do contrato.")
    private LocalDate contractStartDate;

    @NotNull(message = "Informe a data de término do contrato.")
    private LocalDate contractEndDate;

    @NotNull(message = "Informe o dia de vencimento das parcelas.")
    @Min(value = 1, message = "O dia de vencimento deve ser entre 1 e 31.")
    @Max(value = 31, message = "O dia de vencimento deve ser entre 1 e 31.")
    private Integer installmentDay;

    @NotNull(message = "Informe a quantidade de parcelas.")
    @Min(value = 1, message = "Deve haver ao menos 1 parcela.")
    private Integer installmentCount;

    @NotNull(message = "Informe o desconto.")
    @DecimalMin(value = "0.00", message = "O desconto deve ser positivo.")
    private BigDecimal discount;

    @NotNull(message = "Informe a data de emissão.")
    private LocalDate emissionDate;

    @NotNull(message = "Informe quantas parcelas já foram pagas.")
    @Min(value = 0, message = "O número de parcelas pagas não pode ser negativo.")
    private Integer paidInstallmentsCount;

    private String contractFilePath;
}
