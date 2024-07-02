import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Message from "./Message";
import ArrowLeftIcon from "./icons/ArrowLeftIcon";
import SettingsIcon from "./icons/SettingsIcon";
import { messages } from "./misc/messages";
import MicrophoneIcon from "./icons/MicrophoneIcon";
import SendIcon from "./icons/SendIcon";
import { BORDER_COLOR, PRIMARY_COLOR } from "./misc/colors";
import { Link } from "expo-router";

function Chat(props: any) {
  const { toggleSheet, accent } = props;

  return (
    <>
      <SafeAreaView style={styles.headerContainer} edges={["top"]}>
        <View style={styles.wrapper}>
          <ArrowLeftIcon />
          <Text style={styles.title}>Casper</Text>
          <TouchableOpacity onPress={toggleSheet}>
            <SettingsIcon />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <FlatList
        data={messages}
        inverted
        contentContainerStyle={styles.reverse}
        renderItem={({ item }) => (
          <Message key={item.id} message={item} accent={accent} />
        )}
        keyExtractor={(item) => item.id}
      />
      <SafeAreaView style={styles.footerContainer} edges={["bottom"]}>
        <View style={styles.wrapper}>
          <MicrophoneIcon />
          <View style={styles.textWrapper}>
            <Text style={styles.text}>Message</Text>
          </View>
          <SendIcon />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  reverse: {
    flexDirection: "column-reverse",
  },
  wrapper: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  headerContainer: {
    backgroundColor: "white",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER_COLOR,
  },
  footerContainer: {
    backgroundColor: "white",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER_COLOR,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },
});

export default Chat;
