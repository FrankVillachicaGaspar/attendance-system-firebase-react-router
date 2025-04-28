import { format } from "date-fns";
import * as ExcelJS from "exceljs";
import axios from "axios";
import type { FirebaseAttendance } from "@/common/types/firebase/FirebaseAttendance";

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
  date: {
    from: string;
    to: string;
  }
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
    const rowNumber = 5;

    // Combinar celdas para el título (A5:5)
    worksheet.mergeCells(`A${rowNumber}:J${rowNumber}`);

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

    // NUEVA SECCIÓN: Tabla de datos personales del empleado
    // Añadir encabezado para la tabla de datos personales
    const employeeHeaderRow = worksheet.addRow(["DATOS DEL EMPLEADO"]);
    employeeHeaderRow.height = 25;

    // Combinar celdas para el encabezado (A7:L7)
    worksheet.mergeCells("A7:F7");

    // Dar formato al encabezado
    const employeeHeaderCell = employeeHeaderRow.getCell(1);
    employeeHeaderCell.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    employeeHeaderCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF0000" }, // Rojo
    };
    employeeHeaderCell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    employeeHeaderCell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    // Añadir encabezados de columnas para datos personales
    const personalDataHeadersGroup = [
      { title: "Nombre Completo", start: 1, end: 2 },
      { title: "Departamento", start: 3, end: 3 },
      { title: "Puesto de trabajo", start: 4, end: 5 },
      { title: "DNI", start: 6, end: 6 },
    ];
    const personalHeaderRow = worksheet.addRow([]);
    personalHeaderRow.height = 30;

    // Aplicar estilos a los encabezados
    personalDataHeadersGroup.forEach((group) => {
      const cell = personalHeaderRow.getCell(group.start);
      cell.value = group.title;
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

      const startCol = worksheet.getColumn(group.start).letter;
      const endCol = worksheet.getColumn(group.end).letter;
      worksheet.mergeCells(
        `${startCol}${personalHeaderRow.number}:${endCol}${personalHeaderRow.number}`
      );
    });

    // Añadir los datos personales (solo mostramos los del primer empleado en la lista)
    if (attendanceList.length > 0) {
      const employee = attendanceList[0].employee;

      // Crear fila con celdas vacías para los datos personales
      const personalDataRow = worksheet.addRow(
        Array(worksheet.columnCount).fill("")
      );
      personalDataRow.height = 25;

      // Llenar y combinar cada grupo de celdas de datos para que coincidan con los encabezados
      personalDataHeadersGroup.forEach((group) => {
        // Obtener la celda inicial de cada grupo
        const cell = personalDataRow.getCell(group.start);

        // Asignar el valor correcto según el grupo
        if (group.title === "Nombre Completo") {
          cell.value = `${startCaseWithAccents(
            employee.names
          )} ${startCaseWithAccents(employee.lastname)}`;
        } else if (group.title === "Departamento") {
          cell.value = employee.department.name;
        } else if (group.title === "Puesto de trabajo") {
          cell.value = employee.job_position.name;
        } else if (group.title === "DNI") {
          cell.value = employee.dni;
        }

        // Aplicar estilos a la celda
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

        // Combinar celdas de datos para que coincidan con el encabezado
        if (group.start !== group.end) {
          const startCol = worksheet.getColumn(group.start).letter;
          const endCol = worksheet.getColumn(group.end).letter;
          worksheet.mergeCells(
            `${startCol}${personalDataRow.number}:${endCol}${personalDataRow.number}`
          );
        }
      });
    }

    // Añadir espacio entre tablas
    worksheet.addRow([]);
    worksheet.addRow([]);

    // Definir grupos de encabezados para la tabla de asistencias
    const headerGroups = [
      { title: "REGISTRO DE ASISTENCIA", start: 1, end: 4 },
      { title: "INFORMACIÓN ADICIONAL", start: 5, end: 7 },
      { title: "RESUMEN", start: 8, end: 10 },
    ];

    // Añadir fila de grupos de encabezados
    const groupRow = worksheet.addRow([]);
    groupRow.height = 25;

    // Establecer valores y estilos para los grupos
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
      worksheet.mergeCells(
        `${startCol}${groupRow.number}:${endCol}${groupRow.number}`
      );
    });

    // Preparar datos de asistencia
    const columnHeaders = [
      "Fecha",
      "Entrada del primer turno",
      "Salida del primer turno",
      "Entrada del segundo turno",
      "Salida del segundo turno",
      "Tipo de observación",
      "Observación",
      "Horas trabajadas",
      "Horas extras",
      "Total del día",
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
        // Datos de asistencia
        format(new Date(attendance.created_at_date), "dd-MM-yyyy"),
        attendance.first_check_in_time
          ? format(new Date(attendance.first_check_in_time), "HH:mm")
          : "No registrado",
        attendance.first_check_out_time
          ? format(new Date(attendance.first_check_out_time), "HH:mm")
          : "No registrado",
        attendance.second_check_in_time
          ? format(new Date(attendance.second_check_in_time), "HH:mm")
          : "No registrado",
        attendance.second_check_out_time
          ? format(new Date(attendance.second_check_out_time), "HH:mm")
          : "No registrado",

        // Información adicional
        attendance.observation_type ? attendance.observation_type.name : "N/A",
        attendance.observation ?? "N/A",

        // Resumen
        attendance.work_hours ?? "Por calcular",
        attendance.overtime ?? "Sin horas extras",
        attendance.work_hours !== undefined && attendance.overtime !== undefined
          ? Number(attendance.work_hours) + Number(attendance.overtime)
          : "Por calcular",
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
    const columnWidths = [20, 20, 20, 20, 20, 30, 15, 18, 18, 18];
    columnWidths.forEach((width, index) => {
      worksheet.getColumn(index + 1).width = width;
    });

    // Generar nombre de archivo
    const fileName = `Lista de asistencias ${startCaseWithAccents(
      attendanceList[0].employee.names
    )} ${startCaseWithAccents(attendanceList[0].employee.lastname)} ${
      date.from
    } - ${date.to}.xlsx`;

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
