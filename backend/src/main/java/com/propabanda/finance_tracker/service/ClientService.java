package com.propabanda.finance_tracker.service;

import com.propabanda.finance_tracker.dto.ClientFilterDTO;
import com.propabanda.finance_tracker.dto.request.AddressRequestDTO;
import com.propabanda.finance_tracker.dto.request.ClientRequestDTO;
import com.propabanda.finance_tracker.dto.request.RepresentantRequestDTO;
import com.propabanda.finance_tracker.dto.response.AddressResponseDTO;
import com.propabanda.finance_tracker.dto.response.ClientResponseDTO;
import com.propabanda.finance_tracker.dto.response.RepresentantResponseDTO;
import com.propabanda.finance_tracker.model.Address;
import com.propabanda.finance_tracker.model.Client;
import com.propabanda.finance_tracker.model.Representant;
import com.propabanda.finance_tracker.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public List<ClientResponseDTO> findAll() {
        return clientRepository.findAll()
                .stream()
                .map(this::toClientResponseDTO)
                .toList();
    }

    public Optional<ClientResponseDTO> findById(Long id) {
        return clientRepository.findById(id).map(this::toClientResponseDTO);
    }

    public Optional<Client> findModelById(Long id) {
        return clientRepository.findById(id);
    }

    public ClientResponseDTO save(ClientRequestDTO clientRequestDTO) {
        Client client = clientRepository.save(toClientModel(clientRequestDTO));
        return toClientResponseDTO(client);
    }

    public ClientResponseDTO update(Long id, ClientRequestDTO clientRequestDTO) {
        Client client = toClientModel(clientRequestDTO);
        client.setId(id);
        client = clientRepository.save(client);
        return toClientResponseDTO(client);
    }

    public void delete(Long id) {
        clientRepository.deleteById(id);
    }

    public boolean existsByDocumentNumber(String documentNumber) {
        return clientRepository.existsByDocumentNumber(documentNumber);
    }

    public List<ClientResponseDTO> findAllFiltered(ClientFilterDTO clientFilterDTO) {
        List<Client> clients = clientRepository.findAll();

        if (clientFilterDTO.getSearch() != null && !clientFilterDTO.getSearch().isBlank()) {
            String term = clientFilterDTO.getSearch().toLowerCase();
            clients = clients.stream()
                    .filter(client -> client.getName().toLowerCase().contains(term))
                    .toList();
        }

        Comparator<Client> comparator = "createdAt".equalsIgnoreCase(clientFilterDTO.getSortBy())
                ? Comparator.comparing(Client::getCreatedAt)
                : Comparator.comparing(Client::getName, String.CASE_INSENSITIVE_ORDER);

        if ("desc".equalsIgnoreCase(clientFilterDTO.getDirection())) {
            comparator = comparator.reversed();
        }

        return clients.stream()
                .sorted(comparator)
                .map(this::toClientResponseDTO)
                .toList();
    }

    private Client toClientModel(ClientRequestDTO clientRequestDTO) {
        Client client = buildClient(clientRequestDTO);

        AddressRequestDTO addressRequestDTO = clientRequestDTO.getAddressRequestDTO();
        Address address = new Address();
        address.setZipCode(addressRequestDTO.getZipCode());
        address.setState(addressRequestDTO.getState());
        address.setCity(addressRequestDTO.getCity());
        address.setNeighbourhood(addressRequestDTO.getNeighbourhood());
        address.setStreet(addressRequestDTO.getStreet());
        address.setNumber(addressRequestDTO.getNumber());
        address.setComplement(addressRequestDTO.getComplement());
        address.setReference(addressRequestDTO.getReference());

        client.setAddress(address);
        return client;
    }

    private static Client buildClient(ClientRequestDTO clientRequestDTO) {
        Client client = new Client();
        client.setName(clientRequestDTO.getName());
        client.setDocumentNumber(clientRequestDTO.getDocumentNumber());

        RepresentantRequestDTO representantRequestDTO = clientRequestDTO.getRepresentantRequestDTO();
        Representant representant = new Representant();
        representant.setName(representantRequestDTO.getName());
        representant.setEmail(representantRequestDTO.getEmail());
        representant.setPhone(representantRequestDTO.getPhone());

        client.setRepresentant(representant);
        return client;
    }

    private ClientResponseDTO toClientResponseDTO(Client client) {
        ClientResponseDTO clientResponseDTO = new ClientResponseDTO();
        clientResponseDTO.setId(client.getId());
        clientResponseDTO.setName(client.getName());
        clientResponseDTO.setDocumentNumber(client.getDocumentNumber());

        RepresentantResponseDTO representantResponseDTO = new RepresentantResponseDTO();
        representantResponseDTO.setName(client.getRepresentant().getName());
        representantResponseDTO.setEmail(client.getRepresentant().getEmail());
        representantResponseDTO.setPhone(client.getRepresentant().getPhone());
        clientResponseDTO.setRepresentantResponseDTO(representantResponseDTO);

        Address address = client.getAddress();
        AddressResponseDTO addressResponseDTO = new AddressResponseDTO();
        addressResponseDTO.setZipCode(address.getZipCode());
        addressResponseDTO.setState(address.getState());
        addressResponseDTO.setCity(address.getCity());
        addressResponseDTO.setNeighbourhood(address.getNeighbourhood());
        addressResponseDTO.setStreet(address.getStreet());
        addressResponseDTO.setNumber(address.getNumber());
        addressResponseDTO.setComplement(address.getComplement());
        addressResponseDTO.setReference(address.getReference());
        clientResponseDTO.setAddressResponseDTO(addressResponseDTO);

        return clientResponseDTO;
    }
}
