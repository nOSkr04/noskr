import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import CustomBackdrop from "./custom-backdrop";

const FiltersModal = ({ modalRef }) => {
  const snapPoints = useMemo(() => ["25%"], []);
  return (
    <BottomSheetModal
      enablePanDownToClose
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={CustomBackdrop}
    >
      <BottomSheetView>
        <></>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default FiltersModal;

const styles = StyleSheet.create({});
