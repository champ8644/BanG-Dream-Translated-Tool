import { actorThreshold } from '../constants';

export default function findActorID(mat, frame, nameActor) {
  let newID = null;
  const arr = {};
  for (let i = 0; i < nameActor.length; i++) {
    const { actor, uid } = nameActor[i];
    const diff = mat.bitwiseXor(actor).countNonZero();
    arr[uid] = diff;
    if (diff < actorThreshold) {
      newID = uid;
      break;
    }
  }
  if (newID) return newID;
  newID = nameActor.length + 1;
  nameActor.push({ uid: newID, frame, actor: mat });
  return newID;
}
