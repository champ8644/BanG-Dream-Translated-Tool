import { dialogPartialDiffThreshold } from '../constants/index';

export default function isNewDialog(next, prev) {
  if (prev === null) return true;
  if (next === null) return true;
  console.log('isNewDialog: ', prev.sub(next).countNonZero());
  return prev.sub(next).countNonZero() > dialogPartialDiffThreshold;
}
