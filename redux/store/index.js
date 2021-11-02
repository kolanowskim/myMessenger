import { createStore } from "redux";
import currentChatReducer from "../reducers/currentChatReducer";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(currentChatReducer);

export default store;
