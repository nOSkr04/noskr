import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ACCENT_COLOR, BACKDROP_COLOR } from "@/components/misc/colors";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { HEIGHT, OVERDRAG } from "@/components/misc/consts";
import AccentPicker from "@/components/AccentPicker";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ProductSheet = () => {
  const offset = useSharedValue(0);
  const translateY = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));
  const accent = useSharedValue(ACCENT_COLOR);
  const pan = Gesture.Pan()
    .onChange((event) => {
      const offsetDelta = event.changeY + offset.value;

      const clamp = Math.max(-OVERDRAG, offsetDelta);
      offset.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp);
    })
    .onFinalize(() => {
      if (offset.value < HEIGHT / 3) {
        offset.value = withSpring(0);
      } else {
        offset.value = withTiming(HEIGHT, {}, () => {
          runOnJS(() => console.log("close"))();
        });
      }
    });
  return (
    <>
      <AnimatedPressable
        style={styles.backdrop}
        entering={FadeIn}
        exiting={FadeOut}
        // onPress={toggleSheet}
      />
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[styles.sheet, translateY]}
          entering={SlideInDown.springify().damping(15)}
          exiting={SlideOutDown}
        >
          <AccentPicker
            onPick={(color: any) => {
              accent.value = color;
              console.log("close");
            }}
          />
        </Animated.View>
      </GestureDetector>
    </>
  );
};

export default ProductSheet;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BACKDROP_COLOR,
    zIndex: 1,
  },
  sheet: {
    backgroundColor: "white",
    padding: 16,
    height: HEIGHT,
    width: "100%",
    position: "absolute",
    bottom: -OVERDRAG * 1.1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 1,
  },
});
