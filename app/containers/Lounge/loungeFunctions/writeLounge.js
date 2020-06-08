import fs from 'fs';
import { remote } from 'electron';

const { dialog } = remote;

// import XLSX from 'xlsx';
// export default async function writeOutputLounge(outputLounge) {
//   // eslint-disable-next-line no-console
//   console.log('outputLounge: ', outputLounge);
//   const header = ['x1', 'y1', 'x2', 'y2'];
//   const { canceled, filePath } = await dialog.showSaveDialog({
//     filters: [{ name: 'Excel files', extensions: ['xlsx'] }]
//   });
//   if (canceled) return;
//   const worksheet = XLSX.utils.json_to_sheet(outputLounge, { header });
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, 'BanG_Dream');
//   XLSX.writeFile(workbook, filePath);
// }

export default async function writeOutputLounge(outputLounge) {
  // eslint-disable-next-line no-console
  console.log('outputLounge: ', outputLounge);
  const jsonOutput = outputLounge.map(item =>
    item.reduce(
      (state, next, idx) => {
        state.uid = next.uid;
        state.beginFrame = Math.min(state.beginFrame, next.frame);
        state.endFrame = Math.max(state.endFrame, next.frame);
        ['height', 'width', 'x', 'y'].forEach(key => {
          state[key] = (state[key] * idx + next[key]) / (idx + 1);
        });
        const abs = x => {
          if (isNaN(x)) return 0;
          return x < 0 ? -x : x;
        };
        ['x1', 'y1', 'x2', 'y2', 'calc'].forEach(key => {
          state[key] = Math.max(state[key], abs(next[key]));
        });
        return state;
      },
      {
        uid: null,
        beginFrame: 1e10,
        endFrame: -1,
        height: 0,
        width: 0,
        y: 0,
        x: 0,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        calc: 0
      }
    )
  );
  // const header = ['x1', 'y1', 'x2', 'y2'];
  const { canceled, filePath } = await dialog.showSaveDialog({
    filters: [{ name: 'JSON files', extensions: ['json'] }]
  });
  if (canceled) return;
  fs.writeFileSync(filePath, JSON.stringify(jsonOutput, null, 2));
}

// export default function writeLounge(res) {
//   console.log('res: ', res);
// }
