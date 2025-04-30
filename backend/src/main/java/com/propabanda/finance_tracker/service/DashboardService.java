package com.propabanda.finance_tracker.service;

import com.propabanda.finance_tracker.dto.DashboardEvolutionDTO;
import com.propabanda.finance_tracker.dto.DashboardFilterDTO;
import com.propabanda.finance_tracker.dto.DashboardPerformanceDTO;
import com.propabanda.finance_tracker.dto.ItemPerformanceDTO;
import com.propabanda.finance_tracker.dto.response.OrderResponseDTO;
import com.propabanda.finance_tracker.model.Order;
import com.propabanda.finance_tracker.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final OrderRepository orderRepository;
    private final OrderService orderService;

    public DashboardService(OrderRepository orderRepository, OrderService orderService) {
        this.orderRepository = orderRepository;
        this.orderService = orderService;
    }

    public DashboardEvolutionDTO getEvolution(DashboardFilterDTO dashboardFilterDTO) {
        // Use full range if no dates are provided
        LocalDate startDate = dashboardFilterDTO.getStartDate() != null
                ? dashboardFilterDTO.getStartDate() : LocalDate.MIN;
        LocalDate endDate = dashboardFilterDTO.getEndDate() != null
                ? dashboardFilterDTO.getEndDate() : LocalDate.MAX;

        List<Order> allOrders = orderRepository.findAll();

        // Filter by item IDs if provided
        if (dashboardFilterDTO.getItemIds() != null && !dashboardFilterDTO.getItemIds().isEmpty()) {
            allOrders = allOrders.stream()
                    .filter(order -> order.getOrderItems().stream().anyMatch(orderItem ->
                            dashboardFilterDTO.getItemIds().contains(orderItem.getItem().getId())))
                    .toList();
        }

        // Convert all orders to DTOs
        List<OrderResponseDTO> allOrderDTOs = allOrders.stream()
                .map(orderService::toOrderResponseDTO)
                .toList();

        // Calculate initial balance
        BigDecimal initialBalance = allOrderDTOs.stream()
                .filter(orderDTO -> orderDTO.getEmissionDate().isBefore(startDate))
                .map(OrderResponseDTO::getDiscountedValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<OrderResponseDTO> periodOrderDTOs = allOrderDTOs.stream()
                .filter(orderDTO -> orderDTO.getEmissionDate().isBefore(startDate)
                        && !orderDTO.getEmissionDate().isAfter(endDate))
                .toList();

        BigDecimal totalIncome = periodOrderDTOs.stream()
                .map(OrderResponseDTO::getDiscountedValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal finalBalance = initialBalance.add(totalIncome);

        BigDecimal variationPercent = initialBalance.compareTo(BigDecimal.ZERO) > 0
                ? finalBalance.subtract(initialBalance)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(initialBalance, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        DashboardEvolutionDTO dashboardEvolutionDTO = new DashboardEvolutionDTO();
        dashboardEvolutionDTO.setInitialBalance(initialBalance);
        dashboardEvolutionDTO.setTotalIncome(totalIncome);
        dashboardEvolutionDTO.setFinalBalance(finalBalance);
        dashboardEvolutionDTO.setVariationPercent(variationPercent);
        dashboardEvolutionDTO.setTotalOrders(periodOrderDTOs.size());
        dashboardEvolutionDTO.setOrders(periodOrderDTOs);

        return dashboardEvolutionDTO;
    }

    public DashboardPerformanceDTO getPerformance(DashboardFilterDTO dashboardFilterDTO) {
        LocalDate startDate = dashboardFilterDTO.getStartDate() != null
                ? dashboardFilterDTO.getStartDate() : LocalDate.MIN;
        LocalDate endDate = dashboardFilterDTO.getEndDate() != null
                ? dashboardFilterDTO.getEndDate() : LocalDate.MAX;

        List<Order> allOrders = orderRepository.findAll();

        if (dashboardFilterDTO.getItemIds() != null && !dashboardFilterDTO.getItemIds().isEmpty()) {
            allOrders = allOrders.stream()
                    .filter(order -> order.getOrderItems().stream().anyMatch(orderItem ->
                            dashboardFilterDTO.getItemIds().contains(orderItem.getItem().getId())))
                    .toList();
        }

        List<OrderResponseDTO> periodOrderDTOs = allOrders.stream()
                .filter(order -> !order.getEmissionDate().isBefore(startDate)
                        && !order.getEmissionDate().isAfter(endDate))
                .map(orderService::toOrderResponseDTO)
                .toList();

        Map<Long, ItemPerformanceDTO> itemPerformanceDTOMap = new HashMap<>();

        for (OrderResponseDTO orderResponseDTO : periodOrderDTOs) {
            if (orderResponseDTO.getOrderItems() == null || orderResponseDTO.getOrderItems().isEmpty()) continue;

            BigDecimal valuePerItem = orderResponseDTO.getDiscountedValue()
                    .divide(BigDecimal.valueOf(orderResponseDTO.getOrderItems().size()), 2, RoundingMode.HALF_UP);

            orderResponseDTO.getOrderItems().forEach(orderItem -> {
                Long itemId = orderItem.getItemId();
                itemPerformanceDTOMap.putIfAbsent(itemId, new ItemPerformanceDTO());
                ItemPerformanceDTO dto = itemPerformanceDTOMap.get(itemId);
                dto.setItemId(itemId);
                dto.setItemName(orderItem.getItemName());

                BigDecimal current = dto.getTotalRevenue() != null ? dto.getTotalRevenue() : BigDecimal.ZERO;
                dto.setTotalRevenue(current.add(valuePerItem));
            });
        }

        BigDecimal finalBalance = itemPerformanceDTOMap.values().stream()
                .map(ItemPerformanceDTO::getTotalRevenue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        itemPerformanceDTOMap.values().forEach(itemPerformanceDTO -> {
            BigDecimal percentage = finalBalance.compareTo(BigDecimal.ZERO) > 0
                    ? itemPerformanceDTO.getTotalRevenue()
                        .multiply(BigDecimal.valueOf(100))
                        .divide(finalBalance, 2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;

            itemPerformanceDTO.setPercentageOfTotal(percentage);
            itemPerformanceDTO.setVariation(BigDecimal.ZERO);
        });

        DashboardPerformanceDTO dashboardPerformanceDTO = new DashboardPerformanceDTO();
        dashboardPerformanceDTO.setFinalBalance(finalBalance);
        dashboardPerformanceDTO.setItemPerformances(new ArrayList<>(itemPerformanceDTOMap.values()));

        return dashboardPerformanceDTO;
    }
}
