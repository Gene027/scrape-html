import * as ExcelJS from "exceljs";
import * as path from "path";
import { camelCaseToUserReadable, columnToLetter } from "./string";

export async function appendToExcel(
  data: Record<string, any>[],
  download: boolean = true,
  batchSize: number = 100
) {
  const filePath = path.join(process.cwd(), "walmart-result.xlsx");
  const workbook = new ExcelJS.Workbook();

  try {
    await workbook.xlsx.readFile(filePath);
  } catch (err) {
    console.log("File not found, creating a new one.");
    workbook.addWorksheet("Walmart Products");
  }

  const worksheet = workbook.getWorksheet("Walmart Products");
  const columns: string[] = Object.keys(data[0]);
  const userReadableColumns: string[] = columns.map((field) => camelCaseToUserReadable(field));

  if (!worksheet) {
    throw new Error("Worksheet 'Walmart Products' not found");
  }

  if (worksheet.rowCount === 0) {
    userReadableColumns.forEach((column, index) => {
      const cellReference = `${columnToLetter(index + 1)}1`;
      worksheet.getCell(cellReference).value = column;
    });
  }

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    batch.forEach((product) => {
      const rowIndex = worksheet.lastRow ? worksheet.lastRow.number + 1 : 1;
      columns.forEach((column, columnIdx) => {
        const cellReference = `${columnToLetter(columnIdx + 1)}${rowIndex}`;
        worksheet.getCell(cellReference).value = product[column];
      });
      worksheet.getRow(rowIndex).commit();
    });
  }

  if(download) {
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
  
  await workbook.xlsx
    .writeFile(filePath)
    .then(() => {
      console.log("Excel file updated successfully.");
    })
    .catch((error: any) => {
      console.error("Error updating Excel file:", error);
    });
}
