import * as React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store'; 
import Index from './index'

console.log(store)
function App(){
    return(
    <Provider store={store}>
        <Index/>
    </Provider>

    );
}

export default App

