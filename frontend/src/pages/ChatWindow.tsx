import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import API from "../api/Api_Config";
import { Button, Form, Input, message } from "antd";
import { Message, User } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { onMessage } from "firebase/messaging";
import { messaging } from "../utils/firebase";
import { ArrowLeft } from "lucide-react";

const ChatWindow = () => {
  const [form] = Form.useForm();
  const [selectedUser, setSelectedUser] = useState<User | null>();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [openMobileChatView, setOpenMobileChatView] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 450);
    };

    // Run on mount
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const sendMessage = async (data: { message: String; email: String }) => {
    console.log(data);
    try {
      setIsSending(true);
      data.email = selectedUser?.email || "";
      await API.Chat.SendMessage({ data });
      form.resetFields();
      callUserChats();
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Unable to send the message"
      );
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const callAllUsers = async () => {
      try {
        const res = await API.User.AllUsers();
        if (res.status === 200) {
          const allUsers = res?.data?.data || [];
          setUsers(allUsers);
          // console.log("All Users", allUsers);
        }
      } catch (error: any) {
        message.error(
          error?.response?.data?.message ||
            "Failed to log in. Please check your credentials."
        );
      }
    };
    callAllUsers();
  }, []);

  const callUserChats = async () => {
    try {
      const res = await API.Chat.UserChats({
        data: { email: selectedUser?.email },
      });
      if (res.status === 200) {
        const allMessages = res?.data?.data || [];
        setMessages(allMessages);
        // console.log("All Messages", allMessages);
      }
    } catch (error: any) {
      message.error(
        error?.response?.data?.message ||
          "Failed to log in. Please check your credentials."
      );
    }
  };
  useEffect(() => {
    if (selectedUser) callUserChats();
  }, [selectedUser]);
  onMessage(messaging, () => {
    callUserChats();
  });
  return (
    <div className="flex flex-1">
      {/* Sidebar */}
      <div
        className={`xs:min-w-[200px] md:min-w-[300px] min-w-full bg-gray-200 p-4 ${
          isMobileView && openMobileChatView ? "hidden" : "block"
        }`}
      >
        {users
          .filter((user) => user._id !== currentUser?._id)
          .map((user) => (
            <div
              key={user._id}
              className={`p-2 mb-2 flex items-center cursor-pointer rounded-lg ${
                selectedUser?._id === user._id
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
              onClick={() => {
                setSelectedUser(user);
                if (isMobileView) {
                  setOpenMobileChatView(true);
                }
              }}
            >
              <FaUserCircle className="text-2xl mr-2" />
              {user.name}
            </div>
          ))}
      </div>

      {/* Chat Window */}
      <div
        className={`flex-1 flex flex-col bg-white p-4 ${
          isMobileView && !openMobileChatView ? "hidden" : "block"
        }`}
      >
        {selectedUser ? (
          <>
            {isMobileView && (
              <span>
                <button
                  type="button"
                  onClick={() => {
                    setOpenMobileChatView(false) 
                    setMessages([])
                  }}
                  className="flex items-center gap-2 text-sm   hover:underline"
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
              </span>
            )}
            <h2 className="text-lg font-bold border-b pb-2">
              Chat with {selectedUser.name}
            </h2>
            <div className="flex-1  p-4 flex  flex-col-reverse overflow-y-auto max-h-full min-h-0 ">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 flex flex-col ${
                      msg.sender.user_id === currentUser?._id
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <span
                      className={`inline-block px-4 py-2 rounded-lg max-w-[180px]  sm:max-w-full break-words ${
                        msg.sender.user_id === currentUser?._id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300"
                      }`}
                    >
                      {msg.message}
                    </span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex-1 bg-gray-100 flex justify-center items-center text-center text-gray-500">
                    <p>Send your first message ....</p>
                  </div>
                </>
              )}
            </div>
            <div className="border-t p-2">
              <Form
                form={form}
                onFinish={sendMessage}
                className="flex items-center gap-2"
              >
                <Form.Item
                  name="message"
                  className="flex-1 mb-0"
                  rules={[
                    { required: true, message: "Enter message" },
                    { whitespace: true, message: "Message cannot be empty" },
                  ]}
                >
                  <Input
                    placeholder="Type a message..."
                    className="rounded-lg"
                  />
                </Form.Item>
                <Form.Item className="mb-0">
                  <Button type="primary" htmlType="submit" disabled={isSending}>
                    Send
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex justify-center items-center text-center text-gray-500">
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
