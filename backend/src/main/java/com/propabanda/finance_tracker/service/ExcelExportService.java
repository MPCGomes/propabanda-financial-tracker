package com.propabanda.finance_tracker.service;

import com.propabanda.finance_tracker.dto.DashboardEvolutionDTO;
import com.propabanda.finance_tracker.dto.ItemPerformanceDTO;
import com.propabanda.finance_tracker.dto.response.ClientResponseDTO;
import com.propabanda.finance_tracker.dto.response.OrderItemResponseDTO;
import com.propabanda.finance_tracker.dto.response.OrderResponseDTO;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExcelExportService {

    public byte[] generateFullReport(
            List<ClientResponseDTO> clientList,
            List<OrderResponseDTO> orderList,
            DashboardEvolutionDTO dashboardEvolutionDTO,
            List<ItemPerformanceDTO> itemPerformanceList) throws IOException {

        try (Workbook workbook = new XSSFWorkbook()) {

            createClientsSheet(workbook, clientList);
            createOrdersSheet(workbook, orderList);
            createDashboardSheet(workbook, dashboardEvolutionDTO);
            createItemPerformanceSheet(workbook, itemPerformanceList);

            try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
                workbook.write(outputStream);
                return outputStream.toByteArray();
            }
        }
    }

    private void createClientsSheet(Workbook workbook, List<ClientResponseDTO> clientList) {
        Sheet sheet = workbook.createSheet("Clientes");
        Row header = sheet.createRow(0);
        String[] columns = {
                "ID", "Nome", "Documento", "Representante",
                "Email", "Telefone", "Cidade", "Estado"
        };
        for (int idx = 0; idx < columns.length; idx++) header.createCell(idx).setCellValue(columns[idx]);

        int rowIndex = 1;
        for (ClientResponseDTO clientResponseDTO : clientList) {
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(clientResponseDTO.getId());
            row.createCell(1).setCellValue(clientResponseDTO.getName());
            row.createCell(2).setCellValue(clientResponseDTO.getDocumentNumber());
            row.createCell(3).setCellValue(clientResponseDTO.getRepresentantResponseDTO().getName());
            row.createCell(4).setCellValue(clientResponseDTO.getRepresentantResponseDTO().getEmail());
            row.createCell(5).setCellValue(clientResponseDTO.getRepresentantResponseDTO().getPhone());
            row.createCell(6).setCellValue(clientResponseDTO.getAddressResponseDTO().getCity());
            row.createCell(7).setCellValue(clientResponseDTO.getAddressResponseDTO().getState());
        }
    }

    private void createOrdersSheet(Workbook workbook, List<OrderResponseDTO> orderList) {
        Sheet sheet = workbook.createSheet("Pedidos");
        Row header = sheet.createRow(0);
        String[] columns = {
                "ID", "Cliente", "Itens", "Emissão", "Início", "Fim",
                "Parcelas", "Pagas", "Desconto %", "Valor Bruto",
                "Valor Líquido", "Valor Pago", "Valor Restante"
        };
        for (int idx = 0; idx < columns.length; idx++) header.createCell(idx).setCellValue(columns[idx]);

        int rowIndex = 1;
        for (OrderResponseDTO orderResponseDTO : orderList) {

            String itemNames = orderResponseDTO.getItems().stream()
                    .map(OrderItemResponseDTO::getItemName)
                    .collect(Collectors.joining(", "));

            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(orderResponseDTO.getId());
            row.createCell(1).setCellValue(orderResponseDTO.getClientName());
            row.createCell(2).setCellValue(itemNames);
            row.createCell(3).setCellValue(orderResponseDTO.getEmissionDate().toString());
            row.createCell(4).setCellValue(orderResponseDTO.getContractStartDate().toString());
            row.createCell(5).setCellValue(orderResponseDTO.getContractEndDate().toString());
            row.createCell(6).setCellValue(orderResponseDTO.getInstallmentCount());
            row.createCell(7).setCellValue(orderResponseDTO.getPaidInstallmentsCount());
            row.createCell(8).setCellValue(orderResponseDTO.getDiscount().toPlainString());
            row.createCell(9).setCellValue(orderResponseDTO.getTotalValue().toPlainString());
            row.createCell(10).setCellValue(orderResponseDTO.getDiscountedValue().toPlainString());
            row.createCell(11).setCellValue(orderResponseDTO.getPaidValue().toPlainString());
            row.createCell(12).setCellValue(orderResponseDTO.getRemainingValue().toPlainString());
        }
    }

    private void createDashboardSheet(Workbook workbook, DashboardEvolutionDTO dto) {
        Sheet sheet = workbook.createSheet("Resumo");
        Row header = sheet.createRow(0);
        Row data = sheet.createRow(1);

        String[] labels = {
                "Saldo Inicial", "Entradas no Período", "Saldo Final",
                "Nº de Pedidos", "Variação (%)"
        };

        header.createCell(0).setCellValue("Indicador");
        header.createCell(1).setCellValue("Valor");

        data.createCell(0).setCellValue(labels[0]);
        data.createCell(1).setCellValue(dto.getInitialBalance().toPlainString());

        sheet.createRow(2).createCell(0).setCellValue(labels[1]);
        sheet.getRow(2).createCell(1).setCellValue(dto.getTotalIncome().toPlainString());

        sheet.createRow(3).createCell(0).setCellValue(labels[2]);
        sheet.getRow(3).createCell(1).setCellValue(dto.getFinalBalance().toPlainString());

        sheet.createRow(4).createCell(0).setCellValue(labels[3]);
        sheet.getRow(4).createCell(1).setCellValue(dto.getTotalOrders());

        sheet.createRow(5).createCell(0).setCellValue(labels[4]);
        sheet.getRow(5).createCell(1).setCellValue(dto.getVariationPercent().toPlainString());
    }

    private void createItemPerformanceSheet(Workbook workbook, List<ItemPerformanceDTO> itemList) {
        Sheet sheet = workbook.createSheet("Performance Itens");
        Row header = sheet.createRow(0);
        String[] columns = {"ID", "Item", "Total (R$)", "% do Total"};
        for (int idx = 0; idx < columns.length; idx++) header.createCell(idx).setCellValue(columns[idx]);

        int rowIndex = 1;
        for (ItemPerformanceDTO itemPerformanceDTO : itemList) {
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(itemPerformanceDTO.getItemId());
            row.createCell(1).setCellValue(itemPerformanceDTO.getItemName());
            row.createCell(2).setCellValue(itemPerformanceDTO.getTotalRevenue().toPlainString());
            row.createCell(3).setCellValue(itemPerformanceDTO.getPercentageOfTotal().toPlainString());
        }
    }
}
