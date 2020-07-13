import { color } from '../constants';
import cv from 'opencv4nodejs';

export default function simplifyPosition(data) {
  if (data.length < 2) return `_G.table.insert(db,{})`;
  const approxContour = _item => {
    const item = new cv.Contour(_item);
    const peri = item.arcLength(true);
    const approx = item.approxPolyDP(0.001 * peri, true);
    return approx;
  };
  const subtract = 0;
  const multiply = 1;
  const div = 1;

  // let prev = data[0];
  // console.log(
  //   'delta',
  //   data.map(item => {
  //     let { centerX, centerY, height, width } = item;
  //     centerX -= prev.centerX;
  //     centerY -= prev.centerY;
  //     height -= prev.height;
  //     width -= prev.width;
  //     prev = item;
  //     return { centerX, centerY, height, width };
  //   })
  // );
  const contourY = approxContour(
    data.map(item => {
      const out = new cv.Point2(
        (item.frame - subtract) * multiply,
        item.centerY
      );
      return out;
    }),
    false
  );

  const contourX = approxContour(
    data.map(item => {
      const out = new cv.Point2(
        (item.frame - subtract) * multiply,
        item.centerX / div
      );
      return out;
    }),
    false
  );

  const contourW = approxContour(
    data.map(item => {
      const out = new cv.Point2((item.frame - subtract) * multiply, item.width);
      return out;
    }),
    false
  );

  const contourH = approxContour(
    data.map(item => {
      const out = new cv.Point2(
        (item.frame - subtract) * multiply,
        item.height
      );
      return out;
    }),
    false
  );

  // contourX.sort((a, b) => a.x - b.x);
  // contourY.sort((a, b) => a.x - b.x);
  // contourW.sort((a, b) => a.x - b.x);
  // contourH.sort((a, b) => a.x - b.x);
  // rewindOneFrame(vCap);
  const frame = new cv.Mat(1440, 1920, cv.CV_8UC1, color.black);
  const blue = new cv.Vec(255, 0, 0);
  const red = new cv.Vec(0, 0, 255);
  const yellow = new cv.Vec(0, 255, 255);
  const green = new cv.Vec(0, 255, 0);
  const sumContour = {};
  frame.drawPolylines([contourY], false, blue, 3);

  contourY.forEach(pt => {
    frame.drawCircle(pt, 5, blue, 10, cv.FILLED);
    const frameCount = pt.x + subtract;
    if (!sumContour[frameCount]) sumContour[frameCount] = {};
    sumContour[frameCount].centerY = pt.y;
  });
  // for (let i = 1; i < contourY.length; i++) {
  //   console.log(
  //     (contourY[i].y - contourY[i - 1].x) / (contourY[i].x - contourY[i - 1].x)
  //   );
  // }
  frame.drawPolylines([contourX], false, red, 3);

  // for (let i = 1; i < contourX.length; i++) {
  //   console.log(
  //     (contourX[i].y - contourX[i - 1].x) / (contourX[i].x - contourX[i - 1].x)
  //   );
  // }
  contourX.forEach(pt => {
    frame.drawCircle(pt, 5, red, 10, cv.FILLED);
    const frameCount = pt.x + subtract;
    if (!sumContour[frameCount]) sumContour[frameCount] = {};
    sumContour[frameCount].centerX = pt.y;
  });
  frame.drawPolylines([contourW], false, yellow, 3);

  // for (let i = 1; i < contourW.length; i++) {
  //   console.log(
  //     (contourW[i].y - contourW[i - 1].x) / (contourW[i].x - contourW[i - 1].x)
  //   );
  // }
  contourW.forEach(pt => {
    frame.drawCircle(pt, 5, yellow, 10, cv.FILLED);
    const frameCount = pt.x + subtract;
    if (!sumContour[frameCount]) sumContour[frameCount] = {};
    sumContour[frameCount].width = pt.y;
  });
  frame.drawPolylines([contourH], false, green, 3);

  // for (let i = 1; i < contourH.length; i++) {
  //   console.log(
  //     (contourH[i].y - contourH[i - 1].x) / (contourH[i].x - contourH[i - 1].x)
  //   );
  // }
  contourH.forEach(pt => {
    frame.drawCircle(pt, 5, green, 10, cv.FILLED);
    const frameCount = pt.x + subtract;
    if (!sumContour[frameCount]) sumContour[frameCount] = {};
    sumContour[frameCount].height = pt.y;
  });

  let iterFrames = Object.keys(sumContour);
  const keyProps = Object.keys(sumContour[iterFrames[0]]);
  const prevKeyframe = {};
  keyProps.forEach(key => {
    prevKeyframe[key] = 0;
  });

  const findX0 = (_x1, y1, _x2, y2) => {
    const x1 = parseFloat(_x1);
    const x2 = parseFloat(_x2);
    if (y1 === y2) return x2;
    return Math.ceil(x2 - ((x2 - x1) * y2) / (y2 - y1));
  };
  const findXN = (_x1, y1, _x2, y2) => {
    const x1 = parseFloat(_x1);
    const x2 = parseFloat(_x2);
    if (y1 === y2) return x1;
    return Math.floor(x1 - ((x2 - x1) * y1) / (y2 - y1));
  };
  const interpolate = (_x1, y1, _x2, y2, _xN) => {
    const x1 = parseFloat(_x1);
    const x2 = parseFloat(_x2);
    const xN = parseFloat(_xN);
    if (x2 === x1) return y1;
    return y1 + ((y2 - y1) * (xN - x1)) / (x2 - x1);
  };
  const interpolBetween = (i, j, key) => {
    for (let p = i + 1; p < j; p++) {
      sumContour[iterFrames[p]][key] = interpolate(
        iterFrames[i],
        sumContour[iterFrames[i]][key],
        iterFrames[j],
        sumContour[iterFrames[j]][key],
        iterFrames[p]
      );
      // console.log('iterFrames', {
      //   i,
      //   j,
      //   p,
      //   key,
      //   ii: iterFrames[i],
      //   ij: iterFrames[j],
      //   ip: iterFrames[p],
      //   si: sumContour[iterFrames[i]],
      //   sj: sumContour[iterFrames[j]]
      // });
    }
  };
  for (let i = 1; i < iterFrames.length; i++) {
    for (let j = 0; j < keyProps.length; j++) {
      const key = keyProps[j];
      if (sumContour[iterFrames[i]][key] !== undefined) {
        // console.log('sumContour[iterFrames[i]][key]: ', {
        //   i,
        //   j,
        //   key,
        //   frame: iterFrames[i],
        //   keyprop: keyProps[j],
        //   sum: sumContour[iterFrames[i]][key],
        //   sumContour
        // });
        interpolBetween(prevKeyframe[key], i, key);
        prevKeyframe[key] = i;
      }
    }
  }

  const interpolateWidth = (x1, x2, dir) => {
    // if (!isFinite(x1) || !isFinite(x2)) console.log({ x1, x2, dir });
    let xN;
    if (dir < 0) {
      xN = findX0(x1, sumContour[x1].height, x2, sumContour[x2].height);
      // if (!isFinite(xN))
      //   console.log('findX0', {
      //     x1,
      //     sx1h: sumContour[x1].height,
      //     x2,
      //     sx2h: sumContour[x2].height
      //   });
      // console.log('dir<0', {
      //   x1,
      //   sx1: sumContour[x1].height,
      //   x2,
      //   sx2: sumContour[x2].height
      // });
    } else {
      xN = findXN(x1, sumContour[x1].height, x2, sumContour[x2].height);
      // if (!isFinite(xN))
      //   console.log('findXN', {
      //     x1,
      //     sx1h: sumContour[x1].height,
      //     x2,
      //     sx2h: sumContour[x2].height
      //   });

      // console.log('dir>0', {
      //   x1,
      //   sx1: sumContour[x1].height,
      //   x2,
      //   sx2: sumContour[x2].height,
      //   xN
      // });
    }
    const val = {};
    Object.keys(sumContour[x1]).forEach(key => {
      const y1 = sumContour[x1][key];
      const y2 = sumContour[x2][key];
      val[key] = interpolate(x1, y1, x2, y2, xN);
      // if (!isFinite(xN))
      //   console.log({ x1, y1, x2, y2, xN, val, key, vk: val[key] });
    });
    return [xN, val];
  };
  const [key2, val] = interpolateWidth(iterFrames[0], iterFrames[1], -1);
  // if (!isFinite(key2)) console.log({ key2, val });
  sumContour[key2] = val;
  const [key3, val2] = interpolateWidth(
    iterFrames[iterFrames.length - 2],
    iterFrames[iterFrames.length - 1],
    1
  );

  // if (!isFinite(key3)) console.log({ key3, val2 });
  sumContour[key3] = val2;
  // eslint-disable-next-line no-console
  console.log('sumContour: ', sumContour);

  // delete sumContour[iterFrames[0]];
  // delete sumContour[iterFrames[iterFrames.length - 1]];

  iterFrames = Object.keys(sumContour);
  const embrace = arr => {
    return `{${arr.join()}}`;
  };
  let maxHeight = 0;
  iterFrames.forEach(key => {
    Object.keys(sumContour[key]).forEach(key2 => {
      if (key2 === 'height' && maxHeight < sumContour[key][key2])
        maxHeight = sumContour[key][key2];
    });
  });

  const round3Dig = num => Math.round(num * 1000) / 1000;
  const arr = [];
  for (let i = 0; i < iterFrames.length; i++) {
    // [
    //   round3Dig((iterFrames[i] * 1000) / 60),
    //   round3Dig(sumContour[iterFrames[i]].centerX),
    //   round3Dig(sumContour[iterFrames[i]].centerY),
    //   round3Dig(sumContour[iterFrames[i]].width),
    //   round3Dig(sumContour[iterFrames[i]].height),
    //   round3Dig((sumContour[iterFrames[i]].height * 100) / maxHeight)
    // ].forEach((item, key) => {
    // if (isNaN(item)) {
    //   console.log({
    //     item,
    //     key,
    //     i,
    //     iterFrames,
    //     iterFramesXX: iterFrames[i],
    //     sumContour,
    //     sumContourXX: sumContour[iterFrames[i]]
    //   });
    // }
    // });
    const join = [
      `t=${round3Dig((iterFrames[i] * 1000) / 60)}`, // vCap.FPS
      `x=${round3Dig(sumContour[iterFrames[i]].centerX)}`,
      `y=${round3Dig(sumContour[iterFrames[i]].centerY)}`,
      `w=${round3Dig(sumContour[iterFrames[i]].width)}`,
      `h=${round3Dig(sumContour[iterFrames[i]].height)}`,
      `p=${round3Dig((sumContour[iterFrames[i]].height * 100) / maxHeight)}`
    ];
    arr.push(embrace(join));
  }
  return `_G.table.insert(db,${embrace(arr)})`;

  // delete sumContour[iterFrames[0]];
  // vCap.showMatInCanvas(frame);
  // const { canceled, filePath } = await dialog.showSaveDialog({
  //   defaultPath: defaultFileName,
  //   filters: [{ name: 'Text file', extensions: ['txt'] }]
  // });
  // if (canceled) return;
  // fs.writeFile(filePath, output, err => {
  //   if (!err)
  // });
}
