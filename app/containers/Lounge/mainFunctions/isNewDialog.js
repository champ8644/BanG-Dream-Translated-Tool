import { dialogPartialDiffThreshold } from '../constants/index';

export default function isNewDialog(next, prev) {
  if (prev === null) return true;
  if (next === null) return true;
  return prev.sub(next).countNonZero() > dialogPartialDiffThreshold;
}
