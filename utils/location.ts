import { GEOCODING_BASE_URL } from "../constants/urls";

type MapPreviewOptions = {
  zoom?: number;
  marker?: boolean;
};

export async function getAddress(lat: number, lng: number): Promise<string> {
  const url = `${GEOCODING_BASE_URL}/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch address!");
  }

  const data: Record<string, unknown> = await response.json();

  return data.display_name as string;
}

export function getMapPreview(
  lat: number,
  lng: number,
  options: MapPreviewOptions
): string {
  const { zoom = 15, marker = true } = options;
  const markerParams = marker ? `marker=${lat},${lng}` : "";

  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${
    lat - 0.01
  },${lng + 0.01},${
    lat + 0.01
  }&layer=mapnik&marker=${lat},${lng}&zoom=${zoom}&${markerParams}`;
}
