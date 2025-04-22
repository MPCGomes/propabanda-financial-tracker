package com.propabanda.finance_tracker.service;

import com.propabanda.finance_tracker.dto.ClientOrderFilterDTO;
import com.propabanda.finance_tracker.dto.OrderFilterDTO;
import com.propabanda.finance_tracker.dto.request.OrderRequestDTO;
import com.propabanda.finance_tracker.dto.response.ItemResponseDTO;
import com.propabanda.finance_tracker.dto.response.OrderResponseDTO;
import com.propabanda.finance_tracker.model.Client;
import com.propabanda.finance_tracker.model.Item;
import com.propabanda.finance_tracker.model.Order;
import com.propabanda.finance_tracker.repository.ClientRepository;
import com.propabanda.finance_tracker.repository.ItemRepository;
import com.propabanda.finance_tracker.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ClientRepository clientRepository;
    private final ItemRepository itemRepository;

    public OrderService (OrderRepository orderRepository, ClientRepository clientRepository, ItemRepository itemRepository) {
        this.orderRepository = orderRepository;
        this.clientRepository = clientRepository;
        this.itemRepository = itemRepository;
    }

    public List<OrderResponseDTO> findAll() {
        return orderRepository.findAll().stream()
                .map(this::toOrderResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<OrderResponseDTO> findById(Long id) {
        return orderRepository.findById(id).map(this::toOrderResponseDTO);
    }

    public Optional<Order> findModelById(Long id) {
        return orderRepository.findById(id);
    }

    public OrderResponseDTO save(OrderRequestDTO orderRequestDTO) {
        Order order = toOrderModel(orderRequestDTO);
        order = orderRepository.save(order);
        return toOrderResponseDTO(order);
    }

    public OrderResponseDTO update(Long id, OrderRequestDTO orderRequestDTO) {
        Order order = toOrderModel(orderRequestDTO);
        order.setId(id);
        order = orderRepository.save(order);
        return toOrderResponseDTO(order);
    }

    public void delete(Long id) {
        orderRepository.deleteById(id);
    }

    public List<OrderResponseDTO> findAllFiltered(OrderFilterDTO orderFilterDTO) {
        List<Order> orders = orderRepository.findAll();

        if (orderFilterDTO.getSearch() != null && !orderFilterDTO.getSearch().isBlank()) {
            String term = orderFilterDTO.getSearch().toLowerCase();
            orders = orders.stream()
                    .filter(order -> order.getClient().getName().toLowerCase().contains(term))
                    .toList();
        }

        Comparator<Order> comparator;

        if ("emissionDate".equalsIgnoreCase(orderFilterDTO.getSortBy())) {
            comparator = Comparator.comparing(Order::getEmissionDate);
        } else {
            comparator = Comparator.comparing(order -> order.getClient().getName(), String.CASE_INSENSITIVE_ORDER);
        }

        if ("desc".equalsIgnoreCase(orderFilterDTO.getDirection())) {
            comparator = comparator.reversed();
        }

        orders = orders.stream().sorted(comparator).toList();

        return orders.stream()
                .map(this::toOrderResponseDTO)
                .toList();
    }

    public List<OrderResponseDTO> findByClientFiltered(Long clientId, ClientOrderFilterDTO clientOrderFilterDTO) {
        List<Order> orders = orderRepository.findAll().stream()
                .filter(order -> order.getClient().getId().equals(clientId))
                .toList();

        if (clientOrderFilterDTO.getItemSearch() != null && !clientOrderFilterDTO.getItemSearch().isBlank()) {
            String term = clientOrderFilterDTO.getItemSearch().toLowerCase();
            orders = orders.stream()
                    .filter(order -> order.getItems().stream()
                            .anyMatch(item -> item.getName().toLowerCase().contains(term)))
                    .toList();
        }

        Comparator<Order> comparator;

        switch (clientOrderFilterDTO.getSortBy()) {
            case "emissionDate" -> comparator = Comparator.comparing(Order::getEmissionDate);
            case "id" -> comparator = Comparator.comparing(Order::getId);
            case "itemName" -> comparator = Comparator.comparing(o ->
                    o.getItems().stream().findFirst().map(item -> item.getName().toLowerCase()).orElse(""));
            default -> comparator = Comparator.comparing(Order::getEmissionDate);
        }

        if ("desc".equalsIgnoreCase(clientOrderFilterDTO.getDirection())) {
            comparator = comparator.reversed();
        }

        orders = orders.stream().sorted(comparator).toList();

        return orders.stream()
                .map(this::toOrderResponseDTO)
                .toList();
    }


    private Order toOrderModel(OrderRequestDTO orderRequestDTO) {
        Client client = clientRepository.findById(orderRequestDTO.getClientId())
                .orElseThrow(() -> new IllegalArgumentException("Client not found"));

        Set<Item> items = new HashSet<>(itemRepository.findAllById(orderRequestDTO.getItemIds()));

        Order order = new Order();
        order.setClient(client);
        order.setContractStartDate(orderRequestDTO.getContractStartDate());
        order.setContractEndDate(orderRequestDTO.getContractEndDate());
        order.setInstallmentDay(orderRequestDTO.getInstallmentDay());
        order.setInstallmentCount(orderRequestDTO.getInstallmentCount());
        order.setDiscount(orderRequestDTO.getDiscount());
        order.setEmissionDate(orderRequestDTO.getEmissionDate());
        order.setPaidInstallmentsCount(orderRequestDTO.getPaidInstallmentsCount());
        order.setContractFilePath(orderRequestDTO.getContractFilePath());
        order.setItems(items);

        return order;
    }

    public OrderResponseDTO toOrderResponseDTO(Order order) {
        BigDecimal totalValue = order.getItems().stream()
                .map(Item::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discountPercent = order.getDiscount().divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal discountedValue = totalValue.subtract(totalValue.multiply(discountPercent));
        BigDecimal installmentValue = discountedValue.divide(BigDecimal.valueOf(order.getInstallmentCount()), 2, RoundingMode.HALF_UP);
        BigDecimal paidValue = installmentValue.multiply(BigDecimal.valueOf(order.getPaidInstallmentsCount()));
        BigDecimal remainingValue = discountedValue.subtract(paidValue);

        OrderResponseDTO orderResponseDTO = new OrderResponseDTO();
        orderResponseDTO.setId(order.getId());
        orderResponseDTO.setClientId(order.getClient().getId());
        orderResponseDTO.setClientName(order.getClient().getName());
        orderResponseDTO.setContractStartDate(order.getContractStartDate());
        orderResponseDTO.setContractEndDate(order.getContractEndDate());
        orderResponseDTO.setInstallmentDay(order.getInstallmentDay());
        orderResponseDTO.setInstallmentCount(order.getInstallmentCount());
        orderResponseDTO.setDiscount(order.getDiscount());
        orderResponseDTO.setEmissionDate(order.getEmissionDate());
        orderResponseDTO.setPaidInstallmentsCount(order.getPaidInstallmentsCount());
        orderResponseDTO.setContractFilePath(order.getContractFilePath());

        orderResponseDTO.setTotalValue(totalValue);
        orderResponseDTO.setDiscountedValue(discountedValue);
        orderResponseDTO.setPaidValue(paidValue);
        orderResponseDTO.setRemainingValue(remainingValue);

        orderResponseDTO.setItems(order.getItems().stream().map(item -> {
            ItemResponseDTO itemResponseDTO = new ItemResponseDTO();
            itemResponseDTO.setId(item.getId());
            itemResponseDTO.setName(item.getName());
            itemResponseDTO.setPrice(item.getPrice());
            return itemResponseDTO;
        }).collect(Collectors.toSet()));

        return orderResponseDTO;

    }
}
