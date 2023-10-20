import React, { Component } from 'react';
import { View, StyleSheet, Keyboard, Animated, Easing } from 'react-native';
import Svg,{ Path, Circle,LinearGradient,Defs,Stop,Ellipse} from "react-native-svg";
import { BlurView } from 'expo-blur';
import SvgUri from 'react-native-svg-uri';
export default class Loader extends Component {
    constructor() {
        super();
        this.state = {
            _circleSmall: new Animated.Value(0),
            _circleBig: new Animated.Value(0),
            _arcSmall: new Animated.Value(0),
            _arcBig: new Animated.Value(0),
        }
    }
    invokeAnimation = () => {
        Animated.loop(
            Animated.parallel([
                Animated.timing(this.state._circleSmall, {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver:false
                }),
                Animated.timing(this.state._circleBig, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease)
                    ,useNativeDriver:false
                }),
                Animated.timing(this.state._arcSmall, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver:false
                }),
                Animated.timing(this.state._arcBig, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver:false
                }),
            ])
        ).start();
    }
    componentDidMount() {
        this.state._circleSmall.addListener(progress => {
            if (this._circleSmall)
                this._circleSmall.setNativeProps({ r: progress.value * 96, opacity: (1 - progress.value) / 4 });
        });
        this.state._circleBig.addListener(progress => {
            if (this._circleBig)
                this._circleBig.setNativeProps({ r: progress.value * 128, opacity: (1 - progress.value) / 4 });
        });
        this.state._arcSmall.addListener(progress => {
            if (this._arcSmall)
                this._arcSmall.setNativeProps({ opacity: progress.value / 2 });
        });
        this.state._arcBig.addListener(progress => {
            if (this._arcBig)
                this._arcBig.setNativeProps({
                    opacity: progress.value / 2,
                });
        });
        this.invokeAnimation();
    }
    render() {
        Keyboard.dismiss();
        return <View style={styles.container}>
           
           <Svg
      width={129}
      height={129}
      viewBox="0 -550 3200 4500"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      fillRule="evenodd"
      clipRule="evenodd"
    >
        <Ellipse
        ry={1200.588}
        rx={1200.182}
        cy={1400.61}
        cx={1400.593}
        strokeLinecap="1"
        strokeLinejoin="round"
        strokeDasharray={5}
        strokeWidth={5}
        stroke="blue"
        opacity={0} ref={ref => this._circleBig = ref}
        fill="#8cf1f5"
      />
      <Ellipse
        ry={2000.588}
        rx={2000.182}
        cy={1428.61}
        cx={1423.593}
        strokeLinecap="1"
        strokeLinejoin="round"
        strokeDasharray={5}
        strokeWidth={5}
        stroke="blue"
        opacity={0} ref={ref => this._circleBig = ref}
        fill="#8cf1f5"
        ref={ref => this._circleSmall = ref}
      />
      <Defs>
        <LinearGradient
          id="prefix__a"
          gradientUnits="userSpaceOnUse"
          x1={703.672}
          y1={444.305}
          x2={1873.43}
          y2={1243.59}
        >
          <Stop offset={0} stopColor="#009294" />
          <Stop offset={1} stopColor="#8c2e7c" />
        </LinearGradient>

      </Defs>
      <Path fill="none" d="M0 0h2791v2791H0z" />
      <Path
        d="M1710 938l-37-89V731c0-47-39-86-87-86h-83c-47 0-86 39-86 86v84c0 47 39 86 86 86h117l90 37z"
        fill="#8fc74a"
      />
      <Path
        d="M1796 948l-257 46c-94 16-183-47-200-140l-15-87c-16-93 46-183 139-200l88-15c93-16 183 46 199 140l46 256zm229-375l-131 23c-23 4-38 26-34 49l50 283-87 16-50-284c-13-71 35-138 105-151l131-23 16 87zm359 363L297 1304c-49 9-96-24-104-73l-73-412c-8-49 24-96 73-104l1885-333 16 89-58 10 16 88 57-11 35 197c5 29 20 55 41 74v1l12 9c29 20 64 27 98 21l162-28c9 49-24 95-73 104zM570 1062c4-8 6-17 4-26-1-10-7-18-15-24l-2-1c-8-5-17-6-26-5l-183 32c-33 6-66-1-94-20l-12-9v-1c-20-19-34-43-39-71-6-33 2-67 21-94s48-46 80-51l279-50 15 88-278 49c-10 2-18 7-24 15-5 8-8 18-6 27s6 17 13 22l2 2c8 6 18 8 28 6l183-32c31-6 62 1 88 17h1l5 4c27 19 46 48 52 81 5 28 0 56-13 81l-8 13c-19 27-48 46-81 51l-279 49-15-87 278-49c10-2 18-7 24-15l2-2zm396-323c2-4 5-7 7-11 28-40 70-67 118-75 48-9 96 2 136 30s66 70 75 118l40 227-87 16-40-228c-5-24-19-46-39-60s-45-20-70-16c-24 5-46 18-60 39-14 20-20 45-16 70l40 226-87 15-40-226c-4-24-18-46-39-60-20-14-45-20-70-16-24 5-46 19-60 39-15 20-20 46-16 70l40 227-87 16-40-227c-9-48 2-97 30-137s70-67 118-75c48-9 97 2 136 30 4 3 8 6 11 8z"
        fill="url(#prefix__a)" ref={ref => this._arcBig = ref}
      />
      <Path
        d="M2165 367l115-20c49-9 96 24 104 73l58 324-163 29c-11 2-22-1-31-7l-2-1c-8-7-13-16-15-26l-34-196 114-20-15-87-115 20-16-89z"
        fill="#f79633" 
      />
      <Path
        d="M757 1400l24 135c1 10 1 16 0 19l-14 9-72-1-66 4c-63 11-103 40-119 86-7 32-5 81 6 145l44 248c14 83 35 137 62 161s72 31 134 20c33-6 57-14 71-23s34-15 60-20c15-3 24 5 27 22l23 131c3 20-6 39-28 56-27 15-81 29-161 43-135 24-234 4-299-59-44-43-75-116-93-217l-73-416c-15-84-6-154 26-211 44-74 133-123 266-147 74-13 124-17 152-11 14 3 24 12 30 26zm345-95l185-33c13-2 22-2 29 2 7 2 16 12 27 30l403 898 7 18c3 17-7 27-28 31l-144 25c-14 3-25 1-33-6s-14-15-19-27l-49-106c-6-14-17-19-33-16l-201 35c-13 2-22 11-25 27l-8 121c2 8 0 16-5 24-5 7-15 14-31 20l-142 25c-18 3-29-5-32-23l-2-9-1-7 61-980c-1-18 2-30 9-35l32-14zm149 648l122-22c8-1 11-9 6-23l-110-248-7-8-6-5-8 17-11 269c0 15 4 22 14 20zm566 229l-163-922c-3-19-3-31 0-36 6-12 20-20 42-24l115-20c19-4 33-2 42 6 9 7 15 19 18 36l135 765c2 12 8 17 19 15l272-48c15-3 26-1 34 5 2 1 6 9 12 25l18 102c3 19 4 31 1 36-6 12-21 20-43 24l-442 78c-19 3-31 4-36 1-12-6-20-21-24-43zm830-270l23 130c3 18 2 29-4 34l-29 14-131 23c-15 3-27 2-33-3l-15-30-23-131c-3-15-2-26 3-31 5-6 15-11 31-17l130-23c18-3 29-1 34 5l14 29z"
        fill="url(#prefix__a)" ref={ref => this._arcSmall = ref}

      />
    </Svg>
        </View>
    };
}
const styles = StyleSheet.create({
    container: {
       backgroundColor:'transparent',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: '#613C92',
        fontSize: 15,
        paddingVertical: 5
    }
});