package com.propabanda.finance_tracker.service;

import com.propabanda.finance_tracker.dto.ClientOrderFilterDTO;
import com.propabanda.finance_tracker.dto.OrderFilterDTO;
import com.propabanda.finance_tracker.dto.request.OrderRequestDTO;
import com.propabanda.finance_tracker.dto.response.ItemResponseDTO;
import com.propabanda.finance_tracker.dto.response.OrderItemResponseDTO;
import com.propabanda.finance_tracker.dto.response.OrderResponseDTO;
import com.propabanda.finance_tracker.model.Client;
import com.propabanda.finance_tracker.model.Item;
import com.propabanda.finance_tracker.model.Order;
import com.propabanda.finance_tracker.model.OrderItem;
import com.propabanda.finance_tracker.repository.ClientRepository;
import com.propabanda.finance_tracker.repository.ItemRepository;
import com.propabanda.finance_tracker.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ClientRepository clientRepository;
    private final ItemRepository itemRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

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
                    .filter(order -> order.getOrderItems().stream()
                            .anyMatch(orderItem -> orderItem.getItemName().toLowerCase().contains(term)))
                    .toList();
        }

        Comparator<Order> comparator = getOrderComparator(clientOrderFilterDTO);

        orders = orders.stream().sorted(comparator).toList();

        return orders.stream()
                .map(this::toOrderResponseDTO)
                .toList();
    }

    private static Comparator<Order> getOrderComparator(ClientOrderFilterDTO clientOrderFilterDTO) {
        Comparator<Order> comparator;

        switch (clientOrderFilterDTO.getSortBy()) {
            case "emissionDate" -> comparator = Comparator.comparing(Order::getEmissionDate);
            case "id" -> comparator = Comparator.comparing(Order::getId);
            case "itemName" -> comparator = Comparator.comparing(order ->
                    order.getOrderItems().stream()
                            .findFirst()
                            .map(orderItem -> orderItem.getItemName().toLowerCase())
                            .orElse(""));
            default -> comparator = Comparator.comparing(Order::getEmissionDate);
        }

        if ("desc".equalsIgnoreCase(clientOrderFilterDTO.getDirection())) {
            comparator = comparator.reversed();
        }
        return comparator;
    }


    public void uploadContract(Long orderId, MultipartFile file) throws IOException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        String fileName = file.getOriginalFilename();
        if (fileName == null || !fileName.matches(".*\\.(pdf|doc|docx)$")) {
            throw new IllegalArgumentException("Invalid file format. Only PDF, DOC, DOCX allowed.");
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File too large. Max 10MB.");
        }

        File dir = new File(uploadDir);
        if (!dir.exists() && !dir.mkdirs()) {
            throw new IOException("Failed to create directory: " + uploadDir);
        }

        String finalPath = uploadDir + "/order_" + orderId + "_" + System.currentTimeMillis() + "_" + fileName;
        file.transferTo(new File(finalPath));

        order.setContractFilePath(finalPath);
        orderRepository.save(order);
    }

    public File getContractFile(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (order.getContractFilePath() == null) {
            throw new IllegalStateException("No contract uploaded for this order.");
        }

        File file = new File(order.getContractFilePath());
        if (!file.exists()) {
            throw new IllegalStateException("Contract file not found on server.");
        }

        return file;
    }

    public void deleteContract(Long orderId) throws IOException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (order.getContractFilePath() != null) {
            File file = new File(order.getContractFilePath());

            if (file.exists() && !file.delete()) {
                throw new IOException("Failed to delete contract file: " + file.getAbsolutePath());
            }

            order.setContractFilePath(null);
            orderRepository.save(order);
        }
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

        List<OrderItem> orderItems = items.stream().map(item -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setItem(item);
            orderItem.setItemName(item.getName());
            orderItem.setPriceAtOrder(item.getPrice());
            return orderItem;
        }).toList();

        order.setOrderItems(orderItems);

        return order;
    }


    OrderResponseDTO toOrderResponseDTO(Order order) {
        BigDecimal total = order.getOrderItems().stream()
                .map(OrderItem::getPriceAtOrder)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discountPercent = order.getDiscount().divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal discountedValue = total.subtract(total.multiply(discountPercent));
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

        orderResponseDTO.setTotalValue(total);
        orderResponseDTO.setDiscountedValue(discountedValue);
        orderResponseDTO.setPaidValue(paidValue);
        orderResponseDTO.setRemainingValue(remainingValue);

        orderResponseDTO.setOrderItems(order.getOrderItems().stream().map(orderItem -> {
            OrderItemResponseDTO orderItemResponseDTO = new OrderItemResponseDTO();
            orderItemResponseDTO.setItemId(orderItem.getItem().getId());
            orderItemResponseDTO.setItemName(orderItem.getItemName());
            orderItemResponseDTO.setPriceAtOrder(orderItem.getPriceAtOrder());
            return orderItemResponseDTO;
        }).toList());

        return orderResponseDTO;
    }
}
