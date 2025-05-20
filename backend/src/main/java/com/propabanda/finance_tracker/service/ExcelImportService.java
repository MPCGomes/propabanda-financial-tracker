package com.propabanda.finance_tracker.service;

import com.propabanda.finance_tracker.dto.request.AddressRequestDTO;
import com.propabanda.finance_tracker.dto.request.ClientRequestDTO;
import com.propabanda.finance_tracker.dto.request.RepresentativeRequestDTO;
import com.propabanda.finance_tracker.model.Client;
import com.propabanda.finance_tracker.model.Item;
import com.propabanda.finance_tracker.model.Order;
import com.propabanda.finance_tracker.repository.ClientRepository;
import com.propabanda.finance_tracker.repository.ItemRepository;
import com.propabanda.finance_tracker.repository.OrderRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.math.BigDecimal;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.Set;

@Service
public class ExcelImportService {

    private final ClientService clientService;
    private final ClientRepository clientRepository;
    private final OrderService orderService;
    private final OrderRepository orderRepository;
    private final ItemRepository itemRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("d/M/uuuu");

    @Value("${file.upload-dir}")
    private String uploadDir;

    public ExcelImportService(ClientService clientService,
                              ClientRepository clientRepository,
                              OrderService orderService,
                              OrderRepository orderRepository,
                              ItemRepository itemRepository) {
        this.clientService = clientService;
        this.clientRepository = clientRepository;
        this.orderService = orderService;
        this.orderRepository = orderRepository;
        this.itemRepository = itemRepository;
    }

    @Transactional
    public void importFromExcel(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {
            importClients(workbook);
            importOrders(workbook);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao importar Excel: " + e.getMessage(), e);
        }
    }

    private void importClients(Workbook workbook) {
        Sheet clientsSheet = workbook.getSheet("Clientes");
        if (clientsSheet == null) throw new RuntimeException("Aba 'Clientes' não encontrada");
        boolean firstRow = true;
        for (Row row : clientsSheet) {
            if (firstRow) {
                firstRow = false;
                continue;
            }
            String clientName = getCellValue(row.getCell(0));
            String clientDocumentNumber = getCellValue(row.getCell(1));
            if (clientService.existsByDocumentNumber(clientDocumentNumber)) continue;
            RepresentativeRequestDTO representativeRequestDTO = new RepresentativeRequestDTO();
            representativeRequestDTO.setName(getCellValue(row.getCell(2)));
            representativeRequestDTO.setEmail(getCellValue(row.getCell(3)));
            representativeRequestDTO.setPhone(getCellValue(row.getCell(4)));
            AddressRequestDTO addressRequestDTO = new AddressRequestDTO();
            addressRequestDTO.setZipCode(getCellValue(row.getCell(5)));
            addressRequestDTO.setState(getCellValue(row.getCell(6)));
            addressRequestDTO.setCity(getCellValue(row.getCell(7)));
            addressRequestDTO.setNeighbourhood(getCellValue(row.getCell(8)));
            addressRequestDTO.setStreet(getCellValue(row.getCell(9)));
            addressRequestDTO.setNumber(getCellValue(row.getCell(10)));
            addressRequestDTO.setComplement(getCellValue(row.getCell(11)));
            addressRequestDTO.setReference(getCellValue(row.getCell(12)));
            ClientRequestDTO clientRequestDTO = new ClientRequestDTO();
            clientRequestDTO.setName(clientName);
            clientRequestDTO.setDocumentNumber(clientDocumentNumber);
            clientRequestDTO.setRepresentativeRequestDTO(representativeRequestDTO);
            clientRequestDTO.setAddressRequestDTO(addressRequestDTO);
            clientService.save(clientRequestDTO);
        }
    }

    private void importOrders(Workbook workbook) {
        Sheet ordersSheet = workbook.getSheet("Pedidos");
        if (ordersSheet == null) throw new RuntimeException("Aba 'Pedidos' não encontrada");

        boolean firstRow = true;
        for (Row row : ordersSheet) {
            if (firstRow) {
                firstRow = false;
                continue;
            }
            String clientDocumentNumber = getCellValue(row.getCell(0));
            Client client = clientRepository.findByDocumentNumber(clientDocumentNumber)
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado: " + clientDocumentNumber));
            LocalDate emissionDate = parseDate(row.getCell(1));
            LocalDate contractStartDate = parseDate(row.getCell(2));
            LocalDate contractEndDate = parseDate(row.getCell(3));
            int installmentDay = Integer.parseInt(getCellValue(row.getCell(4)));
            int installmentCount = Integer.parseInt(getCellValue(row.getCell(5)));
            BigDecimal discount = new BigDecimal(getCellValue(row.getCell(6)));
            int paidInstallments = Integer.parseInt(getCellValue(row.getCell(7)));
            String fileName = getCellValue(row.getCell(8));
            String contractFilePath = Paths
                    .get(uploadDir, fileName)
                    .toAbsolutePath()
                    .toString();
            BigDecimal totalValue = new BigDecimal(getCellValue(row.getCell(9)));
            Set<Item> items = new HashSet<>();
            for (int i = 10; i < row.getLastCellNum(); i++) {
                String itemName = getCellValue(row.getCell(i));
                if (itemName.isBlank()) continue;
                Item item = itemRepository.findByNameIgnoreCase(itemName)
                        .orElseGet(() -> {
                            Item newItem = new Item();
                            newItem.setName(itemName);
                            return itemRepository.save(newItem);
                        });
                items.add(item);
            }
            Order order = new Order();
            order.setClient(client);
            order.setEmissionDate(emissionDate);
            order.setContractStartDate(contractStartDate);
            order.setContractEndDate(contractEndDate);
            order.setInstallmentDay(installmentDay);
            order.setInstallmentCount(installmentCount);
            order.setDiscount(discount);
            order.setPaidInstallmentsCount(paidInstallments);

            order.setContractFilePath(contractFilePath);

            order.setValue(totalValue);
            order.setItems(items);

            orderRepository.save(order);
        }
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        return new DataFormatter().formatCellValue(cell).trim();
    }

    private LocalDate parseDate(Cell cell) {
        if (cell == null) return null;
        if (cell.getCellType() == CellType.NUMERIC) {
            return cell.getLocalDateTimeCellValue().toLocalDate();
        }
        return LocalDate.parse(cell.getStringCellValue().trim(), DATE_FORMATTER);
    }
}
