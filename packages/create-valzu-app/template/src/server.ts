import { createServer } from "valzu-core";
import HomePage from "../pages/index";

createServer([{ path: "/", component: HomePage }]);
