
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux"
import store from "./redux/store.jsx"
import LinedDrawingTest from "./LineDrawingTest.jsx"
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <LinedDrawingTest />
  </Provider>
);
