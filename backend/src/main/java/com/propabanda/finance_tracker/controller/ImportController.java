package com.propabanda.finance_tracker.controller;

import com.propabanda.finance_tracker.dto.response.ClientResponseDTO;
import com.propabanda.finance_tracker.dto.response.OrderResponseDTO;
import com.propabanda.finance_tracker.service.ExcelImportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/import")
public class ImportController {

    private final ExcelImportService excelImportService;

    public ImportController(ExcelImportService excelImportService) {
        this.excelImportService = excelImportService;
    }

    @PostMapping("/clients")
    public ResponseEntity<List<ClientResponseDTO>> importClients(@RequestParam("file") MultipartFile file) {
        List<ClientResponseDTO> result = excelImportService.importClientsFromExcel(file);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/orders")
    public ResponseEntity<List<OrderResponseDTO>> importOrders(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(excelImportService.importOrdersFromExcel(file));
    }

}