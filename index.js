import getStore from './src/store/configureStore';
import { startServer } from './src/server/server';


export const store = getStore();
startServer(store);

