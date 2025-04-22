package com.propabanda.finance_tracker.service;

import com.propabanda.finance_tracker.dto.request.ItemRequestDTO;
import com.propabanda.finance_tracker.dto.response.ItemResponseDTO;
import com.propabanda.finance_tracker.model.Item;
import com.propabanda.finance_tracker.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<ItemResponseDTO> findAll() {
        return itemRepository.findAll().stream()
                .map(this::toItemResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<ItemResponseDTO> findById(Long id) {
        return itemRepository.findById(id)
                .map(this::toItemResponseDTO);
    }

    public Optional<Item> findModelById(Long id) {
        return itemRepository.findById(id);
    }

    public ItemResponseDTO save(ItemRequestDTO itemRequestDTO) {
        Item item = toItemModel(itemRequestDTO);
        item = itemRepository.save(item);
        return toItemResponseDTO(item);
    }

    public ItemResponseDTO update(Long id, ItemRequestDTO itemRequestDTO) {
        Item item = toItemModel(itemRequestDTO);
        item.setId(id);
        item = itemRepository.save(item);
        return toItemResponseDTO(item);
    }

    public void delete(Long id) {
        itemRepository.deleteById(id);
    }

    public boolean existsByName(String name) {
        return itemRepository.existsByName(name);
    }

    private Item toItemModel(ItemRequestDTO itemRequestDTO) {
        Item item = new Item();
        item.setName(itemRequestDTO.getName());
        item.setPrice(itemRequestDTO.getPrice());
        return item;
    }

    private ItemResponseDTO toItemResponseDTO(Item item) {
        ItemResponseDTO itemResponseDTO = new ItemResponseDTO();
        itemResponseDTO.setId(item.getId());
        itemResponseDTO.setName(item.getName());
        itemResponseDTO.setPrice(item.getPrice());
        return itemResponseDTO;
    }
}
