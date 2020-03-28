import { actorThreshold } from '../constants';

export default function findActorID(mat, frame, nameActor) {
  let newID = null;
  nameActor.forEach(({ actor, uid }) => {
    if (newID) return;
    const diff = mat.bitwiseXor(actor).countNonZero();
    if (diff < actorThreshold) newID = uid;
  });
  if (newID) return newID;
  newID = nameActor.length + 1;
  nameActor.push({ uid: newID, frame, actor: mat });
  return newID;
}
