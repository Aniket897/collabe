import { useState } from "react";
import { Button } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

const InviteButton = () => {
  const [copied, setIsCopied] = useState(false);
  const [searchParams] = useSearchParams();

  const handleCopyUrl = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(
      `${window.location.origin}/room?sessionId=${searchParams.get("sessionId")}`
    );
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };
  return (
    <Button onClick={handleCopyUrl}>
      {copied ? "Invite Url Copied" : "Copy Invite Url"}
    </Button>
  );
};

export default InviteButton;
