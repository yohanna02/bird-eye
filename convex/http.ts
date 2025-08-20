import { httpRouter } from "convex/server";
import { userCreated } from "./httpActions";

const http = httpRouter();

http.route({
    path: "/new-user",
    method: "POST",
    handler: userCreated,
});

// Convex expects the router to be the default export of `convex/http.js`.
export default http;