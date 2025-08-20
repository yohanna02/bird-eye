import { makeUseQueryWithStatus } from "convex-helpers/react";
import { useQueries as useConvexQueries } from "convex/react";

export default makeUseQueryWithStatus(useConvexQueries);