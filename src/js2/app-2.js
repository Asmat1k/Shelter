import * as flsFunctions from "./modules/functions.js";

import { burger } from "./functions/burger.js";
import { popup } from "./functions/popup.js";
import "./functions/pagination.js";

let popupLinks = document.querySelectorAll('.popup-link');

burger();
popup(popupLinks);

flsFunctions.isWebp();