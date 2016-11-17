import devStore from './store.dev'
import prodStore from './store.prod'

function getStore() {
    if (process.env.NODE_ENV === 'production') {
        return prodStore();
    } else {
        return devStore();
    }
}

export default getStore;