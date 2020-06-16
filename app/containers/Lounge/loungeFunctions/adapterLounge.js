import simplifyPosition from './simplifyPosition';

export default function adapterLounge(outputLounge) {
  return outputLounge.map(item => ({
    shake: simplifyPosition(
      item.map(unit => ({
        frame: unit.frame,
        left: unit.x,
        right: unit.x + unit.width,
        top: unit.y,
        bottom: unit.y + unit.height,
        centerX: unit.x + unit.width / 2,
        centerY: unit.y + unit.height / 2,
        height: unit.height,
        width: unit.width
      }))
    ),
    ...item.reduce(
      (state, next, idx) => {
        state.uid = next.uid + 1;
        state.begin = Math.min(state.begin, next.frame);
        state.end = Math.max(state.end, next.frame);
        ['height', 'width', 'x', 'y'].forEach(key => {
          state[key] = (state[key] * idx + next[key]) / (idx + 1);
        });
        const abs = x => {
          if (isNaN(x)) return 0;
          return x < 0 ? -x : x;
        };
        ['x1', 'y1', 'x2', 'y2', 'calc'].forEach(key => {
          state[key] = Math.max(state[key], abs(next[key]));
        });
        return state;
      },
      {
        uid: null,
        begin: 1e10,
        end: -1,
        height: 0,
        width: 0,
        y: 0,
        x: 0,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        calc: 0
      }
    )
  }));
}
