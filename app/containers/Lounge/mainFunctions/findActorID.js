import { actorThreshold } from '../constants';
import { thresholdOtsu } from '../utils/thresholdCv';

export default function findActorID(mat, frame, nameActor) {
  let newID = null;
  const arr = {};
  const otsuMat = thresholdOtsu(mat, null);
  for (let i = 0; i < nameActor.length; i++) {
    const { actor, uid } = nameActor[i];
    const diff = otsuMat.bitwiseXor(actor).countNonZero();
    arr[uid] = diff;
    if (diff < actorThreshold) {
      newID = uid;
      break;
    }
  }
  if (newID) return newID;
  newID = nameActor.length + 1;
  nameActor.push({ uid: newID, frame, actor: otsuMat });
  return newID;
}
