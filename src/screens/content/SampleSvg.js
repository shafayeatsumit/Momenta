import * as React from 'react';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  RadialGradient,
  G,
  Path,
  Circle,
  Ellipse,
} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: title */

function SvgComponent(props) {
  return (
    <Svg width={200} height={120} viewBox="0 0 253 128" {...props}>
      <Defs>
        {/* <RadialGradient
          x1="8.21%"
          y1="49.273%"
          x2="91.493%"
          y2="57.04%"
          id="prefix__a">
          <Stop stopColor="#7DB2E4" offset="0%" />
          <Stop stopColor="#6852F2" offset="100%" />
        </RadialGradient> */}
      </Defs>
      <Ellipse cx="150" cy="75" rx="85" ry="55" fill="url(#prefix__a)" />
      {/* <Circle cx="50" cy="50" r="50" fill="pink" /> */}

      {/* <G fill="url(#prefix__a)" fillRule="evenodd" opacity={0.67}>
        <Path d="M7.103 60.07C12.9 40.23 30.88 25.672 46.025 22.72c15.147-2.952 25.867 29.25 57.554 29.524 31.687.274 63.752-39.183 97.214-32.476 33.462 6.706 41.3 20.28 44.954 36.952 3.655 16.67-3.654 44.9-28.305 51.66-24.65 6.759-30.667-26.184-77.596-26.184-46.93 0-46.953 26.184-84.162 26.184-37.21 0-54.377-28.47-48.58-48.31z" />
        <Path
          d="M9.209 41.47c8.828-18.688 28.863-30.254 44.286-30.8 15.422-.547 20.972 32.937 52.226 38.164 31.254 5.227 69.097-28.728 101.098-16.87 32 11.86 37.618 26.493 38.62 43.53 1.002 17.038-10.634 43.777-36.038 46.597-25.405 2.82-26.194-30.66-72.545-38-46.352-7.342-50.47 18.516-87.222 12.695C12.882 90.965.38 60.16 9.209 41.47z"
          opacity={0.369}
        />
      </G> */}
    </Svg>
  );
}

export default SvgComponent;
