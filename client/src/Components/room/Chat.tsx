import { MessageCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Message } from "../../types";
import { useSocket } from "../../Contexts/socket.context";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../Contexts/auth.context";
import { toast } from "sonner";

const MessageContainer = ({ message }: { message: Message }) => {
  return (
    <div className="message">
      <div className="avatar">{message.username.slice(0, 2).toUpperCase()}</div>
      <p className="message_text">{message.text}</p>
    </div>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");
  const { socket } = useSocket();
  const [searchParams] = useSearchParams();
  const { uid, profile } = useAuth();

  useEffect(() => {
    if (socket) {
      socket.on("new-message", ({ username, text }) => {
        console.log(username, text);
        if (!show) {
          toast.info(`new message from ${username}`);
        }
        setMessages((pre) => [...pre, { username, text }]);
      });
    }

    return () => {
      if (socket) {
        socket.off("new-message");
      }
    };
  }, [socket, show]);

  useEffect(() => {
    if (socket) {
      socket.emit("sync-messages", {
        sessionId: searchParams.get("sessionId"),
      });

      socket.on("sync-messages", ({ messages }) => {
        console.log("MESSAGES :", messages);
        setMessages(messages);
      });
    }

    return () => {
      if (socket) {
        socket.off("sync-messages");
      }
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (!text) return;
    socket?.emit("send-message", {
      userId: uid,
      username: profile?.given_name,
      sessionId: searchParams.get("sessionId"),
      text,
    });
    setMessages([...messages, { username: profile?.given_name, text }]);
    setText("");
  };

  return (
    <div className="chat position-absolute">
      <div
        className="chat_triggerar"
        onClick={() => {
          setShow(!show);
        }}
      >
        <div className="chatBtn">
          <MessageCircle size={20} />
        </div>
      </div>
      {show && (
        <div className="chat_box bg-white">
          <div className="border-bottom d-flex align-items-center chat_header">
            <p className="p-2">Chats</p>
          </div>
          <div className="chat_container">
            {messages?.map((message, index) => {
              return <MessageContainer key={index} message={message} />;
            })}
          </div>
          <div className="chat_footer">
            <input
              className="p-2"
              placeholder="type a message..."
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button onClick={handleSendMessage}>
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
