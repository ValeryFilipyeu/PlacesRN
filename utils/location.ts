import { GEOCODING_BASE_URL } from "../constants/urls";

type MapPreviewOptions = {
  width: number;
  height: number;
  zoom?: number;
  marker?: boolean;
};

export async function getAddress(lat: number, lng: number) {
  const url = `${GEOCODING_BASE_URL}/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch address!");
  }

  const data: Record<string, unknown> = await response.json();

  return data.display_name as string;
}

export async function getMapPreview(lat: number, lng: number, options: MapPreviewOptions): Promise<string> {
  const { width, height, zoom = 15, marker = true } = options;
  const markerParams = marker ? `marker=${lat},${lng}` : '';
  const url = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}&zoom=${zoom}&${markerParams}`;

  const response = await fetch(url);
  const html = await response.text();

  const regex = /src="(.*?)"/;
  const match = regex.exec(html);

  if (match && match.length > 1) {
    const imageUrl = match[1];

    return `${imageUrl}&width=${width}&height=${height}`;
  } else {
    throw new Error('Failed to retrieve map preview image URL');
  }
}
