import VideoCapture from '../containers/Lounge/VideoCapture';
import mainEvent from '../containers/Lounge/mainFunctions/mainEvent';

export default function mainEvents(props) {
  const { videoFilePath } = props;
  const vCap = new VideoCapture({ path: videoFilePath });
  mainEvent(vCap);
}
