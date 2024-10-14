import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import feedReducer from "./slices/feedSlice";
import connectionReducer from "./slices/conectionSlice";
import requestReducer from "./slices/requestSlice";
import chatReducer from "./slices/chatSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionReducer,
    requests: requestReducer,
    chat: chatReducer
  },
});

export default store;
