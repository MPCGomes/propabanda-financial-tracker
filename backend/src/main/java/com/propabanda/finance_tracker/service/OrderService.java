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
import java.io.InputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ClientRepository clientRepository;
    private final ItemRepository itemRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public OrderService(OrderRepository orderRepository,
                        ClientRepository clientRepository,
                        ItemRepository itemRepository) {
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
        return toOrderResponseDTO(orderRepository.save(order));
    }

    public OrderResponseDTO update(Long id, OrderRequestDTO orderRequestDTO) {
        Order order = toOrderModel(orderRequestDTO);
        order.setId(id);
        return toOrderResponseDTO(orderRepository.save(order));
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

        if (orderFilterDTO.getStartDate() != null) {
            orders = orders.stream()
                    .filter(order -> !order.getEmissionDate().isBefore(orderFilterDTO.getStartDate()))
                    .toList();
        }

        if (orderFilterDTO.getEndDate() != null) {
            orders = orders.stream()
                    .filter(order -> !order.getEmissionDate().isAfter(orderFilterDTO.getEndDate()))
                    .toList();
        }

        if (orderFilterDTO.getItemIds() != null && !orderFilterDTO.getItemIds().isEmpty()) {
            orders = orders.stream()
                    .filter(order -> order.getItems().stream()
                            .anyMatch(item -> orderFilterDTO.getItemIds().contains(item.getId())))
                    .toList();
        }

        Comparator<Order> comparator = "emissionDate".equalsIgnoreCase(orderFilterDTO.getSortBy())
                ? Comparator.comparing(Order::getEmissionDate)
                : Comparator.comparing(order -> order.getClient().getName(), String.CASE_INSENSITIVE_ORDER);

        if ("desc".equalsIgnoreCase(orderFilterDTO.getDirection())) comparator = comparator.reversed();

        return orders.stream().sorted(comparator).map(this::toOrderResponseDTO).toList();
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

        Comparator<Order> comparator = switch (clientOrderFilterDTO.getSortBy()) {
            case "emissionDate" -> Comparator.comparing(Order::getEmissionDate);
            case "id" -> Comparator.comparing(Order::getId);
            case "itemName" -> Comparator.comparing(order -> order.getItems().stream()
                    .findFirst().map(Item::getName).orElse(""));
            default -> Comparator.comparing(Order::getEmissionDate);
        };

        if ("desc".equalsIgnoreCase(clientOrderFilterDTO.getDirection())) comparator = comparator.reversed();

        return orders.stream().sorted(comparator).map(this::toOrderResponseDTO).toList();
    }

    public void uploadContract(Long orderId, MultipartFile file) throws Exception {
        Order order = orderRepository.findById(orderId).orElseThrow();
        String originalName = Objects.requireNonNull(file.getOriginalFilename());
        if (!originalName.toLowerCase().matches(".*\\.(pdf|doc|docx)$")) {
            throw new IllegalArgumentException("Invalid format");
        }
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File too large");
        }
        String safeName = originalName.replaceAll("[^a-zA-Z0-9.\\-_]", "_");
        Path uploadPath = Paths.get(uploadDir);
        Files.createDirectories(uploadPath);
        Path dest = uploadPath.resolve("order_" + orderId + "_" + System.currentTimeMillis() + "_" + safeName);
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, dest, StandardCopyOption.REPLACE_EXISTING);
        }
        order.setContractFilePath(dest.toString());
        orderRepository.save(order);
    }

    public File getContractFile(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        return new File(order.getContractFilePath());
    }

    public void deleteContract(Long orderId) throws Exception {
        Order order = orderRepository.findById(orderId).orElseThrow();
        if (order.getContractFilePath() != null) {
            File file = new File(order.getContractFilePath());
            if (file.exists()) Files.delete(file.toPath());
            order.setContractFilePath(null);
            orderRepository.save(order);
        }
    }

    /* ---------- helpers -------------------------------------------- */
    private Order toOrderModel(OrderRequestDTO dto) {
        Client client = clientRepository.findById(dto.getClientId()).orElseThrow();
        Order order = new Order();
        order.setClient(client);
        order.setContractStartDate(dto.getContractStartDate());
        order.setContractEndDate(dto.getContractEndDate());
        order.setInstallmentDay(dto.getInstallmentDay());
        order.setInstallmentCount(dto.getInstallmentCount());
        order.setDiscount(dto.getDiscount());
        order.setEmissionDate(dto.getEmissionDate());
        order.setPaidInstallmentsCount(dto.getPaidInstallmentsCount());
        order.setContractFilePath(dto.getContractFilePath());
        order.setValue(dto.getValue());
        Set<Item> items = dto.getItems().stream()
                .map(id -> itemRepository.findById(id).orElseThrow())
                .collect(Collectors.toSet());
        order.setItems(items);
        return order;
    }

    OrderResponseDTO toOrderResponseDTO(Order order) {
        BigDecimal discountPercent = order.getDiscount().divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal discounted = order.getValue().subtract(order.getValue().multiply(discountPercent));
        BigDecimal installmentValue = discounted.divide(BigDecimal.valueOf(order.getInstallmentCount()), 2, RoundingMode.HALF_UP);
        BigDecimal paid = installmentValue.multiply(BigDecimal.valueOf(order.getPaidInstallmentsCount()));
        BigDecimal remaining = discounted.subtract(paid);

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
        orderResponseDTO.setValue(order.getValue());
        orderResponseDTO.setDiscountedValue(discounted);
        orderResponseDTO.setPaidValue(paid);
        orderResponseDTO.setRemainingValue(remaining);
        orderResponseDTO.setItems(order.getItems().stream().map(this::toItemDTO).collect(Collectors.toSet()));
        return orderResponseDTO;
    }

    private ItemResponseDTO toItemDTO(Item item) {
        ItemResponseDTO itemResponseDTO = new ItemResponseDTO();
        itemResponseDTO.setId(item.getId());
        itemResponseDTO.setName(item.getName());
        return itemResponseDTO;
    }
}
