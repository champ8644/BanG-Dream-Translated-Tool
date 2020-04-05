import VideoCapture from '../containers/Lounge/VideoCapture';
import mainEvent from '../containers/Lounge/mainFunctions/mainEvent';

export default function mainEvents(e, arg) {
  const { videoFilePath, start, end } = arg;
  const vCap = new VideoCapture({ path: videoFilePath });
  mainEvent({ vCap, start, end });
}
