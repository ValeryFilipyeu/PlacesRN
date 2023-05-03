import { Location } from "../types";

export class Place {
  title: string;
  imageUri: string;
  location: Location;
  id: string;
  address?: string;
  constructor(title: string, imageUri: string, location: Location, id: string) {
    this.title = title;
    this.imageUri = imageUri;
    this.address = location.address;
    this.location = location;
    this.id = id;
  }
}
