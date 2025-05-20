package com.propabanda.finance_tracker.controller;

import com.propabanda.finance_tracker.service.ExcelImportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/import")
public class ImportController {

    private final ExcelImportService excelImportService;

    public ImportController(ExcelImportService excelImportService) {
        this.excelImportService = excelImportService;
    }

    @PostMapping
    public ResponseEntity<Void> importExcel(@RequestParam("file") MultipartFile file) {
        excelImportService.importFromExcel(file);
        return ResponseEntity.ok().build();
    }
}
