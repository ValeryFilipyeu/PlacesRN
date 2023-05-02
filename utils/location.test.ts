import { getAddress, getMapPreview } from "./location";
import { GEOCODING_BASE_URL } from "../constants/urls";

describe('getAddress', () => {
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should return the address for a given latitude and longitude', async () => {
    const lat = 37.7749;
    const lng = -122.4194;
    const expectedAddress = 'San Francisco, California, United States of America';

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ display_name: expectedAddress }),
      } as Response)
    );

    const address = await getAddress(lat, lng);

    expect(address).toEqual(expectedAddress);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${GEOCODING_BASE_URL}/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
  });

  it('should throw an error if the fetch fails', async () => {
    const lat = 37.7749;
    const lng = -122.4194;

    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: () => Promise.resolve({ error: 'Failed to fetch address' }),
    } as Response));

    await expect(getAddress(lat, lng)).rejects.toThrow('Failed to fetch address!');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${GEOCODING_BASE_URL}/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
  });
});

describe('getMapPreview', () => {
  it('returns a valid map preview URL with the correct parameters', async () => {
    // Arrange
    const latitude: number = 37.7749;
    const longitude: number = -122.4194;
    const options: { width: number, height: number } = { width: 500, height: 300 };

    // Act
    const url: string = await getMapPreview(latitude, longitude, options);

    // Assert
    const urlRegex = "/assets/embed-cfaa69da71d35951f4fa0dff2f91b727a6ebaead68655ec8ccab1e5878f39c8b.js&width=500&height=300";
    expect(url).toMatch(urlRegex);
  });

  it('throws an error if the map preview URL cannot be retrieved', async () => {
    const lat = 37.7749;
    const lng = -122.4194;
    const options = { width: 500, height: 300 };

    // Mock the fetch function to always return an error
    global.fetch = jest.fn(() => Promise.reject(new Error('Failed to fetch map preview')));

    await expect(getMapPreview(lat, lng, options)).rejects.toThrow('Failed to fetch map preview');
  });
});
