package com.propabanda.finance_tracker.controller;

import com.propabanda.finance_tracker.dto.request.ItemRequestDTO;
import com.propabanda.finance_tracker.dto.response.ItemResponseDTO;
import com.propabanda.finance_tracker.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController (ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    public ResponseEntity<List<ItemResponseDTO>> findAllItems() {
        return ResponseEntity.ok(itemService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponseDTO> findItemById(@PathVariable Long id) {
        return itemService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ItemResponseDTO> createItem(@RequestBody @Valid ItemRequestDTO itemRequestDTO) {
        if (itemService.existsByName(itemRequestDTO.getName())) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(itemService.save(itemRequestDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemResponseDTO> updateItem(@PathVariable Long id, @RequestBody @Valid ItemRequestDTO itemRequestDTO) {
        if (itemService.findModelById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(itemService.update(id, itemRequestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        if (itemService.findModelById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        itemService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
