package com.propabanda.finance_tracker.controller;

import com.propabanda.finance_tracker.dto.DashboardEvolutionDTO;
import com.propabanda.finance_tracker.dto.DashboardFilterDTO;
import com.propabanda.finance_tracker.dto.ItemPerformanceDTO;
import com.propabanda.finance_tracker.dto.OrderFilterDTO;
import com.propabanda.finance_tracker.dto.response.ClientResponseDTO;
import com.propabanda.finance_tracker.dto.response.OrderResponseDTO;
import com.propabanda.finance_tracker.model.ClientStatus;
import com.propabanda.finance_tracker.service.*;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;

@RestController
@RequestMapping("/api/export")
public class ExportController {
    private final ClientService clientService;
    private final OrderService orderService;
    private final DashboardService dashboardService;
    private final ExcelExportService excelExportService;

    public ExportController(ClientService clientService, OrderService orderService, DashboardService dashboardService, ExcelExportService excelExportService) {
        this.clientService = clientService;
        this.orderService = orderService;
        this.dashboardService = dashboardService;
        this.excelExportService = excelExportService;
    }

    @GetMapping("/report.xlsx")
    public ResponseEntity<?> exportFilteredData(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) List<Long> itemIds,
            @RequestParam(required = false) ClientStatus status)
    {
        try {
            DashboardFilterDTO dashboardFilter = new DashboardFilterDTO();
            OrderFilterDTO orderFilter = new OrderFilterDTO();

            if (startDate != null && !startDate.isEmpty()) {
                LocalDate parsedDate = LocalDate.parse(startDate);
                dashboardFilter.setStartDate(parsedDate);
                orderFilter.setStartDate(parsedDate);
            }

            if (endDate != null && !endDate.isEmpty()) {
                LocalDate parsedDate = LocalDate.parse(endDate);
                dashboardFilter.setEndDate(parsedDate);
                orderFilter.setEndDate(parsedDate);
            }

            if (itemIds != null && !itemIds.isEmpty()) {
                dashboardFilter.setItemIds(new HashSet<>(itemIds));
                orderFilter.setItemIds(itemIds);
            }

            orderFilter.setSortBy("emissionDate");
            orderFilter.setDirection("asc");

            List<ClientResponseDTO> clients = clientService.findAll();
            List<OrderResponseDTO> orders = orderService.findAllFiltered(orderFilter);
            DashboardEvolutionDTO dashboard = dashboardService.getEvolution(dashboardFilter);
            List<ItemPerformanceDTO> itemPerformance = dashboardService.getPerformance(dashboardFilter).getItemPerformances();

            byte[] excelData = excelExportService.generateFullReport(clients, orders, dashboard, itemPerformance, status);
            ByteArrayResource resource = new ByteArrayResource(excelData);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio_completo.xlsx")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .contentLength(excelData.length)
                    .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(500)
                    .body(new ErrorResponse("Falha ao gerar o arquivo de exportação: " + e.getMessage()));
        }
    }

    private static class ErrorResponse {
        private final String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}