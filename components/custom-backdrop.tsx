import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const CustomBackdrop = ({ animatedIndex, style }) => {
  const containerAniamtedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity,
    };
  });
  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.overlay, containerAniamtedStyle]}
    >
      <BlurView style={StyleSheet.absoluteFill} tint="dark" intensity={25} />
    </Animated.View>
  );
};

export default CustomBackdrop;

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
