import cv from 'opencv4nodejs';

export const maxWidth = (960 / 2) * 2;
export const maxHeight = (720 / 2) * 2;
export const maxMinDist = 15000;
export const green = new cv.Vec(0, 255, 0);
export const blue = new cv.Vec(255, 0, 0);
export const red = new cv.Vec(0, 0, 255);

export const nameLabelThreshold = {
  blue: [87, 185],
  green: [41, 126],
  red: [229, 255]
};
