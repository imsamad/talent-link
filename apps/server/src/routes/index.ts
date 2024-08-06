import { asssetRtr } from "./assetRtr";
import { authRtr } from "./authRtr";
import { profileRtr } from "./profileRtr";

import { Router } from "express";

const mainRtr = Router();

mainRtr.use(asssetRtr);
mainRtr.use(authRtr);
mainRtr.use(profileRtr);

export { mainRtr };
