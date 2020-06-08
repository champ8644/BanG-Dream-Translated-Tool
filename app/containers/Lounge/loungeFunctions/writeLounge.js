import XLSX from 'xlsx';
import { remote } from 'electron';

const { dialog } = remote;

export default async function writeOutputLounge(outputLounge) {
  // eslint-disable-next-line no-console
  console.log('outputLounge: ', outputLounge);
  const header = ['x1', 'y1', 'x2', 'y2'];
  const { canceled, filePath } = await dialog.showSaveDialog({
    filters: [{ name: 'Excel files', extensions: ['xlsx'] }]
  });
  if (canceled) return;
  const worksheet = XLSX.utils.json_to_sheet(outputLounge, { header });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'BanG_Dream');
  XLSX.writeFile(workbook, filePath);
}

// export default function writeLounge(res) {
//   console.log('res: ', res);
// }
