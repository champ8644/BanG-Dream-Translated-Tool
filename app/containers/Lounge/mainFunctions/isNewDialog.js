import { dialogPartialDiffThreshold } from '../constants/index';

export default function isNewDialog(next, prev) {
  if (prev === null) return true;
  if (next === null) return true;
  // console.log({
  //   val: prev.sub(next).countNonZero(),
  //   bool: prev.sub(next).countNonZero() > dialogPartialDiffThreshold
  // });
  return prev.sub(next).countNonZero() > dialogPartialDiffThreshold;
}
