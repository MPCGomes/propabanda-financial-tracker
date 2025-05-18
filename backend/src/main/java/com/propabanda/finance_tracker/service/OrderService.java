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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ClientRepository clientRepository;
    private final ItemRepository itemRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public OrderService(OrderRepository orderRepository, ClientRepository clientRepository, ItemRepository itemRepository) {
        this.orderRepository = orderRepository;
        this.clientRepository = clientRepository;
        this.itemRepository = itemRepository;
    }

    public List<OrderResponseDTO> findAll() {
        return orderRepository.findAll().stream()
                .map(this::toOrderResponseDTO)
                .toList();
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
        order.setIdentifier(buildIdentifier(order));
        order = orderRepository.save(order);
        return toOrderResponseDTO(order);
    }

    public OrderResponseDTO update(Long id, OrderRequestDTO orderRequestDTO) {
        Order order = toOrderModel(orderRequestDTO);
        order.setId(id);
        order.setIdentifier(buildIdentifier(order));
        order = orderRepository.save(order);
        return toOrderResponseDTO(order);
    }

    private String buildIdentifier(Order order) {
        return "ORD-" + order.getEmissionDate().getYear()
                + String.format("-%06d", order.getId());
    }

    public void delete(Long id) {
        orderRepository.deleteById(id);
    }

    public List<OrderResponseDTO> findAllFiltered(OrderFilterDTO orderFilterDTO) {

        List<Order> orderList = orderRepository.findAll();

        if (orderFilterDTO.getSearch() != null && !orderFilterDTO.getSearch().isBlank()) {
            String term = orderFilterDTO.getSearch().toLowerCase();
            orderList = orderList.stream()
                    .filter(order -> order.getClient().getName().toLowerCase().contains(term))
                    .toList();
        }

        if (orderFilterDTO.getStartDate() != null) {
            orderList = orderList.stream()
                    .filter(order -> !order.getEmissionDate().isBefore(orderFilterDTO.getStartDate()))
                    .toList();
        }
        if (orderFilterDTO.getEndDate() != null) {
            orderList = orderList.stream()
                    .filter(order -> !order.getEmissionDate().isAfter(orderFilterDTO.getEndDate()))
                    .toList();
        }

        if (orderFilterDTO.getItemIds() != null && !orderFilterDTO.getItemIds().isEmpty()) {
            orderList = orderList.stream()
                    .filter(order -> order.getItems().stream()
                            .anyMatch(item -> orderFilterDTO.getItemIds().contains(item.getId())))
                    .toList();
        }

        Comparator<Order> comparator = "emissionDate".equalsIgnoreCase(orderFilterDTO.getSortBy())
                ? Comparator.comparing(Order::getEmissionDate)
                : Comparator.comparing(order -> order.getClient().getName(), String.CASE_INSENSITIVE_ORDER);

        if ("desc".equalsIgnoreCase(orderFilterDTO.getDirection())) {
            comparator = comparator.reversed();
        }

        orderList = orderList.stream().sorted(comparator).toList();

        return orderList.stream()
                .map(this::toOrderResponseDTO)
                .toList();
    }

    public List<OrderResponseDTO> findByClientFiltered(Long clientId, ClientOrderFilterDTO clientOrderFilterDTO) {
        List<Order> orderList = orderRepository.findAll().stream()
                .filter(order -> order.getClient().getId().equals(clientId))
                .toList();

        if (clientOrderFilterDTO.getItemSearch() != null && !clientOrderFilterDTO.getItemSearch().isBlank()) {
            String term = clientOrderFilterDTO.getItemSearch().toLowerCase();
            orderList = orderList.stream()
                    .filter(order -> order.getItems().stream()
                            .anyMatch(item -> item.getName().toLowerCase().contains(term)))
                    .toList();
        }

        Comparator<Order> comparator;
        switch (clientOrderFilterDTO.getSortBy()) {
            case "id" -> comparator = Comparator.comparing(Order::getId);
            case "itemName" -> comparator = Comparator.comparing(order ->
                    order.getItems().stream().findFirst().map(Item::getName).orElse(""), String.CASE_INSENSITIVE_ORDER);
            default -> comparator = Comparator.comparing(Order::getEmissionDate);
        }

        if ("desc".equalsIgnoreCase(clientOrderFilterDTO.getDirection())) {
            comparator = comparator.reversed();
        }

        orderList = orderList.stream().sorted(comparator).toList();

        return orderList.stream()
                .map(this::toOrderResponseDTO)
                .toList();
    }

    public void uploadContract(Long orderId, MultipartFile multipartFile) throws IOException {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        String originalName = Optional.ofNullable(multipartFile.getOriginalFilename())
                .orElseThrow(() -> new IllegalArgumentException("Missing file name"));

        if (!originalName.toLowerCase().matches(".*\\.(pdf|doc|docx)$")) {
            throw new IllegalArgumentException("Invalid file format");
        }

        long maxSize = 10 * 1024 * 1024;
        if (multipartFile.getSize() > maxSize) {
            throw new IllegalArgumentException("File too large");
        }

        String safeName = originalName.replaceAll("[^a-zA-Z0-9.\\- _]", "_");
        Path uploadPath = Paths.get(uploadDir);
        Files.createDirectories(uploadPath);

        Path dest = uploadPath.resolve("order_" + orderId + "_" + System.currentTimeMillis() + "_" + safeName);

        try (InputStream in = multipartFile.getInputStream()) {
            Files.copy(in, dest, StandardCopyOption.REPLACE_EXISTING);
        }

        order.setContractFilePath(dest.toString());
        orderRepository.save(order);
    }

    public File getContractFile(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (order.getContractFilePath() == null) {
            throw new IllegalStateException("No contract uploaded");
        }

        File file = new File(order.getContractFilePath());
        if (!file.exists()) {
            throw new IllegalStateException("Contract file not found");
        }
        return file;
    }

    public void deleteContract(Long orderId) throws IOException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (order.getContractFilePath() != null) {
            File file = new File(order.getContractFilePath());
            if (file.exists()) {
                Files.delete(file.toPath());
            }
            order.setContractFilePath(null);
            orderRepository.save(order);
        }
    }

    private Order toOrderModel(OrderRequestDTO orderRequestDTO) {

        Client client = clientRepository.findById(orderRequestDTO.getClientId())
                .orElseThrow(() -> new IllegalArgumentException("Client not found"));

        Order order = new Order();
        order.setClient(client);
        order.setValue(orderRequestDTO.getValue());
        order.setContractStartDate(orderRequestDTO.getContractStartDate());
        order.setContractEndDate(orderRequestDTO.getContractEndDate());
        order.setInstallmentDay(orderRequestDTO.getInstallmentDay());
        order.setInstallmentCount(orderRequestDTO.getInstallmentCount());
        order.setDiscount(orderRequestDTO.getDiscount());
        order.setEmissionDate(orderRequestDTO.getEmissionDate());
        order.setPaidInstallmentsCount(orderRequestDTO.getPaidInstallmentsCount());
        order.setContractFilePath(orderRequestDTO.getContractFilePath());

        Set<Item> itemSet = orderRequestDTO.getItems().stream()
                .map(itemId -> itemRepository.findById(itemId)
                        .orElseThrow(() -> new IllegalArgumentException("Item id " + itemId + " not found")))
                .collect(Collectors.toSet());

        order.setItems(itemSet);
        return order;
    }

    OrderResponseDTO toOrderResponseDTO(Order order) {
        BigDecimal totalValue = order.getValue();
        BigDecimal discountPercent = order.getDiscount()
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal discountedValue = totalValue.subtract(totalValue.multiply(discountPercent));
        BigDecimal installmentValue = discountedValue
                .divide(BigDecimal.valueOf(order.getInstallmentCount()), 2, RoundingMode.HALF_UP);
        BigDecimal paidValue = installmentValue
                .multiply(BigDecimal.valueOf(order.getPaidInstallmentsCount()));
        BigDecimal remainingValue = discountedValue.subtract(paidValue);

        OrderResponseDTO orderResponseDTO = new OrderResponseDTO();
        orderResponseDTO.setId(order.getId());
        orderResponseDTO.setIdentifier(order.getIdentifier());
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
        orderResponseDTO.setValue(totalValue);
        orderResponseDTO.setDiscountedValue(discountedValue);
        orderResponseDTO.setPaidValue(paidValue);
        orderResponseDTO.setRemainingValue(remainingValue);
        orderResponseDTO.setItems(order.getItems().stream().map(item -> {
            ItemResponseDTO itemResponseDTO = new ItemResponseDTO();
            itemResponseDTO.setId(item.getId());
            itemResponseDTO.setName(item.getName());
            return itemResponseDTO;
        }).collect(Collectors.toSet()));
        return orderResponseDTO;
    }
}
