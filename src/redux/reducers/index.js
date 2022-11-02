import {combineReducers} from 'redux';
import Settings from './Setting';
import Common from './Common';
import Products from './Products';
import General from './General';
import Movements from './Movements';
import Providers from './Providers';
import Clients from './Clients';
import FileExplorer from './FileExplorer';
import Finances from './Finances';
import User from './User';
import Carriers from './Carriers';
import ToDoApp from './ToDoApp';
import MyBilling from './MyBilling';
import Requests from './Requests';
import Notifications from './Notifications';

const reducers = combineReducers({
  settings: Settings,
  common: Common,
  products: Products,
  general: General,
  movements: Movements,
  providers: Providers,
  clients: Clients,
  fileExplorer: FileExplorer,
  finances: Finances,
  user: User,
  todoApp: ToDoApp,
  carriers: Carriers,
  myBilling: MyBilling,
  requests: Requests,
  notifications: Notifications,
});
export default reducers;
