import type { FirebaseAttendance } from "@/common/types/firebase/FirebaseAttendance";
import { format } from "date-fns";
import * as ExcelJS from "exceljs";
import axios from "axios";

/**
 * Capitaliza la primera letra de cada palabra manteniendo las tildes
 */
function startCaseWithAccents(text: string): string {
  if (!text) return "";

  // Reemplazar guiones y guiones bajos con espacios
  const prepared = text.toLowerCase().replace(/[-_]+/g, " ");

  // Dividir por espacios y capitalizar cada palabra
  return prepared
    .split(" ")
    .map((word) =>
      word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
    )
    .join(" ");
}

/**
 * Exporta datos de asistencia a Excel con formatos, estilos e imagen de logo
 * usando la biblioteca ExcelJS que permite insertar imágenes directamente
 */
export default async function exportToExcel(
  attendanceList: FirebaseAttendance[],
  date: string
) {
  try {
    if (!attendanceList || attendanceList.length === 0) {
      console.error("No hay datos para exportar");
      return null;
    }

    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Sistema de Asistencia";
    workbook.lastModifiedBy = "Sistema";

    // Crear una hoja de trabajo
    const worksheet = workbook.addWorksheet("Asistencias");

    // Añadir logo desde URL
    try {
      const logoUrl =
        "https://res.cloudinary.com/dgop9qobw/image/upload/v1745742437/with-text_qqydjb.webp";

      // Obtener la imagen desde la URL
      const response = await axios.get(logoUrl, {
        responseType: "arraybuffer",
      });

      // Convertir a formato que ExcelJS pueda manejar
      const logoImage = workbook.addImage({
        buffer: response.data,
        extension: "png", // Usar 'png' aunque sea webp
      });

      // Insertar la imagen en la hoja respetando su tamaño original de 428x187
      // Calcular ratio para mantener proporciones (428 / 187 = 2.29)
      // Una columna tiene aprox. 8.43 unidades de ancho por defecto
      // Una fila tiene aprox. 15 unidades de alto por defecto
      // Por lo tanto, para mantener proporcines de 428x187:
      worksheet.addImage(logoImage, {
        tl: { col: 0, row: 0 }, // Esquina superior izquierda (columna A, fila 1)
        ext: { width: 428, height: 187 }, // Tamaño original en píxeles
        editAs: "oneCell",
      });
    } catch (error) {
      console.error("Error al añadir la imagen:", error);
    }

    // Agregar espacio para el logo y título
    // Ajustamos la altura de las primeras filas para acomodar la imagen
    for (let i = 0; i < 3; i++) {
      const row = worksheet.addRow([]);
      row.height = 47; // Aproximadamente 187px / 4 filas = 47px por fila
    }

    // Añadir título en la fila 5
    const titleRow = worksheet.addRow(["REPORTE DE ASISTENCIAS"]);
    titleRow.height = 30;

    // En ExcelJS, las filas se numeran desde 1, y esta es la quinta fila que hemos añadido
    // Por lo tanto, esta es la fila 5 en Excel
    const rowNumber = 5;

    // Combinar celdas para el título (A5:L5)
    worksheet.mergeCells(`A${rowNumber}:L${rowNumber}`);

    // Aplicar formato al título después de combinar las celdas
    const titleCell = titleRow.getCell(1); // Celda A en la fila del título
    titleCell.font = {
      bold: true,
      size: 16,
    };
    titleCell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    // Añadir espacio después del título
    worksheet.addRow([]);

    // Definir grupos de encabezados
    const headerGroups = [
      { title: "DATOS DEL EMPLEADO", start: 1, end: 4 },
      { title: "REGISTRO DE ASISTENCIA", start: 5, end: 8 },
      { title: "INFORMACIÓN ADICIONAL", start: 9, end: 12 },
    ];

    // Añadir fila de grupos de encabezados
    const groupRow = worksheet.addRow([]);
    groupRow.height = 25;

    // Establecer valores y estilos para los grupos
    // CORREGIDO: Usar notación de letras para evitar problemas con mergeCells
    headerGroups.forEach((group) => {
      const cell = groupRow.getCell(group.start);
      cell.value = group.title;
      cell.font = {
        bold: true,
        color: { argb: "FFFFFFFF" },
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF0000" }, // Rojo
      };
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      // Usar la notación de letras para evitar errores de fusión
      const startCol = worksheet.getColumn(group.start).letter;
      const endCol = worksheet.getColumn(group.end).letter;
      worksheet.mergeCells(`${startCol}7:${endCol}7`);
    });

    // Preparar datos
    const columnHeaders = [
      "Nombre Completo",
      "DNI",
      "Departamento",
      "Puesto de trabajo",
      "Entrada del primer turno",
      "Salida del primer turno",
      "Entrada del segundo turno",
      "Salida del segundo turno",
      "Tipo de observación",
      "Observación",
      "Horas trabajadas",
      "Horas extras",
    ];

    // Añadir encabezados de columnas
    const headerRow = worksheet.addRow(columnHeaders);
    headerRow.height = 30;

    // Aplicar estilos a los encabezados
    headerRow.eachCell((cell, colNumber) => {
      cell.font = {
        bold: true,
        color: { argb: "FFFFFFFF" },
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF000000" }, // Negro
      };
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Añadir datos de asistencia
    attendanceList.forEach((attendance) => {
      const dataRow = worksheet.addRow([
        // Datos del empleado
        `${startCaseWithAccents(
          attendance.employee.names
        )} ${startCaseWithAccents(attendance.employee.lastname)}`,
        attendance.employee.dni,
        attendance.employee.department.name,
        attendance.employee.job_position.name,

        // Datos de asistencia
        attendance.first_check_in_time
          ? format(new Date(attendance.first_check_in_time), "dd-MM-yyyy HH:mm")
          : "No registrado",
        attendance.first_check_out_time
          ? format(
              new Date(attendance.first_check_out_time),
              "dd-MM-yyyy HH:mm"
            )
          : "No registrado",
        attendance.second_check_in_time
          ? format(
              new Date(attendance.second_check_in_time),
              "dd-MM-yyyy HH:mm"
            )
          : "No registrado",
        attendance.second_check_out_time
          ? format(
              new Date(attendance.second_check_out_time),
              "dd-MM-yyyy HH:mm"
            )
          : "No registrado",

        // Información adicional
        attendance.observation_type ? attendance.observation_type.name : "N/A",
        attendance.observation ?? "N/A",
        attendance.work_hours ?? "Por calcular",
        attendance.overtime ??
          (attendance.work_hours === 8 ? "Sin horas extras" : "Por calcular"),
      ]);

      // Aplicar estilos a las celdas de datos
      dataRow.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = {
          vertical: "middle",
          wrapText: true,
        };
      });

      dataRow.height = 20;
    });

    // Ajustar anchos de columna
    const columnWidths = [30, 15, 20, 25, 25, 25, 25, 25, 20, 30, 18, 18];
    columnWidths.forEach((width, index) => {
      worksheet.getColumn(index + 1).width = width;
    });

    // Generar nombre de archivo
    const fileName = `Lista de asistencias ${date}.xlsx`;

    // Guardar el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);

    // Crear enlace para descargar
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    // Liberar el objeto URL
    window.URL.revokeObjectURL(url);

    console.log("Excel generado con éxito con la imagen incluida.");
    return fileName;
  } catch (error) {
    console.error("Error al generar el Excel:", error);
    return null;
  }
}
