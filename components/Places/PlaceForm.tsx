import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { Colors } from "../../constants/colors";
import { Location } from "../../types";
import { Place } from "../../models/place";
import Button from "../ui/Button";
import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";

type PlaceFormProps = {
  onCreatePlace: ({ title, imageUri, location }: Place) => void;
};

const PlaceForm: React.FC<PlaceFormProps> = ({ onCreatePlace }) => {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [pickedLocation, setPickedLocation] = useState<Location | undefined>(
    undefined
  );

  const changeTitleHandler = (enteredText: string) => {
    setEnteredTitle(enteredText);
  };

  const takeImageHandler = (imageUri: string) => {
    setSelectedImage(imageUri);
  };

  const pickLocationHandler = useCallback((location: Location) => {
    setPickedLocation(location);
  }, []);

  const savePlaceHandler = () => {
    if (selectedImage && pickedLocation) {
      const placeData = new Place(
        enteredTitle,
        selectedImage,
        pickedLocation,
        enteredTitle
      );
      onCreatePlace(placeData as Place);
    }
  };

  return (
    <ScrollView style={styles.form}>
      <View>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          onChangeText={changeTitleHandler}
          value={enteredTitle}
        />
      </View>
      <ImagePicker onTakeImage={takeImageHandler} />
      <LocationPicker onPickLocation={pickLocationHandler} />
      <Button onPress={savePlaceHandler}>Add Place</Button>
    </ScrollView>
  );
};

export default PlaceForm;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.primary500,
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomColor: Colors.primary700,
    borderBottomWidth: 2,
    backgroundColor: Colors.primary100,
  },
});
