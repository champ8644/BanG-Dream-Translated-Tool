import { actorThreshold } from '../constants';

export default function findActorID(mat, ms, nameActor) {
  let newID = null;
  nameActor.forEach(({ actor, uid }) => {
    if (newID) return;
    const diff = mat.bitwiseXor(actor).countNonZero();
    if (diff < actorThreshold) newID = uid;
  });
  if (newID) return newID;
  newID = nameActor.length + 1;
  nameActor.push({ actor: mat, uid: newID, ms });
  return newID;
}
