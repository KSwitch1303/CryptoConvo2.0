import  { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ConnectForm } from './components/ConnectForm';
import { LiveVideo } from './components/LiveVideo';
import CreateChannel from './components/CreateChannel';

import AgoraRTC, {
  AgoraRTCProvider,
  useRTCClient,
} from "agora-rtc-react";

import './App.css';

import * as web3 from "@solana/web3.js";
import {
  ConnectionProvider,
  WalletProvider
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets";

import Navbar from './components/Navbar';

const endpoint = web3.clusterApiUrl("devnet");
const wallets = [new walletAdapterWallets.PhantomWalletAdapter()];

function App() {
  const navigate = useNavigate();
  const agoraClient = useRTCClient( AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })); // Initialize Agora Client
  const [channelTK, setChannelTK] = useState(''); // use useState for channelTK

  const handleConnect = (channelName: string, channelToken: string ) => {
    setChannelTK(channelToken); // set channelTK using the setter from useState
    navigate(`/via/${channelName}`); // on form submit, navigate to new route
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>
          <Navbar />
          <div className="content">
            <Routes>
              <Route path='/' element={ <ConnectForm connectToVideo={ handleConnect } /> } />
              <Route path='/via/:channelName' element={
                <AgoraRTCProvider client={agoraClient}>
                  <LiveVideo token={channelTK} />
                </AgoraRTCProvider>
              } />
              <Route path='/newChannel' element={ <CreateChannel /> } />
            </Routes>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App;
