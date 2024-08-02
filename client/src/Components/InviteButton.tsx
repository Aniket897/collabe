import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";

const InviteButton = () => {
  const { sessionId } = useParams();

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(
      `http://localhost:5173/room?invite=${sessionId}`
    );
  };
  return <Button onClick={handleCopyUrl}>Invite Peoples</Button>;
};

export default InviteButton;
