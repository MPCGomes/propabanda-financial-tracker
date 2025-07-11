package com.propabanda.finance_tracker.service;

import com.propabanda.finance_tracker.dto.DashboardEvolutionDTO;
import com.propabanda.finance_tracker.dto.ItemPerformanceDTO;
import com.propabanda.finance_tracker.dto.response.ClientResponseDTO;
import com.propabanda.finance_tracker.dto.response.ItemResponseDTO;
import com.propabanda.finance_tracker.dto.response.OrderResponseDTO;
import com.propabanda.finance_tracker.model.ClientStatus;
import org.apache.poi.ss.SpreadsheetVersion;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.AreaReference;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
public class ExcelExportService {

    public byte[] generateFullReport(
            List<ClientResponseDTO> clientList,
            List<OrderResponseDTO> orderList,
            DashboardEvolutionDTO dashboardEvolutionDTO,
            List<ItemPerformanceDTO> itemPerformanceList,
            ClientStatus status
    ) throws IOException {
        try (XSSFWorkbook wb = new XSSFWorkbook()) {
            DataFormat df = wb.createDataFormat();

            if (status != null) {
                clientList = clientList.stream()
                        .filter(c -> c.getStatus() == status)
                        .toList();
            }

            // Fonte e estilos comuns
            XSSFFont arial12 = wb.createFont();
            arial12.setFontName("Arial");
            arial12.setFontHeightInPoints((short) 12);

            XSSFFont headerFont = wb.createFont();
            headerFont.setFontName("Arial");
            headerFont.setFontHeightInPoints((short) 12);
            headerFont.setBold(true);

            CellStyle headerStyle = wb.createCellStyle();
            headerStyle.setFont(headerFont);
            headerStyle.setAlignment(HorizontalAlignment.LEFT);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            CellStyle textStyle = wb.createCellStyle();
            textStyle.setFont(arial12);
            textStyle.setAlignment(HorizontalAlignment.LEFT);
            textStyle.setVerticalAlignment(VerticalAlignment.CENTER);

            CellStyle currencyStyle = wb.createCellStyle();
            currencyStyle.setFont(arial12);
            currencyStyle.setAlignment(HorizontalAlignment.LEFT);
            currencyStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            currencyStyle.setDataFormat(df.getFormat("R$ #,##0.00"));

            CellStyle percentStyle = wb.createCellStyle();
            percentStyle.setFont(arial12);
            percentStyle.setAlignment(HorizontalAlignment.LEFT);
            percentStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            percentStyle.setDataFormat(df.getFormat("0.00%"));

            createClientsSheet(wb, clientList, headerStyle, textStyle);
            createOrdersSheet(wb, orderList, headerStyle, textStyle, currencyStyle, percentStyle);
            createDashboardSheet(wb, dashboardEvolutionDTO, headerStyle, textStyle, currencyStyle, percentStyle);
            createItemPerformanceSheet(wb, itemPerformanceList, headerStyle, textStyle, currencyStyle, percentStyle);

            try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                wb.write(out);
                return out.toByteArray();
            }
        }
    }

    private void createClientsSheet(
            XSSFWorkbook wb,
            List<ClientResponseDTO> list,
            CellStyle headerStyle,
            CellStyle textStyle
    ) {
        XSSFSheet sheet = wb.createSheet("Clientes");
        sheet.setDisplayGridlines(false);
        sheet.setDefaultColumnWidth(25);

        String[] cols = {"ID", "Nome", "Documento", "Representante", "Email", "Telefone", "Cidade", "Estado", "Status"};
        XSSFRow header = sheet.createRow(0);
        for (int i = 0; i < cols.length; i++) {
            XSSFCell c = header.createCell(i);
            c.setCellValue(cols[i]);
            c.setCellStyle(headerStyle);
        }

        int rowIndex = 1;
        for (ClientResponseDTO dto : list) {
            XSSFRow row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(dto.getId());
            row.createCell(1).setCellValue(dto.getName());
            row.createCell(2).setCellValue(dto.getDocumentNumber());
            row.createCell(3).setCellValue(dto.getRepresentativeResponseDTO().getName());
            row.createCell(4).setCellValue(dto.getRepresentativeResponseDTO().getEmail());
            row.createCell(5).setCellValue(dto.getRepresentativeResponseDTO().getPhone());
            row.createCell(6).setCellValue(dto.getAddressResponseDTO().getCity());
            row.createCell(7).setCellValue(dto.getAddressResponseDTO().getState());
            row.createCell(8).setCellValue(dto.getStatus().name());

            for (int i = 0; i < cols.length; i++) {
                row.getCell(i).setCellStyle(textStyle);
            }
        }

        createTableWithStyle(sheet, rowIndex, cols.length, "Clientes");
    }

    private void createOrdersSheet(
            XSSFWorkbook wb,
            List<OrderResponseDTO> list,
            CellStyle headerStyle,
            CellStyle textStyle,
            CellStyle currencyStyle,
            CellStyle percentStyle
    ) {
        XSSFSheet sheet = wb.createSheet("Pedidos");
        sheet.setDisplayGridlines(false);
        sheet.setDefaultColumnWidth(25);

        String[] cols = {
                "ID", "Cliente", "Itens", "Emissão", "Início", "Fim",
                "Parcelas", "Pagas", "Desconto %", "Valor Bruto",
                "Valor Líquido", "Valor Pago", "Valor Restante"
        };
        XSSFRow header = sheet.createRow(0);
        for (int i = 0; i < cols.length; i++) {
            XSSFCell c = header.createCell(i);
            c.setCellValue(cols[i]);
            c.setCellStyle(headerStyle);
        }

        int rowIndex = 1;
        for (OrderResponseDTO dto : list) {
            String items = dto.getItems().stream()
                    .map(ItemResponseDTO::getName)
                    .collect(Collectors.joining(", "));
            XSSFRow row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(dto.getId());
            row.createCell(1).setCellValue(dto.getClientName());
            row.createCell(2).setCellValue(items);
            row.createCell(3).setCellValue(dto.getEmissionDate().toString());
            row.createCell(4).setCellValue(dto.getContractStartDate().toString());
            row.createCell(5).setCellValue(dto.getContractEndDate().toString());
            row.createCell(6).setCellValue(dto.getInstallmentCount());
            row.createCell(7).setCellValue(dto.getPaidInstallmentsCount());

            XSSFCell dCell = row.createCell(8);
            dCell.setCellValue(dto.getDiscount().doubleValue() / 100);
            dCell.setCellStyle(percentStyle);

            XSSFCell vCell = row.createCell(9);
            vCell.setCellValue(dto.getValue().doubleValue());
            vCell.setCellStyle(currencyStyle);

            XSSFCell dvCell = row.createCell(10);
            dvCell.setCellValue(dto.getDiscountedValue().doubleValue());
            dvCell.setCellStyle(currencyStyle);

            XSSFCell pvCell = row.createCell(11);
            pvCell.setCellValue(dto.getPaidValue().doubleValue());
            pvCell.setCellStyle(currencyStyle);

            XSSFCell rvCell = row.createCell(12);
            rvCell.setCellValue(dto.getRemainingValue().doubleValue());
            rvCell.setCellStyle(currencyStyle);

            for (int i = 0; i < 8; i++) {
                row.getCell(i).setCellStyle(textStyle);
            }
        }

        createTableWithStyle(sheet, rowIndex, cols.length, "Pedidos");
    }

    private void createDashboardSheet(
            XSSFWorkbook wb,
            DashboardEvolutionDTO dto,
            CellStyle headerStyle,
            CellStyle textStyle,
            CellStyle currencyStyle,
            CellStyle percentStyle
    ) {
        XSSFSheet sheet = wb.createSheet("Resumo");
        sheet.setDisplayGridlines(false);
        sheet.setDefaultColumnWidth(25);

        String[] indicators = {
                "Saldo Inicial", "Entradas no Período", "Saldo Final",
                "Nº de Pedidos", "Variação (%)"
        };
        XSSFRow header = sheet.createRow(0);
        header.createCell(0).setCellValue("Indicador");
        header.createCell(1).setCellValue("Valor");
        header.getCell(0).setCellStyle(headerStyle);
        header.getCell(1).setCellStyle(headerStyle);

        Object[] vals = {
                dto.getInitialBalance().doubleValue(),
                dto.getTotalIncome().doubleValue(),
                dto.getFinalBalance().doubleValue(),
                dto.getTotalOrders(),
                dto.getVariationPercent().doubleValue() / 100
        };

        for (int i = 0; i < indicators.length; i++) {
            XSSFRow row = sheet.createRow(i + 1);
            row.createCell(0).setCellValue(indicators[i]);
            XSSFCell valCell = row.createCell(1);
            if (i == 3) {
                valCell.setCellValue((Integer) vals[i]);
                valCell.setCellStyle(textStyle);
            } else if (i == 4) {
                valCell.setCellValue((Double) vals[i]);
                valCell.setCellStyle(percentStyle);
            } else {
                valCell.setCellValue((Double) vals[i]);
                valCell.setCellStyle(currencyStyle);
            }
            row.getCell(0).setCellStyle(textStyle);
        }

        createTableWithStyle(sheet, indicators.length + 1, 2, "Resumo");
    }

    private void createItemPerformanceSheet(
            XSSFWorkbook wb,
            List<ItemPerformanceDTO> list,
            CellStyle headerStyle,
            CellStyle textStyle,
            CellStyle currencyStyle,
            CellStyle percentStyle
    ) {
        XSSFSheet sheet = wb.createSheet("Performance Itens");
        sheet.setDisplayGridlines(false);
        sheet.setDefaultColumnWidth(25);

        String[] cols = {"ID", "Item", "Total (R$)", "% do Total"};
        XSSFRow header = sheet.createRow(0);
        for (int i = 0; i < cols.length; i++) {
            XSSFCell c = header.createCell(i);
            c.setCellValue(cols[i]);
            c.setCellStyle(headerStyle);
        }

        int rowIndex = 1;
        for (ItemPerformanceDTO dto : list) {
            XSSFRow row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(dto.getItemId());
            row.createCell(1).setCellValue(dto.getItemName());
            XSSFCell tot = row.createCell(2);
            tot.setCellValue(dto.getTotalRevenue().doubleValue());
            tot.setCellStyle(currencyStyle);
            XSSFCell pct = row.createCell(3);
            pct.setCellValue(dto.getPercentageOfTotal().doubleValue() / 100);
            pct.setCellStyle(percentStyle);
            row.getCell(0).setCellStyle(textStyle);
            row.getCell(1).setCellStyle(textStyle);
        }

        createTableWithStyle(sheet, rowIndex, cols.length, "Performance");
    }

    private void createTableWithStyle(XSSFSheet sheet, int lastRow, int lastCol, String tableName) {
        if (lastRow <= 1) {
            // Need at least one data row to create a table
            return;
        }

        String safeName = tableName.replaceAll("[^a-zA-Z0-9]", "") + UUID.randomUUID().toString().substring(0, 8);

        CellReference topLeft = new CellReference(0, 0);
        CellReference bottomRight = new CellReference(lastRow - 1, lastCol - 1);
        AreaReference areaRef = new AreaReference(topLeft, bottomRight, SpreadsheetVersion.EXCEL2007);

        XSSFTable table = sheet.createTable(areaRef);
        table.setName(safeName);
        table.setDisplayName(safeName);

        // Set table style to Medium 3 (Orange)
        table.setStyleName("TableStyleMedium3");

        // Enable auto-filter
        table.getCTTable().addNewAutoFilter().setRef(areaRef.formatAsString());

        // Set header row
        table.getCTTable().setHeaderRowCount(1);

        // Create columns
        XSSFTableStyleInfo style = (XSSFTableStyleInfo) table.getStyle();
        style.setName("TableStyleMedium3");
        style.setShowColumnStripes(false);
        style.setShowRowStripes(true);
        style.setFirstColumn(false);
        style.setLastColumn(false);
    }
}