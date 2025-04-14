package com.propabanda.finance_tracker.service;

import com.propabanda.finance_tracker.dto.DashboardEvolutionDTO;
import com.propabanda.finance_tracker.dto.DashboardFilterDTO;
import com.propabanda.finance_tracker.dto.response.OrderResponseDTO;
import com.propabanda.finance_tracker.model.Order;
import com.propabanda.finance_tracker.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
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
        LocalDate startDate = dashboardFilterDTO.getStartDate() != null ?
                dashboardFilterDTO.getStartDate() : LocalDate.MIN;
        LocalDate endDate = dashboardFilterDTO.getEndDate() != null ?
                dashboardFilterDTO.getEndDate() : LocalDate.MAX;

        List<Order> allOrders = orderRepository.findAll();

        // Filter by item IDs if provided
        if (dashboardFilterDTO.getItemIds() != null && !dashboardFilterDTO.getItemIds().isEmpty()) {
            allOrders = allOrders.stream()
                    .filter(order -> order.getItems().stream()
                            .anyMatch(item -> dashboardFilterDTO.getItemIds().contains(item.getId())))
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
}
