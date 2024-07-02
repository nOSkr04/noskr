import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { data } from "@/constants/data";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Animated, { FadeInRight } from "react-native-reanimated";

type Props = {
  handleChangeCategory: (cat: string | null) => void; // Updated type here
  activeCategory: null | string;
};

const Categories = ({ handleChangeCategory, activeCategory }: Props) => {
  return (
    <FlatList
      horizontal
      contentContainerStyle={styles.flatlistContainer}
      showsHorizontalScrollIndicator={false}
      data={data.categories}
      keyExtractor={(item) => item}
      renderItem={({ item, index }) => {
        return (
          <CategoryItem
            item={item}
            index={index}
            isActive={activeCategory === item}
            handleChangeCategory={handleChangeCategory}
          />
        );
      }}
    />
  );
};

const CategoryItem = ({
  item,
  index,
  isActive,
  handleChangeCategory,
}: {
  item: string;
  index: number;
  handleChangeCategory: (cat: string | null) => void;
  isActive: boolean;
}) => {
  const color = isActive ? theme.colors.white : theme.colors.neutral(0.8);
  const backgroundColor = isActive
    ? theme.colors.neutral(0.8)
    : theme.colors.white;
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 200)
        .duration(1000)
        .springify()
        .damping(14)}
    >
      <Pressable
        style={[styles.category, { backgroundColor }]}
        onPress={() => handleChangeCategory(isActive ? null : item)}
      >
        <Text style={[styles.title, { color }]}>{item}</Text>
      </Pressable>
    </Animated.View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingHorizontal: wp(4),
    gap: 8,
  },
  category: {
    padding: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
  },
  title: {
    fontSize: hp(1.8),
    fontWeight: "500",
  },
});
