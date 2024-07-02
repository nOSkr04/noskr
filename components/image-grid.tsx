import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from "./image-card";
import { getColumnCount, wp } from "@/helpers/common";
const ImageGrid = ({ images, router }: { images: any; router: any }) => {
  const columns = getColumnCount();
  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images}
        contentContainerStyle={styles.listContainerStyle}
        numColumns={columns}
        renderItem={({ item, index }) => (
          <ImageCard item={item} index={index} router={router} />
        )}
        estimatedItemSize={200}
      />
    </View>
  );
};

export default ImageGrid;

const styles = StyleSheet.create({
  container: {
    minHeight: 3,
    width: wp(100),
  },
  listContainerStyle: {
    paddingHorizontal: wp(4),
  },
});
