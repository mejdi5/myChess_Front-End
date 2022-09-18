import { persistStore } from 'redux-persist'
import { Store } from './Store'

const persistor = persistStore(Store)

export default persistor;