import type { FirebaseAttendance } from "@/common/types/firebase/FirebaseAttendance";
import { format } from "date-fns";
import _ from "lodash";
import * as XLSX from "xlsx";

export default function exportToExcel(attendanceList: FirebaseAttendance[]) {
  // Formatear los datos de acuerdo a las propiedades que deseas mostrar en el archivo Excel
  const formattedData = attendanceList.map((attendance) => ({
    "Nombre del empleado": `${_.startCase(
      _.toLower(attendance.employee.names)
    )} ${_.startCase(_.toLower(attendance.employee.lastname))}`,
    DNI: attendance.employee.dni,
    Departamento: attendance.employee.department.name,
    "Puesto de trabajo": attendance.employee.job_position.name,
    "Entrada del primer turno": attendance.first_check_in_time
      ? format(attendance.first_check_in_time, "dd-MM-yyyy HH:mm")
      : "No registrado",
    "Salida del primer turno": attendance.first_check_out_time
      ? format(attendance.first_check_out_time, "dd-MM-yyyy HH:mm")
      : "No registrado",
    "Entrada del segundo turno": attendance.second_check_in_time
      ? format(attendance.second_check_in_time, "dd-MM-yyyy HH:mm")
      : "No registrado",
    "Salida del segundo turno": attendance.second_check_out_time
      ? format(attendance.second_check_out_time, "dd-MM-yyyy HH:mm")
      : "No registrado",
    "Tipo de observación": attendance.observation_type
      ? attendance.observation_type.name
      : "N/A",
    Observación: attendance.observation ?? "N/A",
    "Horas trabajadas": attendance.work_hours ?? "Por calcular",
    "Horas extras":
      attendance.overtime ??
      (attendance.work_hours === 8 ? "Sin horas extras" : "Por calcular"),
  }));

  // Crear una nueva hoja de trabajo (worksheet)
  const ws = XLSX.utils.json_to_sheet(formattedData);

  // Estilo para la cabecera (rojo con texto blanco)
  const headerStyle = {
    fill: {
      fgColor: { rgb: "FF0000" }, // Rojo
    },
    font: {
      color: { rgb: "#FFFFFF" }, // Blanco
      bold: true,
    },
    alignment: {
      horizontal: "center",
      vertical: "center",
    },
  };

  // Estilo para las celdas de datos (puedes agregar más estilos si lo deseas)
  const cellStyle = {
    alignment: {
      horizontal: "left",
      vertical: "center",
    },
  };

  // Aplicar estilo a la cabecera
  const range = XLSX.utils.decode_range(ws["!ref"]!); // Obtener el rango de celdas
  for (let col = range.s.c; col <= range.e.c; col++) {
    const headerCell = ws[XLSX.utils.encode_cell({ r: 0, c: col })];
    if (headerCell) {
      headerCell.s = headerStyle;
    }
  }

  // Aplicar estilo a todas las celdas de datos
  for (let row = range.s.r + 1; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cell = ws[XLSX.utils.encode_cell({ r: row, c: col })];
      if (cell) {
        cell.s = cellStyle;
      }
    }
  }

  // Ajustar el ancho de las columnas
  const colWidths = Object.keys(formattedData[0]).map((key, index) => {
    // Obtener el valor máximo entre la longitud del valor del encabezado y los datos
    const headerLength = key.length;
    const maxCellLength = formattedData.reduce((maxLength, row) => {
      const cellValue = String(row[key as keyof typeof row]);
      return Math.max(maxLength, cellValue.length);
    }, 0);

    // Ajustar el ancho de la columna al mayor valor entre el encabezado y los datos
    return Math.max(headerLength, maxCellLength); // Multiplicamos por un factor para dar más espacio
  });

  ws["!cols"] = colWidths.map((width) => ({ wpx: width * 7 })); // Ajuste proporcional de ancho

  // Crear un libro de trabajo (workbook) con la hoja de trabajo
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Attendance Data");

  // Generar el archivo Excel
  const dateFormat = attendanceList[0].created_at.split(" ")[0];
  XLSX.writeFile(wb, `Lista de asistencias ${dateFormat}.xlsx`);
}
