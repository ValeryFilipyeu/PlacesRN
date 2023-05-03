import React, { useEffect, useState } from "react";
import { ScrollView, Image, View, Text, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import OutlinedButton from "../components/ui/OutlinedButton";
import { Colors } from "../constants/colors";
import { fetchPlaceDetails } from "../utils/database";
import { RootStackParamList } from "../types";
import { Place } from "../models/place";

type PlaceDetailsScreenProps = {
  route: RouteProp<RootStackParamList, "PlaceDetails">;
  navigation: NativeStackNavigationProp<RootStackParamList, "Map">;
};

const PlaceDetails: React.FC<PlaceDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const [fetchedPlace, setFetchedPlace] = useState<Place | undefined>(
    undefined
  );

  const showOnMapHandler = () => {
    if (fetchedPlace) {
      navigation.navigate("Map", {
        initialLat: fetchedPlace.location.lat,
        initialLng: fetchedPlace.location.lng,
        pickedLat: fetchedPlace.location.lat,
        pickedLng: fetchedPlace.location.lng,
      });
    }
  };

  const selectedPlaceId = route.params.placeId;

  useEffect(() => {
    async function loadPlaceData() {
      const place = await fetchPlaceDetails(selectedPlaceId);
      setFetchedPlace(place);
      navigation.setOptions({
        title: place.title,
      });
    }

    loadPlaceData().catch(() => {});
  }, [selectedPlaceId]);

  if (!fetchedPlace) {
    return (
      <View style={styles.fallback}>
        <Text>Loading place data...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: fetchedPlace.imageUri }} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{fetchedPlace.address}</Text>
        </View>
        <OutlinedButton icon="map" onPress={showOnMapHandler}>
          View on Map
        </OutlinedButton>
      </View>
    </ScrollView>
  );
};

export default PlaceDetails;

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: "35%",
    minHeight: 300,
    width: "100%",
  },
  locationContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primary500,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
