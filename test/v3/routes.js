import { Hono } from "hono";
import v1Routes from "./v1/routes.js";

const routes = new Hono();

routes.route("/v1", v1Routes);

export default routes;
