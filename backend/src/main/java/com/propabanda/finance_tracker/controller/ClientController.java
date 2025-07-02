package com.propabanda.finance_tracker.controller;

import com.propabanda.finance_tracker.dto.ClientFilterDTO;
import com.propabanda.finance_tracker.dto.request.ClientRequestDTO;
import com.propabanda.finance_tracker.dto.response.ClientResponseDTO;
import com.propabanda.finance_tracker.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping
    public ResponseEntity<List<ClientResponseDTO>> findAllClients() {
        return ResponseEntity.ok(clientService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientResponseDTO> findClientById(@PathVariable Long id) {
        return clientService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ClientResponseDTO> createClient(@RequestBody @Valid ClientRequestDTO clientRequestDTO) {
        if (clientService.existsByDocumentNumber(clientRequestDTO.getDocumentNumber())) {
            return ResponseEntity.badRequest().build();
        }

        ClientResponseDTO clientResponseDTO = clientService.save(clientRequestDTO);
        return ResponseEntity.ok(clientResponseDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientResponseDTO> updateClient(@PathVariable Long id, @RequestBody @Valid ClientRequestDTO clientRequestDTO) {
        if (clientService.findModelById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ClientResponseDTO updatedClient = clientService.update(id, clientRequestDTO);
        return ResponseEntity.ok(updatedClient);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        if (clientService.findModelById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        clientService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/filter")
    public ResponseEntity<List<ClientResponseDTO>> filterClients(@RequestBody ClientFilterDTO clientFilterDTO) {
        List<ClientResponseDTO> filtered = clientService.findAllFiltered(clientFilterDTO);
        return ResponseEntity.ok(filtered);
    }
}
