// import {useEffect} from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios"; // for making HTTP requests
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useNavigate, useLocation } from "react-router-dom";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./Navbar.css";
// let base58Pubkey
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { publicKey } = useWallet(); // get the public key from the wallet
  const storePublicKey = async () => {
    try {
      const response = await axios.post(
        "https://tokenserver-4u3r.onrender.com/store-key",
        { publicKey: publicKey?.toString(), channelName: "MAIN" },
      );
      console.log(response.data); // log the server response
    } catch (error) {
      console.error(error);
    }
  };
  // useEffect(() => {
  //     // If the wallet is not connected, delete the public key from the server
  //     if (!connected || !publicKey) {
  //       axios.delete('http://localhost:5000/delete-key', { data: { publicKey: base58Pubkey } });
  //     }else{
  //         base58Pubkey = publicKey?.toBase58();
  //     }
  //   }, [connected, publicKey]);

  console.log(location.pathname);
  return (
    <div className="navbar">
      <WalletMultiButton />
      {location.pathname !== "/" && (
        <button onClick={() => navigate("/")}>Home</button>
      )}
      {location.pathname !== "/newChannel" && (
        <button onClick={() => navigate("/newChannel")}>Create Channel</button>
      )}
      <button onClick={storePublicKey}>Store Public Key</button>
    </div>
  );
};

export default Navbar;
