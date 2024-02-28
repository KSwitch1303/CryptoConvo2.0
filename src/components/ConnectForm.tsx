import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import "./ConnectForm.css";
interface ConnectFormProps {
  connectToVideo: (channelName: string, channelToken: string) => void;
}

export const ConnectForm = ({ connectToVideo }: ConnectFormProps) => {
  const { publicKey } = useWallet();

  const [channelName, setChannelName] = useState("");
  const [invalidInputMsg, setInvalidInputMsg] = useState("");
  const [channelToken, setChannelToken] = useState("");

  const handleConnect = async (e: React.FormEvent<HTMLFormElement>) => {
    // trim spaces
    const trimmedChannelName = channelName.trim();
    // await storePublicKey()
    // validate input: make sure channelName is not empty
    if (trimmedChannelName === "") {
      e.preventDefault(); // keep the page from reloading on form submission
      setInvalidInputMsg("Channel name can't be empty."); // show warning
      setChannelName(""); // resets channel name value in case user entered blank spaces
      return;
    }

    const trimmedChannelToken = channelToken.trim();

    // validate input: make sure channelName is not empty
    if (trimmedChannelToken === "") {
      e.preventDefault(); // keep the page from reloading on form submission
      setInvalidInputMsg("Channel name can't be empty."); // show warning
      setChannelName(""); // resets channel name value in case user entered blank spaces
      return;
    }

    connectToVideo(trimmedChannelName, trimmedChannelToken);
  };

  return (
    <>
      <form className="connect-form" onSubmit={handleConnect}>
        <div className="connect-form-container">
          <img src={"./logo.png"} className="logo" alt="logo" />
          <div className="card">
            <div className="form-group">
              <input
                className="form-control"
                id="channelName"
                type="text"
                placeholder="Channel Name"
                value={channelName}
                onChange={(e) => {
                  setChannelName(e.target.value);
                  setInvalidInputMsg(""); // clear the error message
                }}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                id="channelToken"
                type="text"
                placeholder="Channel Token"
                value={channelToken}
                onChange={(e) => {
                  setChannelToken(e.target.value);
                  setInvalidInputMsg(""); // clear the error message
                }}
              />
            </div>
            <button className="btn" disabled={!publicKey}>
              {publicKey ? "Connect to Call" : "Connect Wallet"}
            </button>
            {invalidInputMsg && (
              <p className="error-msg"> {invalidInputMsg} </p>
            )}
          </div>
        </div>
      </form>
    </>
  );
};
