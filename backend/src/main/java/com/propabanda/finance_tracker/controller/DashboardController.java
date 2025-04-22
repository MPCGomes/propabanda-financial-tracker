package com.propabanda.finance_tracker.controller;

import com.propabanda.finance_tracker.dto.DashboardEvolutionDTO;
import com.propabanda.finance_tracker.dto.DashboardFilterDTO;
import com.propabanda.finance_tracker.dto.DashboardPerformanceDTO;
import com.propabanda.finance_tracker.service.DashboardService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @PostMapping("/evolution")
    public ResponseEntity<DashboardEvolutionDTO> getEvolution(@RequestBody @Valid DashboardFilterDTO filter) {
        DashboardEvolutionDTO dashboardEvolutionDTO = dashboardService.getEvolution(filter);
        return ResponseEntity.ok(dashboardEvolutionDTO);
    }

    @PostMapping("/performance")
    public ResponseEntity<DashboardPerformanceDTO> getPerformance(@RequestBody @Valid DashboardFilterDTO dashboardFilterDTO) {
        DashboardPerformanceDTO dashboardPerformanceDTO = dashboardService.getPerformance(dashboardFilterDTO);
        return ResponseEntity.ok(dashboardPerformanceDTO);
    }
}
