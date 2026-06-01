// Reverse geocoding via OpenStreetMap Nominatim — free, no API key needed
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&accept-language=en`,
      {
        headers: {
          "User-Agent": "DoorTrack/1.0 (field-attendance-tracking)",
          "Accept-Language": "en",
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timer);

    if (!res.ok) return null;
    const data = await res.json();
    const a = data.address ?? {};

    const parts: string[] = [];
    const street = a.road
      ? `${a.house_number ? a.house_number + " " : ""}${a.road}`
      : null;
    if (street) parts.push(street);
    const locality =
      a.neighbourhood || a.suburb || a.quarter || a.village || a.town || a.city;
    if (locality && locality !== street) parts.push(locality);
    if (a.city && a.city !== locality) parts.push(a.city);
    if (a.state) parts.push(a.state);

    return parts.length
      ? parts.slice(0, 3).join(", ")
      : (data.display_name ?? null);
  } catch {
    return null;
  }
}
