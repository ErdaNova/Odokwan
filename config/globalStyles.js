import {Dimensions, StyleSheet, } from 'react-native';

export const basicDimensions = { // 디자이너가 작업하고 있는 XD파일 스크린의 세로,가로
    height: 785.4545454545455,
    width: 392.72727272727275,
};

export const regHeight = ( // 높이 변환 작업
  Dimensions.get('screen').height *
  (1 / basicDimensions.height)
).toFixed(2);

export const regWidth = ( // 가로 변환 작업
  Dimensions.get('screen').width *
  (1 / basicDimensions.width)
).toFixed(2);

export const colors = {
    textLight: "#606060",
    textNormal: "#404040",
    textDark: "#202020",
    white: "#FFFFFF",
}