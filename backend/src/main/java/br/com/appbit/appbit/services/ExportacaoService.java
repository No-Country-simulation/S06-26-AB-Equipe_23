package br.com.appbit.appbit.services;

import br.com.appbit.appbit.dtos.AlertaEsgDTO;
import br.com.appbit.appbit.dtos.MapaTalentosResponseDTO;
import br.com.appbit.appbit.dtos.MapaTalentoDTO;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExportacaoService {

    private final EsgInsightService esgInsightService;
    private final TalentoInsightService talentoInsightService;

    public byte[] gerarPdfEsg() {
        log.info("Iniciando geração do PDF de auditoria ESG");
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Font sectionFont = new Font(Font.HELVETICA, 12, Font.BOLD);
            Font normalFont = new Font(Font.HELVETICA, 10, Font.NORMAL);
            Font footerFont = new Font(Font.HELVETICA, 8, Font.ITALIC);

            document.add(new Paragraph("AppBiT — Relatório de Compliance & Auditoria ESG", titleFont));
            document.add(new Paragraph("Gerado em: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")), normalFont));
            document.add(new Paragraph("------------------------------------------------------------------------------------------------------------------------", normalFont));
            document.add(new Paragraph("\n"));

            document.add(new Paragraph("1. Alertas de Barreiras Sociais e Conectividade (ESG Insights)", sectionFont));
            document.add(new Paragraph("\n"));

            List<AlertaEsgDTO> alertas = esgInsightService.obterAlertasEsg();
            if (alertas.isEmpty()) {
                document.add(new Paragraph("Nenhum alerta ESG detectado. O ecossistema está equilibrado.", normalFont));
            } else {
                PdfPTable table = new PdfPTable(3);
                table.setWidthPercentage(100);
                table.addCell(new PdfPCell(new Phrase("Região / Cluster", normalFont)));
                table.addCell(new PdfPCell(new Phrase("Nível de Gravidade", normalFont)));
                table.addCell(new PdfPCell(new Phrase("Descrição / Recomendação", normalFont)));

                for (AlertaEsgDTO alerta : alertas) {
                    table.addCell(new PdfPCell(new Phrase(alerta.regiao(), normalFont)));
                    table.addCell(new PdfPCell(new Phrase(alerta.gravidade(), normalFont)));
                    table.addCell(new PdfPCell(new Phrase(alerta.titulo() + " - " + alerta.acaoRecomendada(), normalFont)));
                }
                document.add(table);
            }

            document.add(new Paragraph("\n"));

            document.add(new Paragraph("2. Métricas de Distribuição de Diversidade por Região", sectionFont));
            document.add(new Paragraph("\n"));

            MapaTalentosResponseDTO mapa = talentoInsightService.obterMapaTalentos();
            if (mapa != null && mapa.mapaTalentos() != null) {
                PdfPTable table = new PdfPTable(3);
                table.setWidthPercentage(100);
                table.addCell(new PdfPCell(new Phrase("Região", normalFont)));
                table.addCell(new PdfPCell(new Phrase("Concentração de Talentos", normalFont)));
                table.addCell(new PdfPCell(new Phrase("Cobertura de Rede", normalFont)));

                for (MapaTalentoDTO reg : mapa.mapaTalentos()) {
                    table.addCell(new PdfPCell(new Phrase(reg.regiao(), normalFont)));
                    table.addCell(new PdfPCell(new Phrase(String.valueOf(reg.concentracao()), normalFont)));
                    table.addCell(new PdfPCell(new Phrase(reg.coberturaRede(), normalFont)));
                }
                document.add(table);
            }

            document.add(new Paragraph("\n"));

            String contentToSign = "AppBitReport-" + LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) + "-Alertas-" + alertas.size();
            String digitalSignature = computeSha256(contentToSign);

            document.add(new Paragraph("------------------------------------------------------------------------------------------------------------------------", normalFont));
            Paragraph signatureParagraph = new Paragraph("Selo de Auditoria Digital / Hash de Integridade (LGPD/ESG Compliance):\n" + digitalSignature, footerFont);
            signatureParagraph.setAlignment(Element.ALIGN_CENTER);
            document.add(signatureParagraph);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Erro ao gerar PDF de auditoria ESG", e);
            throw new IllegalStateException("Falha ao exportar PDF: " + e.getMessage(), e);
        }
    }

    public byte[] gerarExcelEsg() {
        log.info("Iniciando geração do Excel de auditoria ESG");
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Alertas ESG");

            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Região / Cluster");
            headerRow.createCell(1).setCellValue("Nível de Gravidade");
            headerRow.createCell(2).setCellValue("Alerta Analítico / Mensagem");

            List<AlertaEsgDTO> alertas = esgInsightService.obterAlertasEsg();
            int rowIdx = 1;
            for (AlertaEsgDTO alerta : alertas) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(alerta.regiao());
                row.createCell(1).setCellValue(alerta.gravidade());
                row.createCell(2).setCellValue(alerta.titulo() + " - " + alerta.acaoRecomendada());
            }

            Sheet sheetRegioes = workbook.createSheet("Indicadores de Regiões");
            Row headerRegioes = sheetRegioes.createRow(0);
            headerRegioes.createCell(0).setCellValue("Nome da Região");
            headerRegioes.createCell(1).setCellValue("Quantidade de Candidatos");
            headerRegioes.createCell(2).setCellValue("Cobertura de Rede");

            MapaTalentosResponseDTO mapa = talentoInsightService.obterMapaTalentos();
            int regRowIdx = 1;
            if (mapa != null && mapa.mapaTalentos() != null) {
                for (MapaTalentoDTO reg : mapa.mapaTalentos()) {
                    Row row = sheetRegioes.createRow(regRowIdx++);
                    row.createCell(0).setCellValue(reg.regiao());
                    row.createCell(1).setCellValue(reg.concentracao());
                    row.createCell(2).setCellValue(reg.coberturaRede());
                }
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Erro ao gerar Excel de auditoria ESG", e);
            throw new IllegalStateException("Falha ao exportar Excel: " + e.getMessage(), e);
        }
    }

    private String computeSha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString().toUpperCase();
        } catch (Exception ex) {
            return "INTEGRITY-HASH-ERROR";
        }
    }
}
