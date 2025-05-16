package com.propabanda.finance_tracker.service;

import com.propabanda.finance_tracker.dto.request.AddressRequestDTO;
import com.propabanda.finance_tracker.dto.request.ClientRequestDTO;
import com.propabanda.finance_tracker.dto.request.RepresentantRequestDTO;
import com.propabanda.finance_tracker.dto.response.ClientResponseDTO;
import com.propabanda.finance_tracker.dto.response.OrderResponseDTO;
import com.propabanda.finance_tracker.model.Client;
import com.propabanda.finance_tracker.model.Item;
import com.propabanda.finance_tracker.model.Order;
import com.propabanda.finance_tracker.repository.ClientRepository;
import com.propabanda.finance_tracker.repository.ItemRepository;
import com.propabanda.finance_tracker.repository.OrderRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

        List<ClientResponseDTO> importedList = new ArrayList<>();

        try (InputStream in = file.getInputStream();
             Workbook wb = new XSSFWorkbook(in)) {

            Sheet sheet = wb.getSheet("Clientes");
            if (sheet == null) throw new RuntimeException("Aba 'Clientes' não encontrada.");

            boolean header = true;
            for (Row row : sheet) {
                if (header) {
                    header = false;
                    continue;
                }

                ClientRequestDTO clientRequestDTO = new ClientRequestDTO();
                clientRequestDTO.setName(getCell(row, 0));
                clientRequestDTO.setDocumentNumber(getCell(row, 1));

                RepresentantRequestDTO repDTO = new RepresentantRequestDTO();
                repDTO.setName(getCell(row, 2));
                repDTO.setEmail(getCell(row, 3));
                repDTO.setPhone(getCell(row, 4));
                clientRequestDTO.setRepresentantRequestDTO(repDTO);

                AddressRequestDTO addressDTO = new AddressRequestDTO();
                addressDTO.setZipCode(getCell(row, 5));
                addressDTO.setState(getCell(row, 6));
                addressDTO.setCity(getCell(row, 7));
                addressDTO.setNeighbourhood(getCell(row, 8));
                addressDTO.setStreet(getCell(row, 9));
                addressDTO.setNumber(getCell(row, 10));
                addressDTO.setComplement(getCell(row, 11));
                addressDTO.setReference(getCell(row, 12));
                clientRequestDTO.setAddressRequestDTO(addressDTO);

                if (!clientService.existsByDocumentNumber(clientRequestDTO.getDocumentNumber())) {
                    importedList.add(clientService.save(clientRequestDTO));
                }
            }

        } catch (Exception ex) {
            throw new RuntimeException("Erro ao importar clientes: " + ex.getMessage(), ex);
        }
        return importedList;
    }

    public List<OrderResponseDTO> importOrdersFromExcel(MultipartFile file) {

        List<OrderResponseDTO> importedList = new ArrayList<>();

        try (InputStream in = file.getInputStream();
             Workbook wb = new XSSFWorkbook(in)) {

            Sheet sheet = wb.getSheet("Pedidos");
            if (sheet == null) throw new RuntimeException("Aba 'Pedidos' não encontrada.");

            boolean header = true;
            for (Row row : sheet) {
                if (header) {
                    header = false;
                    continue;
                }

                String clientDoc = getCell(row, 0);
                Client client = clientRepository.findByDocumentNumber(clientDoc)
                        .orElseThrow(() -> new RuntimeException("Cliente não encontrado: " + clientDoc));

                Order order = new Order();
                order.setClient(client);
                order.setEmissionDate(parseDate(row.getCell(1)));
                order.setContractStartDate(parseDate(row.getCell(2)));
                order.setContractEndDate(parseDate(row.getCell(3)));
                order.setInstallmentDay(Integer.parseInt(getCell(row, 4)));
                order.setInstallmentCount(Integer.parseInt(getCell(row, 5)));
                order.setDiscount(new BigDecimal(getCell(row, 6)));
                order.setPaidInstallmentsCount(Integer.parseInt(getCell(row, 7)));
                order.setContractFilePath(getCell(row, 8));

                BigDecimal value = new BigDecimal(getCell(row, 9));
                order.setValue(value);

                Set<Item> itemSet = new HashSet<>();
                for (int col = 10; col < row.getLastCellNum(); col++) {
                    String itemName = getCell(row, col);
                    if (itemName.isBlank()) continue;

                    Item item = itemRepository.findByNameIgnoreCase(itemName)
                            .orElseGet(() -> {
                                Item newItem = new Item();
                                newItem.setName(itemName);
                                return itemRepository.save(newItem);
                            });
                    itemSet.add(item);
                }
                order.setItems(itemSet);

                importedList.add(orderService.toOrderResponseDTO(orderRepository.save(order)));
            }

        } catch (Exception ex) {
            throw new RuntimeException("Erro ao importar pedidos: " + ex.getMessage(), ex);
        }
        return importedList;
    }

    private String getCell(Row row, int col) {
        Cell cell = row.getCell(col);
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf(cell.getNumericCellValue()).replace(".0", "");
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
}
