import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import PlaceForm from "../components/Places/PlaceForm";
import { insertPlace } from "../utils/database";
import { Place } from "../models/place";
import { RootStackParamList } from "../types";

type AddPlaceProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "AllPlaces">;
};

const AddPlace: React.FC<AddPlaceProps> = ({ navigation }) => {
  const createPlaceHandler = async (place: Place) => {
    await insertPlace(place);
    navigation.navigate("AllPlaces");
  }

  return <PlaceForm onCreatePlace={createPlaceHandler} />;
};

export default AddPlace;
