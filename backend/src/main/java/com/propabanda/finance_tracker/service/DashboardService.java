package com.propabanda.finance_tracker.service;

import com.propabanda.finance_tracker.dto.*;
import com.propabanda.finance_tracker.dto.response.OrderResponseDTO;
import com.propabanda.finance_tracker.model.Order;
import com.propabanda.finance_tracker.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
public class DashboardService {

    private final OrderRepository orderRepository;
    private final OrderService orderService;

    public DashboardService(OrderRepository orderRepository, OrderService orderService) {
        this.orderRepository = orderRepository;
        this.orderService = orderService;
    }

    public DashboardEvolutionDTO getEvolution(DashboardFilterDTO dashboardFilterDTO) {
        LocalDate start = dashboardFilterDTO.getStartDate() != null ? dashboardFilterDTO.getStartDate() : LocalDate.MIN;
        LocalDate end = dashboardFilterDTO.getEndDate() != null ? dashboardFilterDTO.getEndDate() : LocalDate.MAX;

        List<Order> orders = orderRepository.findAll();
        if (dashboardFilterDTO.getItemIds() != null && !dashboardFilterDTO.getItemIds().isEmpty()) {
            orders = orders.stream()
                    .filter(order -> order.getItems().stream()
                            .anyMatch(item -> dashboardFilterDTO.getItemIds().contains(item.getId())))
                    .toList();
        }

        List<OrderResponseDTO> orderResponseDTOS = orders.stream()
                .map(orderService::toOrderResponseDTO).toList();

        BigDecimal initial = orderResponseDTOS.stream()
                .filter(orderResponseDTO -> orderResponseDTO.getEmissionDate().isBefore(start))
                .map(OrderResponseDTO::getDiscountedValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<OrderResponseDTO> period = orderResponseDTOS.stream()
                .filter(orderResponseDTO -> !orderResponseDTO.getEmissionDate().isBefore(start) && !orderResponseDTO.getEmissionDate().isAfter(end))
                .toList();

        BigDecimal income = period.stream()
                .map(OrderResponseDTO::getDiscountedValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal finalBalance = initial.add(income);

        BigDecimal varPct = initial.compareTo(BigDecimal.ZERO) > 0
                ? finalBalance.subtract(initial).multiply(BigDecimal.valueOf(100))
                .divide(initial, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        DashboardEvolutionDTO dashboardEvolutionDTO = new DashboardEvolutionDTO();
        dashboardEvolutionDTO.setInitialBalance(initial);
        dashboardEvolutionDTO.setTotalIncome(income);
        dashboardEvolutionDTO.setFinalBalance(finalBalance);
        dashboardEvolutionDTO.setVariationPercent(varPct);
        dashboardEvolutionDTO.setTotalOrders(period.size());
        dashboardEvolutionDTO.setOrders(period);
        return dashboardEvolutionDTO;
    }

    public DashboardPerformanceDTO getPerformance(DashboardFilterDTO dashboardFilterDTO) {
        LocalDate start = dashboardFilterDTO.getStartDate() != null ? dashboardFilterDTO.getStartDate() : LocalDate.MIN;
        LocalDate end = dashboardFilterDTO.getEndDate() != null ? dashboardFilterDTO.getEndDate() : LocalDate.MAX;

        List<Order> orders = orderRepository.findAll();
        if (dashboardFilterDTO.getItemIds() != null && !dashboardFilterDTO.getItemIds().isEmpty()) {
            orders = orders.stream()
                    .filter(order -> order.getItems().stream()
                            .anyMatch(item -> dashboardFilterDTO.getItemIds().contains(item.getId())))
                    .toList();
        }

        List<OrderResponseDTO> period = orders.stream()
                .filter(order -> !order.getEmissionDate().isBefore(start) && !order.getEmissionDate().isAfter(end))
                .map(orderService::toOrderResponseDTO).toList();

        Map<Long, ItemPerformanceDTO> map = new HashMap<>();

        for (OrderResponseDTO orderResponseDTO : period) {
            if (orderResponseDTO.getItems() == null || orderResponseDTO.getItems().isEmpty()) continue;

            BigDecimal share = orderResponseDTO.getDiscountedValue()
                    .divide(BigDecimal.valueOf(orderResponseDTO.getItems().size()), 2, RoundingMode.HALF_UP);

            orderResponseDTO.getItems().forEach(itemResponseDTO -> {
                map.putIfAbsent(itemResponseDTO.getId(), new ItemPerformanceDTO());
                ItemPerformanceDTO perf = map.get(itemResponseDTO.getId());
                perf.setItemId(itemResponseDTO.getId());
                perf.setItemName(itemResponseDTO.getName());
                BigDecimal cur = perf.getTotalRevenue() != null ? perf.getTotalRevenue() : BigDecimal.ZERO;
                perf.setTotalRevenue(cur.add(share));
            });
        }

        BigDecimal total = map.values().stream()
                .map(ItemPerformanceDTO::getTotalRevenue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        map.values().forEach(perf -> {
            BigDecimal pct = total.compareTo(BigDecimal.ZERO) > 0
                    ? perf.getTotalRevenue().multiply(BigDecimal.valueOf(100))
                    .divide(total, 2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
            perf.setPercentageOfTotal(pct);
            perf.setVariation(BigDecimal.ZERO);
        });

        DashboardPerformanceDTO out = new DashboardPerformanceDTO();
        out.setFinalBalance(total);
        out.setItemPerformances(new ArrayList<>(map.values()));
        return out;
    }
}
