package com.propabanda.finance_tracker.controller;

import com.propabanda.finance_tracker.dto.DashboardEvolutionDTO;
import com.propabanda.finance_tracker.dto.DashboardFilterDTO;
import com.propabanda.finance_tracker.dto.ItemPerformanceDTO;
import com.propabanda.finance_tracker.dto.response.ClientResponseDTO;
import com.propabanda.finance_tracker.dto.response.OrderResponseDTO;
import com.propabanda.finance_tracker.service.*;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/export")
public class ExportController {

    private final ClientService clientService;
    private final OrderService orderService;
    private final DashboardService dashboardService;
    private final ExcelExportService excelExportService;

    public ExportController(ClientService clientService,
                            OrderService orderService,
                            DashboardService dashboardService,
                            ExcelExportService excelExportService) {
        this.clientService = clientService;
        this.orderService = orderService;
        this.dashboardService = dashboardService;
        this.excelExportService = excelExportService;
    }

    @GetMapping("/report.xlsx")
    public ResponseEntity<ByteArrayResource> exportAllData() {
        try {
            List<ClientResponseDTO> clients = clientService.findAll();
            List<OrderResponseDTO> orders = orderService.findAll();

            DashboardEvolutionDTO dashboard = dashboardService.getEvolution(new DashboardFilterDTO());
            List<ItemPerformanceDTO> itemPerformance = dashboardService.getPerformance(new DashboardFilterDTO()).getItemPerformances();

            byte[] excelData = excelExportService.generateFullReport(clients, orders, dashboard, itemPerformance);

            ByteArrayResource resource = new ByteArrayResource(excelData);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio_completo.xlsx")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .contentLength(excelData.length)
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
