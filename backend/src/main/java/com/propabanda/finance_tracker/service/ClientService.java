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
import java.util.stream.Collectors;

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
                .collect(Collectors.toList());
    }

    public Optional<ClientResponseDTO> findById(Long id) {
        return clientRepository.findById(id).map(this::toClientResponseDTO);
    }

    public Optional<Client> findModelById(Long id) {
        return clientRepository.findById(id);
    }

    public ClientResponseDTO save(ClientRequestDTO clientRequestDTO) {
        Client client = toClientModel(clientRequestDTO);
        client = clientRepository.save(client);
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
        List <Client> clients = clientRepository.findAll();

        if (clientFilterDTO.getSearch() != null & !clientFilterDTO.getSearch().isBlank()) {
            String term = clientFilterDTO.getSearch().toLowerCase();
            clients = clients.stream()
                    .filter(client -> client.getName().toLowerCase().contains(term))
                    .toList();
        }

        Comparator<Client> comparator;

        if ("createdAt".equalsIgnoreCase(clientFilterDTO.getSortBy())) {
            comparator = Comparator.comparing(Client::getCreatedAt);
        } else {
            comparator = Comparator.comparing(Client::getName, String.CASE_INSENSITIVE_ORDER);
        }

        if ("desc".equalsIgnoreCase(clientFilterDTO.getDirection())) {
            comparator = comparator.reversed();
        }

        clients = clients.stream().sorted(comparator).toList();

        return clients.stream()
                .map(this::toClientResponseDTO)
                .toList();
    }

    private Client toClientModel(ClientRequestDTO clientRequestDTO) {
        Client client = getClient(clientRequestDTO);

        Address address = new Address();
        AddressRequestDTO addressRequestDTO = clientRequestDTO.getAddressRequestDTO();
        address.setZipCode(addressRequestDTO.getZipCode());
        address.setState(addressRequestDTO.getState());
        address.setCity(addressRequestDTO.getCity());
        address.setStreet(addressRequestDTO.getStreet());
        address.setNumber(addressRequestDTO.getNumber());
        address.setComplement(addressRequestDTO.getComplement());
        address.setReference(addressRequestDTO.getReference());

        return client;
    }

    private static Client getClient(ClientRequestDTO clientRequestDTO) {
        Client client = new Client();
        client.setName(clientRequestDTO.getName());
        client.setDocumentNumber(clientRequestDTO.getDocumentNumber());

        Representant representant = new Representant();
        RepresentantRequestDTO representantRequestDTO = clientRequestDTO.getRepresentantRequestDTO();
        representant.setName(representantRequestDTO.getName());
        representant.setEmail(representantRequestDTO.getEmail());
        representant.setPhone(representantRequestDTO.getPhone());
        client.setRepresentant(representant);
        return client;
    }

    private  ClientResponseDTO toClientResponseDTO(Client client) {
        ClientResponseDTO clientResponseDTO = new ClientResponseDTO();
        clientResponseDTO.setId(client.getId());
        clientResponseDTO.setName(client.getName());
        clientResponseDTO.setDocumentNumber(client.getDocumentNumber());

        RepresentantResponseDTO representantResponseDTO = new RepresentantResponseDTO();
        representantResponseDTO.setName(client.getRepresentant().getName());
        representantResponseDTO.setEmail(client.getRepresentant().getEmail());
        representantResponseDTO.setPhone(client.getRepresentant().getPhone());
        clientResponseDTO.setRepresentantResponseDTO(representantResponseDTO);

        AddressResponseDTO addressResponseDTO = new AddressResponseDTO();
        addressResponseDTO.setZipCode(client.getAddress().getZipCode());
        addressResponseDTO.setState(client.getAddress().getState());
        addressResponseDTO.setCity(client.getAddress().getCity());
        addressResponseDTO.setNeighbourhood(client.getAddress().getNeighbourhood());
        addressResponseDTO.setStreet(client.getAddress().getStreet());
        addressResponseDTO.setNumber(client.getAddress().getNumber());
        addressResponseDTO.setComplement(client.getAddress().getComplement());
        addressResponseDTO.setReference(client.getAddress().getReference());
        clientResponseDTO.setAddressResponseDTO(addressResponseDTO);

        return clientResponseDTO;
   }
}
