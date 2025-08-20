import { api } from "@/convex/_generated/api";
import convexQueries from "@/utils/convexQueries";

export default function useUserType() {

    const { status, data } =
        convexQueries(api.queries.getUserType);

    return { status, data };
}