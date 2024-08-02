import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { User } from "../../types";
import { useSocket } from "../../Contexts/socket.context";
import Loader from "../Loader";
import InviteButton from "./InviteButton";

const Avatar = ({ username }: { username: string }) => {
  return <div className="avatar">{username.slice(0, 2).toUpperCase()}</div>;
};

const Header = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get("sessionId");

  useEffect(() => {
    if (socket && sessionId) {
      socket.emit("get-connected-users", {
        sessionId,
      });

      socket.on("get-connected-users", ({ users }) => {
        console.log(users);
        setUsers(users);
        setLoading(false);
      });

      socket.on("user-joined", ({ user }) => {
        toast.info(`${user.username} joined`);
        setUsers((pre) => [...pre, user]);
      });

      socket.on("user-left", ({ username }) => {
        toast.error(`${username} left the room`);
        setUsers((pre) => pre.filter((user) => user.username !== username));
      });
    }

    return () => {
      if (socket) {
        socket.off("get-connected-users");
        socket.off("user-joined");
      }
    };
  }, [socket, sessionId]);

  const renderUsers = useMemo(() => {
    return users.map((user, index) => (
      <div className={`${index !== 0 && "nlm"}`} key={index}>
        <Avatar username={user.username} />
      </div>
    ));
  }, [users]);

  return (
    <div className="header position-absolute d-flex align-items-center justify-content-between ">
      <div>
        {loading && <Loader />}
        {!loading && <div className="d-flex">{renderUsers}</div>}
      </div>
      <InviteButton />
    </div>
  );
};

export default Header;
