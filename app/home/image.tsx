import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import { hp, wp } from "@/helpers/common";
import { Image } from "expo-image";
import { theme } from "@/constants/theme";
import Animated, {
  FadeInDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Octicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const FLING_LIMIT = 160;
const springOptions = {
  damping: 15,
};

const AniamtedImage = Animated.createAnimatedComponent(Image);

const ImageScreen = () => {
  const router = useRouter();
  const item = useLocalSearchParams();
  const uri = item?.webformatURL;
  const [status, setStatus] = useState("");
  const fileName = item?.previewURL?.split("/").pop();
  const imageUrl = uri;
  const filePath = `${FileSystem.documentDirectory}${fileName}`;
  const getSize = () => {
    const aspectRatio = item.imageWidth / item.imageHeight;
    const maxWidth = Platform.OS === "web" ? wp(50) : wp(92);
    let calculateHeight = maxWidth / aspectRatio;
    let calculatedWidth = maxWidth;

    if (aspectRatio < 1) {
      calculatedWidth = calculateHeight * aspectRatio;
    }
    return {
      width: calculatedWidth,
      height: calculateHeight,
    };
  };
  const onLoad = () => {
    setStatus("");
  };

  const onDownload = async () => {
    setStatus("downloading");

    try {
      const { uri } = await FileSystem.downloadAsync(imageUrl, filePath);
      console.log("download", uri);
      setStatus("");
      return uri;
    } catch (err) {
      console.log(err);
    }
  };
  const onShare = async () => {
    setStatus("sharing");
    let uri = await onDownload();
    if (uri) {
      await Sharing.shareAsync(uri);
    }
  };

  const translation = {
    x: useSharedValue(0),
    y: useSharedValue(0),
  };

  const runOnlyOnce = useSharedValue(false);
  const goBack = () => {
    router.back();
  };
  const pan = Gesture.Pan()
    .onChange((event) => {
      translation.x.value += event.changeX;
      translation.y.value += event.changeY;

      if (
        event.translationY > FLING_LIMIT ||
        event.translationY < -FLING_LIMIT ||
        event.translationX > FLING_LIMIT ||
        event.translationX < -FLING_LIMIT
      ) {
        if (!runOnlyOnce.value) {
          runOnlyOnce.value = true;
          runOnJS(goBack)();
        }
      }
    })
    .onFinalize(() => {
      translation.x.value = withSpring(0, springOptions);
      translation.y.value = withSpring(0, springOptions);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translation.x.value },
        { translateY: translation.y.value },
        // prettier-ignore
        { scale: 1 - (Math.abs(translation.x.value) + Math.abs(translation.y.value)) / 1000 },
      ],
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          animatedStyle,
          { flex: 1, alignItems: "center", justifyContent: "center" },
        ]}
      >
        <BlurView style={styles.container} tint="dark" intensity={60}>
          <View style={[getSize()]}>
            <View style={styles.loading}>
              {status === "loading" && (
                <ActivityIndicator size={"large"} color={"white"} />
              )}
            </View>
            <AniamtedImage
              transition={100}
              style={[styles.image, getSize()]}
              source={uri}
              onLoad={onLoad}
              sharedTransitionTag={"WP"}
            />
          </View>
          <View style={styles.buttons}>
            <Animated.View entering={FadeInDown.springify()}>
              <Pressable style={styles.button} onPress={() => router.back()}>
                <Octicons name="x" size={24} color={"white"} />
              </Pressable>
            </Animated.View>
            <Animated.View entering={FadeInDown.springify().delay(100)}>
              {status === "download" ? (
                <View>
                  <ActivityIndicator color={"white"} />
                </View>
              ) : (
                <Pressable style={styles.button} onPress={onDownload}>
                  <Octicons name="download" size={24} color={"white"} />
                </Pressable>
              )}
            </Animated.View>
            <Animated.View entering={FadeInDown.springify().delay(200)}>
              <Pressable style={styles.button} onPress={onShare}>
                <Octicons name="share" size={24} color={"white"} />
              </Pressable>
            </Animated.View>
          </View>
        </BlurView>
      </Animated.View>
    </GestureDetector>
  );
};

export default ImageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(4),
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  image: {
    borderRadius: theme.radius.xl,
    borderWidth: 2,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.1)",
  },
  loading: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 50,
  },
  button: {
    height: hp(6),
    width: hp(6),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
  },
});
