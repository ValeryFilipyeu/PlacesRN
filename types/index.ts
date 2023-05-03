export type Location = {
  lat: number;
  lng: number;
  address?: string;
};

export type RootStackParamList = {
  AllPlaces: undefined;
  AddPlace: {
    pickedLat: number;
    pickedLng: number;
    initialLat: number;
    initialLng: number;
  };
  PlaceDetails: { placeId: string };
  Map: Record<string, number>;
};
