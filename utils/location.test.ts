import { getAddress, getMapPreview } from "./location";
import { GEOCODING_BASE_URL } from "../constants/urls";

describe("getAddress", () => {
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("should return the address for a given latitude and longitude", async () => {
    const lat = 37.7749;
    const lng = -122.4194;
    const expectedAddress =
      "San Francisco, California, United States of America";

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ display_name: expectedAddress }),
      } as Response)
    );

    const address = await getAddress(lat, lng);

    expect(address).toEqual(expectedAddress);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      `${GEOCODING_BASE_URL}/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
  });

  it("should throw an error if the fetch fails", async () => {
    const lat = 37.7749;
    const lng = -122.4194;

    jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: () => Promise.resolve({ error: "Failed to fetch address" }),
      } as Response)
    );

    await expect(getAddress(lat, lng)).rejects.toThrow(
      "Failed to fetch address!"
    );
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      `${GEOCODING_BASE_URL}/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
  });
});

describe("getMapPreview", () => {
  it("returns a string with the correct URL format", () => {
    const lat = 37.7749;
    const lng = -122.4194;
    const options = {
      zoom: 15,
      marker: true,
    };
    const result = getMapPreview(lat, lng, options);
    expect(result).toStrictEqual(
      "https://www.openstreetmap.org/export/embed.html?bbox=-122.4294,37.764900000000004,-122.40939999999999,37.7849&layer=mapnik&marker=37.7749,-122.4194&zoom=15&marker=37.7749,-122.4194"
    );
  });

  it("returns a string with the correct URL format when marker is false", () => {
    const lat = 37.7749;
    const lng = -122.4194;
    const options = {
      zoom: 15,
      marker: false,
    };
    const result = getMapPreview(lat, lng, options);
    expect(result).toStrictEqual(
      "https://www.openstreetmap.org/export/embed.html?bbox=-122.4294,37.764900000000004,-122.40939999999999,37.7849&layer=mapnik&marker=37.7749,-122.4194&zoom=15&"
    );
  });

  it("returns a string with the correct URL format when zoom is not provided", () => {
    const lat = 37.7749;
    const lng = -122.4194;
    const options = {
      marker: true,
    };
    const result = getMapPreview(lat, lng, options);
    expect(result).toStrictEqual(
      "https://www.openstreetmap.org/export/embed.html?bbox=-122.4294,37.764900000000004,-122.40939999999999,37.7849&layer=mapnik&marker=37.7749,-122.4194&zoom=15&marker=37.7749,-122.4194"
    );
  });
});
