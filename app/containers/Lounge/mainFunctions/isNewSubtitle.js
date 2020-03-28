import { threshSubSubtitle } from '../constants';

export default function isNewSubtitle(prev, next) {
  if (!prev || !next) return true;
  return prev.sub(next).countNonZero() > threshSubSubtitle;
}
