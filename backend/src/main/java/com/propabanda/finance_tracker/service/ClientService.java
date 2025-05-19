package com.propabanda.finance_tracker.service;

import com.propabanda.finance_tracker.dto.ClientFilterDTO;
import com.propabanda.finance_tracker.dto.request.AddressRequestDTO;
import com.propabanda.finance_tracker.dto.request.ClientRequestDTO;
import com.propabanda.finance_tracker.dto.request.RepresentativeRequestDTO;
import com.propabanda.finance_tracker.dto.response.AddressResponseDTO;
import com.propabanda.finance_tracker.dto.response.ClientResponseDTO;
import com.propabanda.finance_tracker.dto.response.RepresentativeResponseDTO;
import com.propabanda.finance_tracker.model.Address;
import com.propabanda.finance_tracker.model.Client;
import com.propabanda.finance_tracker.model.Representative;
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

        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));

        client.setName(clientRequestDTO.getName());
        client.setDocumentNumber(clientRequestDTO.getDocumentNumber());

        if (!client.getDocumentNumber().equals(clientRequestDTO.getDocumentNumber()) &&
                existsByDocumentNumber(clientRequestDTO.getDocumentNumber())) {
            throw new IllegalArgumentException("Documento já cadastrado");
        }

        Representative representative = client.getRepresentative();
        representative.setName(clientRequestDTO.getRepresentativeRequestDTO().getName());
        representative.setEmail(clientRequestDTO.getRepresentativeRequestDTO().getEmail());
        representative.setPhone(clientRequestDTO.getRepresentativeRequestDTO().getPhone());

        AddressRequestDTO addressRequestDTO = clientRequestDTO.getAddressRequestDTO();
        Address address = client.getAddress();
        address.setZipCode(addressRequestDTO.getZipCode());
        address.setState(addressRequestDTO.getState());
        address.setCity(addressRequestDTO.getCity());
        address.setNeighbourhood(addressRequestDTO.getNeighbourhood());
        address.setStreet(addressRequestDTO.getStreet());
        address.setNumber(addressRequestDTO.getNumber());
        address.setComplement(addressRequestDTO.getComplement());
        address.setReference(addressRequestDTO.getReference());

        return toClientResponseDTO(clientRepository.save(client));
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

        RepresentativeRequestDTO representativeRequestDTO = clientRequestDTO.getRepresentativeRequestDTO();
        Representative representative = new Representative();
        representative.setName(representativeRequestDTO.getName());
        representative.setEmail(representativeRequestDTO.getEmail());
        representative.setPhone(representativeRequestDTO.getPhone());

        client.setRepresentative(representative);
        return client;
    }

    private ClientResponseDTO toClientResponseDTO(Client client) {
        ClientResponseDTO clientResponseDTO = new ClientResponseDTO();
        clientResponseDTO.setId(client.getId());
        clientResponseDTO.setName(client.getName());
        clientResponseDTO.setDocumentNumber(client.getDocumentNumber());

        RepresentativeResponseDTO representativeResponseDTO = new RepresentativeResponseDTO();
        representativeResponseDTO.setName(client.getRepresentative().getName());
        representativeResponseDTO.setEmail(client.getRepresentative().getEmail());
        representativeResponseDTO.setPhone(client.getRepresentative().getPhone());
        clientResponseDTO.setRepresentativeResponseDTO(representativeResponseDTO);

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
