package com.propabanda.finance_tracker.controller;

import com.propabanda.finance_tracker.dto.ClientOrderFilterDTO;
import com.propabanda.finance_tracker.dto.OrderFilterDTO;
import com.propabanda.finance_tracker.dto.request.OrderRequestDTO;
import com.propabanda.finance_tracker.dto.response.OrderResponseDTO;
import com.propabanda.finance_tracker.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> findAllOrders() {
        return ResponseEntity.ok(orderService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> findOrderById(@PathVariable Long id) {
        return orderService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(@RequestBody @Valid OrderRequestDTO orderRequestDTO) {
        return ResponseEntity.ok(orderService.save(orderRequestDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> updateOrder(@PathVariable Long id, @RequestBody @Valid OrderRequestDTO orderRequestDTO) {
        if (orderService.findModelById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(orderService.update(id, orderRequestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        if (orderService.findModelById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/filter")
    public ResponseEntity<List<OrderResponseDTO>> filterOrders(@RequestBody OrderFilterDTO orderFilterDTO) {
        List<OrderResponseDTO> filtered = orderService.findAllFiltered(orderFilterDTO);
        return ResponseEntity.ok(filtered);
    }

    @PostMapping("/client/{clientId}/filter")
    public ResponseEntity<List<OrderResponseDTO>> filterOrdersByClient(
            @PathVariable Long clientId,
            @RequestBody ClientOrderFilterDTO clientOrderFilterDTO
    ) {
        List<OrderResponseDTO> filtered = orderService.findByClientFiltered(clientId, clientOrderFilterDTO);
        return ResponseEntity.ok(filtered);
    }


}
