package com.propabanda.finance_tracker.service;

import com.propabanda.finance_tracker.dto.request.AddressRequestDTO;
import com.propabanda.finance_tracker.dto.request.ClientRequestDTO;
import com.propabanda.finance_tracker.dto.request.RepresentantRequestDTO;
import com.propabanda.finance_tracker.dto.response.ClientResponseDTO;
import com.propabanda.finance_tracker.dto.response.OrderResponseDTO;
import com.propabanda.finance_tracker.model.Client;
import com.propabanda.finance_tracker.model.Item;
import com.propabanda.finance_tracker.model.Order;
import com.propabanda.finance_tracker.model.OrderItem;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.propabanda.finance_tracker.repository.ClientRepository;
import com.propabanda.finance_tracker.repository.ItemRepository;
import com.propabanda.finance_tracker.repository.OrderRepository;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExcelImportService {

    private final ClientService clientService;
    private final ClientRepository clientRepository;
    private final OrderRepository orderRepository;
    private final ItemRepository itemRepository;
    private final OrderService orderService;

    public ExcelImportService(ClientService clientService,
                              ClientRepository clientRepository,
                              OrderRepository orderRepository,
                              ItemRepository itemRepository,
                              OrderService orderService) {
        this.clientService = clientService;
        this.clientRepository = clientRepository;
        this.orderRepository = orderRepository;
        this.itemRepository = itemRepository;
        this.orderService = orderService;
    }

    public List<ClientResponseDTO> importClientsFromExcel(MultipartFile file) {
        List<ClientResponseDTO> importedClients = new ArrayList<>();

        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheet("Clientes");
            if (sheet == null) throw new RuntimeException("Aba 'Clientes' não encontrada.");

            boolean isFirstRow = true;
            for (Row row : sheet) {
                if (isFirstRow) {
                    isFirstRow = false;
                    continue; // skip header
                }

                ClientRequestDTO clientRequest = new ClientRequestDTO();
                clientRequest.setName(getCellValue(row.getCell(0)));
                clientRequest.setDocumentNumber(getCellValue(row.getCell(1)));

                RepresentantRequestDTO representant = new RepresentantRequestDTO();
                representant.setName(getCellValue(row.getCell(2)));
                representant.setEmail(getCellValue(row.getCell(3)));
                representant.setPhone(getCellValue(row.getCell(4)));
                clientRequest.setRepresentantRequestDTO(representant);

                AddressRequestDTO address = new AddressRequestDTO();
                address.setZipCode(getCellValue(row.getCell(5)));
                address.setState(getCellValue(row.getCell(6)));
                address.setCity(getCellValue(row.getCell(7)));
                address.setNeighbourhood(getCellValue(row.getCell(8)));
                address.setStreet(getCellValue(row.getCell(9)));
                address.setNumber(getCellValue(row.getCell(10)));
                address.setComplement(getCellValue(row.getCell(11)));
                address.setReference(getCellValue(row.getCell(12)));
                clientRequest.setAddressRequestDTO(address);

                if (!clientService.existsByDocumentNumber(clientRequest.getDocumentNumber())) {
                    importedClients.add(clientService.save(clientRequest));
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Erro ao importar clientes: " + e.getMessage(), e);
        }

        return importedClients;
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> "";
        };
    }

    private LocalDate parseDate(Cell cell) {
        if (cell == null) return null;
        if (cell.getCellType() == CellType.NUMERIC) {
            return cell.getLocalDateTimeCellValue().toLocalDate();
        }
        return LocalDate.parse(cell.getStringCellValue());
    }

    public List<OrderResponseDTO> importOrdersFromExcel(MultipartFile file) {
        List<OrderResponseDTO> importedOrders = new ArrayList<>();

        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheet("Pedidos");
            if (sheet == null) throw new RuntimeException("Aba 'Pedidos' não encontrada.");

            boolean isFirstRow = true;
            for (Row row : sheet) {
                if (isFirstRow) {
                    isFirstRow = false;
                    continue; // skip header
                }

                String documentNumber = getCellValue(row.getCell(0));
                Client client = clientRepository.findByDocumentNumber(documentNumber)
                        .orElseThrow(() -> new RuntimeException("Cliente não encontrado: " + documentNumber));

                Order order = new Order();
                order.setClient(client);
                order.setEmissionDate(parseDate(row.getCell(1)));
                order.setContractStartDate(parseDate(row.getCell(2)));
                order.setContractEndDate(parseDate(row.getCell(3)));
                order.setInstallmentDay(Integer.parseInt(getCellValue(row.getCell(4))));
                order.setInstallmentCount(Integer.parseInt(getCellValue(row.getCell(5))));
                order.setDiscount(new BigDecimal(getCellValue(row.getCell(6))));
                order.setPaidInstallmentsCount(Integer.parseInt(getCellValue(row.getCell(7))));
                order.setContractFilePath(getCellValue(row.getCell(8)));

                List<OrderItem> orderItems = new ArrayList<>();
                for (int i = 9; i < row.getLastCellNum(); i += 2) {
                    String itemName = getCellValue(row.getCell(i));
                    if (itemName.isBlank()) continue;

                    BigDecimal price = new BigDecimal(getCellValue(row.getCell(i + 1)));
                    Item item = itemRepository.findByNameIgnoreCase(itemName).orElseGet(() -> {
                        Item newItem = new Item();
                        newItem.setName(itemName);
                        newItem.setPrice(price); // current price
                        return itemRepository.save(newItem);
                    });

                    OrderItem orderItem = new OrderItem();
                    orderItem.setItem(item);
                    orderItem.setItemName(itemName);
                    orderItem.setPriceAtOrder(price);
                    orderItem.setOrder(order);
                    orderItems.add(orderItem);
                }

                order.setOrderItems(orderItems);
                importedOrders.add(orderService.toOrderResponseDTO(orderRepository.save(order)));
            }

        } catch (Exception e) {
            throw new RuntimeException("Erro ao importar pedidos: " + e.getMessage(), e);
        }

        return importedOrders;
    }
}
