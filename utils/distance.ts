import { CONFIG } from "@/config/api";

export async function getDistance(origin: string, destination: string) {
    const apiKey = CONFIG.GOOGLE_PLACES_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.rows[0].elements[0].status === "OK") {
            const distanceText = data.rows[0].elements[0].distance.text as string; // e.g. "5.2 km"
            const distanceValue = data.rows[0].elements[0].distance.value; // in meters

            return {
                distanceKm: distanceValue / 1000,
                distanceText
            };
        } else {
            throw new Error("No route found");
        }
    } catch (_) {
        return null
    }
}

export function calculateFee(distanceKm: number) {
    const baseFee = 500; // base charge in $
    const perKm = 100; // charge per km
    return baseFee + distanceKm * perKm;
}