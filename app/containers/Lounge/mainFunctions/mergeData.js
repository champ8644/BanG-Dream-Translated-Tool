import findActorID from './findActorID';

export default function mergeData(datas) {
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
      newUID[uid] = findActorID(actor, frame, mergedNameActor);
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
        }
      });
    });
  });
  return { data: mergedData, nameActor: mergedNameActor, info: datas.info };
}
