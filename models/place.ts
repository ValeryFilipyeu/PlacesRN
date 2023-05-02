export class Place {
  title: string;
  imageUri: string;
  location: { lat: number; lng: number; address?: string };
  id: string;
  address?: string;
  constructor(
    title: string,
    imageUri: string,
    location: { lat: number; lng: number; address?: string },
    id: string
  ) {
    this.title = title;
    this.imageUri = imageUri;
    this.address = location.address;
    this.location = { lat: location.lat, lng: location.lng }; // { lat: 0.141241, lng: 127.121 }
    this.id = id;
  }
}
