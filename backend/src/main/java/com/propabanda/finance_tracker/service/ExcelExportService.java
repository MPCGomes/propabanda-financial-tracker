package com.propabanda.finance_tracker.service;

import com.propabanda.finance_tracker.dto.DashboardEvolutionDTO;
import com.propabanda.finance_tracker.dto.ItemPerformanceDTO;
import com.propabanda.finance_tracker.dto.response.ClientResponseDTO;
import com.propabanda.finance_tracker.dto.response.OrderResponseDTO;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ExcelExportService {

    public byte[] generateFullReport(
            List<ClientResponseDTO> clients,
            List<OrderResponseDTO> orders,
            DashboardEvolutionDTO dashboardEvolution,
            List<ItemPerformanceDTO> itemPerformance
    ) throws IOException {

        try (Workbook workbook = new XSSFWorkbook()) {

            createClientsSheet(workbook, clients);
            createOrdersSheet(workbook, orders);
            createDashboardSheet(workbook, dashboardEvolution);
            createItemPerformanceSheet(workbook, itemPerformance);

            try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
                workbook.write(outputStream);
                return outputStream.toByteArray();
            }
        }
    }

    private void createClientsSheet(Workbook workbook, List<ClientResponseDTO> clients) {
        Sheet sheet = workbook.createSheet("Clientes");
        Row header = sheet.createRow(0);

        String[] columns = {"ID", "Nome", "Documento", "Representante", "Email", "Telefone", "Cidade", "Estado"};
        for (int i = 0; i < columns.length; i++) {
            header.createCell(i).setCellValue(columns[i]);
        }

        int rowIndex = 1;
        for (ClientResponseDTO c : clients) {
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(c.getId());
            row.createCell(1).setCellValue(c.getName());
            row.createCell(2).setCellValue(c.getDocumentNumber());
            row.createCell(3).setCellValue(c.getRepresentantResponseDTO().getName());
            row.createCell(4).setCellValue(c.getRepresentantResponseDTO().getEmail());
            row.createCell(5).setCellValue(c.getRepresentantResponseDTO().getPhone());
            row.createCell(6).setCellValue(c.getAddressResponseDTO().getCity());
            row.createCell(7).setCellValue(c.getAddressResponseDTO().getState());
        }
    }

    private void createOrdersSheet(Workbook workbook, List<OrderResponseDTO> orders) {
        Sheet sheet = workbook.createSheet("Pedidos");
        Row header = sheet.createRow(0);

        String[] columns = {
                "ID", "Cliente", "Emissão", "Início", "Fim", "Parcelas", "Pagas",
                "Desconto %", "Total", "Com Desconto", "Pago", "Restante"
        };
        for (int i = 0; i < columns.length; i++) {
            header.createCell(i).setCellValue(columns[i]);
        }

        int rowIndex = 1;
        for (OrderResponseDTO o : orders) {
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(o.getId());
            row.createCell(1).setCellValue(o.getClientName());
            row.createCell(2).setCellValue(o.getEmissionDate().toString());
            row.createCell(3).setCellValue(o.getContractStartDate().toString());
            row.createCell(4).setCellValue(o.getContractEndDate().toString());
            row.createCell(5).setCellValue(o.getInstallmentCount());
            row.createCell(6).setCellValue(o.getPaidInstallmentsCount());
            row.createCell(7).setCellValue(o.getDiscount().toPlainString());
            row.createCell(8).setCellValue(o.getTotalValue().toPlainString());
            row.createCell(9).setCellValue(o.getDiscountedValue().toPlainString());
            row.createCell(10).setCellValue(o.getPaidValue().toPlainString());
            row.createCell(11).setCellValue(o.getRemainingValue().toPlainString());
        }
    }

    private void createDashboardSheet(Workbook workbook, DashboardEvolutionDTO dash) {
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
        data.createCell(1).setCellValue(dash.getInitialBalance().toPlainString());

        sheet.createRow(2).createCell(0).setCellValue(labels[1]);
        sheet.getRow(2).createCell(1).setCellValue(dash.getTotalIncome().toPlainString());

        sheet.createRow(3).createCell(0).setCellValue(labels[2]);
        sheet.getRow(3).createCell(1).setCellValue(dash.getFinalBalance().toPlainString());

        sheet.createRow(4).createCell(0).setCellValue(labels[3]);
        sheet.getRow(4).createCell(1).setCellValue(dash.getTotalOrders());

        sheet.createRow(5).createCell(0).setCellValue(labels[4]);
        sheet.getRow(5).createCell(1).setCellValue(dash.getVariationPercent().toPlainString());
    }

    private void createItemPerformanceSheet(Workbook workbook, List<ItemPerformanceDTO> items) {
        Sheet sheet = workbook.createSheet("Performance Itens");
        Row header = sheet.createRow(0);

        String[] columns = {"ID", "Item", "Total (R$)", "% do Total"};
        for (int i = 0; i < columns.length; i++) {
            header.createCell(i).setCellValue(columns[i]);
        }

        int rowIndex = 1;
        for (ItemPerformanceDTO i : items) {
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(i.getItemId());
            row.createCell(1).setCellValue(i.getItemName());
            row.createCell(2).setCellValue(i.getTotalRevenue().toPlainString());
            row.createCell(3).setCellValue(i.getPercentageOfTotal().toPlainString());
        }
    }
}
