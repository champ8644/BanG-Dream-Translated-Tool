import VideoCapture from '../containers/Lounge/VideoCapture';
import mainLounge from '../containers/Lounge/loungeFunctions/mainLounge';

export default function mainLounges(e, arg) {
  const { videoFilePath, start, end } = arg;
  const vCap = new VideoCapture({ path: videoFilePath });
  return mainLounge({ vCap, start, end });
}
