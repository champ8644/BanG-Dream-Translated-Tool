import cv from 'opencv4nodejs';
import findActorID from './findActorID';

export default function mergeData(datas) {
  // eslint-disable-next-line no-console
  console.log('datas: ', datas);
  const mergedNameActor = [];
  const mergedData = {
    fadeB: [],
    fadeW: [],
    name: [],
    place: [],
    title: []
  };
  datas.forEach(({ data, nameActor }) => {
    const newUID = {};
    nameActor.forEach(({ actor, frame, uid }) => {
      const readActor = cv.imread(actor);
      newUID[uid] = findActorID(
        readActor.cvtColor(cv.COLOR_BGR2GRAY),
        frame,
        mergedNameActor
      );
    });

    Object.keys(data).forEach(key => {
      data[key].forEach(item => {
        const { length } = mergedData[key];
        if (length > 0) {
          if (mergedData[key][length - 1].end < item.end) {
            if (key === 'name')
              mergedData[key].push({ ...item, actor: newUID[item.actor] });
            else mergedData[key].push(item);
          }
        } else if (key === 'name')
          mergedData[key].push({ ...item, actor: newUID[item.actor] });
        else mergedData[key].push(item);
      });
    });
  });
  return { data: mergedData, nameActor: mergedNameActor, info: datas[0].info };
}
