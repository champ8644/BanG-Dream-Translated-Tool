import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import Chip from '@material-ui/core/Chip';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import React from 'react';
import SpeedIcon from '@material-ui/icons/Speed';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { formatNumber } from '../constants/function';
import { styles } from './ListVCapStyle';
import { withStyles } from '@material-ui/core/styles';
// const styles = {};

function ProgressChipBar(props) {
  const {
    readyToWork,
    percentLinear,
    classes,
    showFPS,
    onSwitchFPS,
    FPS
  } = props;
  let fpsDiv = showFPS ? 1 : FPS;
  let fpsText = showFPS ? 'FPS' : '';
  let fpsTextExt = showFPS ? ': ' : '';
  let fpsPostText = showFPS ? '' : 'x';
  if (fpsDiv === 0) {
    fpsText = 'FPS';
    fpsPostText = '';
    fpsTextExt = '';
    fpsDiv = 1;
  }
  if (!readyToWork) return <></>;
  return (
    <div>
      <Tooltip
        title={`frame: ${percentLinear.progress}/${percentLinear.endFrame -
          percentLinear.beginFrame}`}
        arrow
      >
        <Chip
          className={classes.chip}
          icon={<DonutLargeIcon />}
          label={`${formatNumber(percentLinear.percent)} / 100 %`}
          variant='outlined'
        />
      </Tooltip>
      {percentLinear.maxFPS < 0 ? (
        <Chip
          className={classes.chip}
          icon={<SpeedIcon />}
          color='primary'
          label={`FPS: ${formatNumber(percentLinear.FPS)}`}
          variant='outlined'
        />
      ) : (
        <Tooltip
          title={
            <>
              <Typography component='p' className={classes.FPSTooltip}>
                {`min ${fpsText}: `}
                {formatNumber(percentLinear.minFPS / fpsDiv)}
                {fpsPostText}
              </Typography>
              <Typography component='p' className={classes.FPSTooltip}>
                {`max ${fpsText}: `}
                {formatNumber(percentLinear.maxFPS / fpsDiv)}
                {fpsPostText}
              </Typography>
            </>
          }
          arrow
          disableFocusListener={percentLinear.maxFPS < 0}
          disableTouchListener={percentLinear.maxFPS < 0}
        >
          <Chip
            className={classes.chip}
            icon={<SpeedIcon />}
            color='primary'
            label={`${fpsText}${fpsTextExt}${formatNumber(
              percentLinear.FPS / fpsDiv
            )}${fpsPostText}`}
            variant='outlined'
            onClick={onSwitchFPS}
          />
        </Tooltip>
      )}
      <Tooltip
        title={`Time Elapsed: ${percentLinear.timePassed} / ${
          percentLinear.timeAll
        }`}
        arrow
      >
        <Chip
          className={classes.chip}
          icon={<AccessAlarmIcon />}
          color='secondary'
          label={`Time left: ${percentLinear.timeLeft}`}
          variant='outlined'
        />
      </Tooltip>
    </div>
  );
}

export default withStyles(styles)(ProgressChipBar);
