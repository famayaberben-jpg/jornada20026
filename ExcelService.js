import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import ExcelJS from 'exceljs';
import { getAllJornadas } from './DatabaseService';

export const exportToExcel = async () => {
  try {
    const jornadas = await getAllJornadas();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Jornadas');

    worksheet.columns = [
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Horas Trabajadas', key: 'horasTrabajadas', width: 18 },
    ];

    jornadas.forEach((jornada) => {
      worksheet.addRow({
        fecha: jornada.fecha,
        horasTrabajadas: jornada.horasTrabajadas,
      });
    });

    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF007AFF' } };

    const fileUri = `${FileSystem.documentDirectory}registro_jornadas_${new Date().getTime()}.xlsx`;

    const buffer = await workbook.xlsx.writeBuffer();
    await FileSystem.writeAsStringAsync(fileUri, buffer.toString('base64'), {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Descargar Registro de Jornadas',
      });
    } else {
      console.log('Archivo guardado en:', fileUri);
      return fileUri;
    }
  } catch (error) {
    console.error('Error exportando a Excel:', error);
    throw error;
  }
};
