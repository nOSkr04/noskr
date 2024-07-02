import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import Categories from "@/components/categories";
import { apiCall } from "@/api";
import ImageGrid from "@/components/image-grid";
import { debounce } from "lodash";
import FiltersModal from "@/components/filters-modal";
import { useRouter } from "expo-router";
const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<TextInput>(null);
  const [images, setImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState<null | string>(null);
  const modalRef = useRef(null);
  const scrollRef = useRef(null);
  const router = useRouter();
  const [isEndReached, setIsEndReached] = useState(false);
  const handleChangeCategory = (cat: string | null) => {
    setActiveCategory(cat);
    clearSearch();
    setImages([]);

    let params = {
      page: 1,
    };
    if (cat) {
      params["category"] = cat;
    }
    fetchImages(params, false);
  };

  const fetchImages = async (params = { page: 1 }, append = true) => {
    let res = await apiCall(params);
    if (res.success && res?.data?.hits) {
      if (append) {
        setImages([...images, ...res?.data?.hits]);
      } else {
        setImages([...res?.data?.hits]);
      }
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.length > 2) {
      setImages([]);
      fetchImages({ page: 1, q: text }, false);
      setActiveCategory(null);
    }
    if (text === "") {
      setImages([]);
      searchInputRef.current?.clear();
      fetchImages({ page: 1 }, false);
      setActiveCategory(null);
    }
  };

  const clearSearch = () => {
    setSearch("");
    searchInputRef.current?.clear();
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  const openFiltersModal = () => {
    modalRef.current?.present();
  };

  const closeFilterModal = () => {
    modalRef.current.close();
  };

  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;

    if (scrollOffset >= bottomPosition - 1) {
      if (!isEndReached) {
        setIsEndReached(true);
        console.log("END");
      }
    } else if (isEndReached) {
      setIsEndReached(false);
    }
  };

  const handleScrollUp = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>
        <Pressable onPress={openFiltersModal}>
          <FontAwesome6
            name="bars-staggered"
            color={theme.colors.neutral(0.7)}
            size={22}
          />
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        onScroll={handleScroll}
        scrollEventThrottle={5}
        ref={scrollRef}
      >
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather
              name="search"
              size={24}
              color={theme.colors.neutral(0.4)}
            />
          </View>
          <TextInput
            placeholder="Search for photos"
            style={styles.searchInput}
            value={search}
            onChangeText={handleTextDebounce}
            ref={searchInputRef}
          />
          {search && (
            <Pressable style={styles.closeIcon} onPress={clearSearch}>
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>
        <View style={styles.categories}>
          <Categories
            handleChangeCategory={handleChangeCategory}
            activeCategory={activeCategory}
          />
        </View>
        <View>
          {images?.length > 0 && <ImageGrid images={images} router={router} />}
        </View>
      </ScrollView>
      <FiltersModal modalRef={modalRef} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  title: {
    fontSize: hp(4),
    fontWeight: "600",
    color: theme.colors.neutral(0.9),
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentContainer: {
    gap: 15,
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    padding: 6,
    paddingLeft: 10,
    borderRadius: theme.radius.lg,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    fontSize: hp(1.8),
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 8,
    borderRadius: theme.radius.sm,
  },
  categories: {},
});
