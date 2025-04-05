import { config, library } from "@fortawesome/fontawesome-svg-core";
import { 
  faHome, 
  faSync,        // Refresh
  faPlus,        // Add
  faEdit,        // Update
  faTrash,       // Delete
  faEye          // View
} from "@fortawesome/free-solid-svg-icons";

config.autoAddCss = false;

library.add(faHome, faSync, faPlus, faEdit, faTrash, faEye);
