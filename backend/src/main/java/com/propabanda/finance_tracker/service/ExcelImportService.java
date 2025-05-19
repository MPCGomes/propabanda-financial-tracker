package com.propabanda.finance_tracker.service;

import com.propabanda.finance_tracker.dto.request.AddressRequestDTO;
import com.propabanda.finance_tracker.dto.request.ClientRequestDTO;
import com.propabanda.finance_tracker.dto.request.RepresentativeRequestDTO;
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
import java.time.format.DateTimeFormatter;
import java.util.*;

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

    public List<ClientResponseDTO> importClientsFromExcel(MultipartFile multipartFile) {
        List<ClientResponseDTO> clientResponseDTOList = new ArrayList<>();
        try (InputStream inputStream = multipartFile.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheet("Clientes");
            if (sheet == null) throw new RuntimeException("Aba 'Clientes' não encontrada");

            boolean firstRow = true;
            for (Row row : sheet) {
                if (firstRow) {
                    firstRow = false;
                    continue;
                }

                ClientRequestDTO clientRequestDTO = new ClientRequestDTO();
                clientRequestDTO.setName(getCellValue(row.getCell(0)));
                clientRequestDTO.setDocumentNumber(getCellValue(row.getCell(1)));

                RepresentativeRequestDTO representativeRequestDTO = new RepresentativeRequestDTO();
                representativeRequestDTO.setName(getCellValue(row.getCell(2)));
                representativeRequestDTO.setEmail(getCellValue(row.getCell(3)));
                representativeRequestDTO.setPhone(getCellValue(row.getCell(4)));
                clientRequestDTO.setRepresentativeRequestDTO(representativeRequestDTO);

                AddressRequestDTO addressRequestDTO = new AddressRequestDTO();
                addressRequestDTO.setZipCode(getCellValue(row.getCell(5)));
                addressRequestDTO.setState(getCellValue(row.getCell(6)));
                addressRequestDTO.setCity(getCellValue(row.getCell(7)));
                addressRequestDTO.setNeighbourhood(getCellValue(row.getCell(8)));
                addressRequestDTO.setStreet(getCellValue(row.getCell(9)));
                addressRequestDTO.setNumber(getCellValue(row.getCell(10)));
                addressRequestDTO.setComplement(getCellValue(row.getCell(11)));
                addressRequestDTO.setReference(getCellValue(row.getCell(12)));
                clientRequestDTO.setAddressRequestDTO(addressRequestDTO);

                if (!clientService.existsByDocumentNumber(clientRequestDTO.getDocumentNumber())) {
                    clientResponseDTOList.add(clientService.save(clientRequestDTO));
                }
            }
        } catch (Exception exception) {
            throw new RuntimeException("Erro ao importar clientes: " + exception.getMessage(), exception);
        }
        return clientResponseDTOList;
    }

    public List<OrderResponseDTO> importOrdersFromExcel(MultipartFile multipartFile) {
        List<OrderResponseDTO> orderResponseDTOList = new ArrayList<>();
        try (InputStream inputStream = multipartFile.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheet("Pedidos");
            if (sheet == null) throw new RuntimeException("Aba 'Pedidos' não encontrada");

            boolean firstRow = true;
            for (Row row : sheet) {
                if (firstRow) {
                    firstRow = false;
                    continue;
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
                order.setValue(new BigDecimal(getCellValue(row.getCell(9))));

                Set<Item> itemSet = new HashSet<>();
                for (int index = 10; index < row.getLastCellNum(); index++) {
                    String itemName = getCellValue(row.getCell(index));
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
                orderResponseDTOList.add(orderService.toOrderResponseDTO(orderRepository.save(order)));
            }
        } catch (Exception exception) {
            throw new RuntimeException("Erro ao importar pedidos: " + exception.getMessage(), exception);
        }
        return orderResponseDTOList;
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        DataFormatter fmt = new DataFormatter();
        return fmt.formatCellValue(cell).trim();
    }

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("d/M/uuuu");

    private LocalDate parseDate(Cell cell) {
        if (cell == null) return null;
        if (cell.getCellType() == CellType.NUMERIC) {
            return cell.getLocalDateTimeCellValue().toLocalDate();
        }
        String txt = cell.getStringCellValue().trim();
        return LocalDate.parse(txt, FMT);
    }
}
