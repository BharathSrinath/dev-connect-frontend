import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setChats,
  setMessages,
  setActiveChat,
  addMessage,
} from "../store/slices/chatSlice";
import axiosInstance from "../utils/axios";
import { socket } from "../utils/socket";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const ChatPage = () => {
  const dispatch = useDispatch();
  const { chats, messages, activeChat } = useSelector((state) => state.chat);
  const connections = useSelector((state) => state.connections);
  const loggedInUser = useSelector((state) => state.user);

  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredConnections, setFilteredConnections] = useState([]);

  const fetchChats = () => async (dispatch) => {
    const { data } = await axiosInstance.get("/user/chat");
    dispatch(setChats(data));
  };

  const fetchMessages = (chatId) => async (dispatch) => {
    const { data } = await axiosInstance.get(`/user/chat/${chatId}`);
    dispatch(setMessages(data));
  };

  const sendMessage = (messageData) => async (dispatch) => {
    const { data } = await axiosInstance.post(
      "/user/chat/message",
      messageData
    );
    dispatch(addMessage(data));
  };

  const createOrFetchChat = async (connection) => {
    try {
      const { data } = await axiosInstance.post("/user/chat", {
        userId: connection._id,
      });
      dispatch(setChats([...chats, data]));
      handleChatSelect(data);
    } catch (error) {
      console.error("Error creating or fetching chat:", error);
    }
  };

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const handleChatSelect = (chat) => {
    dispatch(setActiveChat(chat));
    dispatch(fetchMessages(chat._id));
    socket.emit("join chat", chat._id);
  };

  const handleSendMessage = async () => {
    if (newMessage && activeChat) {
      const token = Cookies.get("token");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken._id;
      const messageData = {
        content: newMessage,
        chatId: activeChat._id,
        sender: {
          _id: userId,
        },
      };

      setNewMessage("");
      dispatch(sendMessage(messageData));
      socket.emit("new message", messageData);
    }
  };

  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (activeChat && newMessageReceived.chatId === activeChat._id) {
        dispatch(addMessage(newMessageReceived));
      }
    });

    return () => {
      socket.off("message received");
    };
  }, [activeChat, dispatch]);

  useEffect(() => {
    if (connections && searchQuery) {
      setFilteredConnections(
        connections.filter((connection) =>
          `${connection.firstName} ${connection.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredConnections([]);
    }
  }, [searchQuery, connections]);

  const handleConnectionClick = (connection) => {
    const chat = chats.find((chat) =>
      chat.users.some((user) => user._id === connection._id)
    );
    if (chat) {
      handleChatSelect(chat);
    } else {
      createOrFetchChat(connection);
    }
  };

  return (
    <div className="flex h-[89vh]">
      {/* Chat List with Search */}
      <div className="w-1/3 border-r border-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4">Chats</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search connections..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-bordered w-full mb-4"
        />

        {/* Display filtered connections if there is a search query */}
        {searchQuery && filteredConnections.length > 0
          ? filteredConnections.map((connection) => (
              <div
                key={connection._id}
                className="p-2 cursor-pointer bg-gray-100 mb-2"
                onClick={() => handleConnectionClick(connection)}
              >
                {connection.firstName} {connection.lastName}
              </div>
            ))
          : chats.map((chat) => (
              <div
                key={chat._id}
                className={`p-2 cursor-pointer ${
                  activeChat?._id === chat._id ? "bg-gray-100" : ""
                }`}
                onClick={() => handleChatSelect(chat)}
              >
                {loggedInUser && (
                  <>
                    {chat.users[0].firstName === loggedInUser.firstName
                      ? chat.users[1].firstName
                      : chat.users[0].firstName}{" "}
                    {chat.users[0].lastName === loggedInUser.lastName
                      ? chat.users[1].lastName
                      : chat.users[0].lastName}
                  </>
                )}
              </div>
            ))}
      </div>

      {/* Chat Messages */}
      <div className="w-2/3 p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages &&
            messages.map((message) => (
              <div
                key={message._id}
                className={`p-2 ${
                  message.sender._id === loggedInUser._id
                    ? "text-right bg-blue-100"
                    : "text-left bg-gray-100"
                } mb-2`}
              >
                <p>{message.content}</p>
                <span className="text-sm font-semibold">
                  {message.sender.firstName}
                </span>
              </div>
            ))}
        </div>

        {/* Input for new message */}
        {activeChat && (
          <div className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 border p-2"
              onKeyUp={handleEnterPress}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 ml-2 rounded-md"
            >
              Send Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
