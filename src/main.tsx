import { StrictMode } from "react";
import ReactDOM from 'react-dom/client';
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { /*persistor,*/ store } from "./redux/store/store.js";
import { BrowserRouter } from "react-router-dom";
// import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      {/* <PersistGate loading={null} persistor={persistor}> */}
        <Provider store={store}>
          <App />
        </Provider>
      {/* </PersistGate> */}
    </BrowserRouter>
  </StrictMode>
);
