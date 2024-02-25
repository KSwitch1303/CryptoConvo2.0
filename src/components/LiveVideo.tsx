import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios'; // for making HTTP requests
import { useWallet } from "@solana/wallet-adapter-react";

import {
    LocalUser,
    RemoteUser,
    useJoin,
    useLocalCameraTrack,
    useLocalMicrophoneTrack,
    usePublish,
    useRemoteAudioTracks,
    useRemoteUsers,
  } from "agora-rtc-react";


type LiveVideoProps = {
    token: string
}

export const LiveVideo = (props: LiveVideoProps) => {

   

    const { publicKey } = useWallet();
    const base58Pubkey = publicKey.toBase58()
    const [isPending, setIsPending] = useState(false);
    const [applied, setApplied] = useState(false);
    
  const appId = '69c3c885e2ef4de5995793276cf21683'
  // const agoraEngine = useRTCClient( AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })); // Initialize Agora Client
  const { channelName } = useParams() //pull the channel name from the param
  const storePublicKey = async () => {
    if (!isPending) {
      try {
        setIsPending(true);
        console.log(channelName);
        const response = await axios.post('https://tokenserver-4u3r.onrender.com/store-key', { publicKey: publicKey?.toString(), channelName: channelName });
        console.log(response.data); // log the server response
        setIsPending(false);
        setApplied(true);
      } catch (error) {
        console.error(error);
      }
    }
    
  };
// console.log(channelToken);
  // set the connection state
  const [activeConnection, setActiveConnection] = useState(true);
  useEffect(() => {
    // If the wallet is not connected, delete the public key from the server
      axios.delete('https://tokenserver-4u3r.onrender.cos/delete-key', { data: { publicKey: base58Pubkey } });
      console.log('deleted');
  }, [activeConnection]);


  // track the mic/video state - Turn on Mic and Camera On
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);

  // get local video and mic tracks
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  // to leave the call
  const navigate = useNavigate()

  // Join the channel
  useJoin(
    {
      appid: appId,
      channel: channelName!,
      token: props.token
    },
    activeConnection,
  );
  console.log(props.token);
  usePublish([localMicrophoneTrack, localCameraTrack]);

  //remote users
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  // play the remote user audio tracks
  audioTracks.forEach((track) => track.play());


  return (
    <>
      <div id='remoteVideoGrid'>
        { 
          // Initialize each remote stream using RemoteUser component
          remoteUsers.map((user) => (
            <div key={user.uid} className="remote-video-container">
              <RemoteUser user={user} /> 
            </div>
          ))
        }
      </div>
      <div id='localVideo'>
        <LocalUser
          audioTrack={localMicrophoneTrack}
          videoTrack={localCameraTrack}
          cameraOn={cameraOn}
          micOn={micOn}
          playAudio={micOn}
          playVideo={cameraOn}
          className=''
        />
        <div>
          {/* media-controls toolbar component - UI controling mic, camera, & connection state  */}
          <div id="controlsToolbar">
            <div id="mediaControls">
              <button className="btn" onClick={() => setMic(a => !a)}>
                Mic
              </button>
              <button className="btn" onClick={() => setCamera(a => !a)}>
                Camera
              </button>
            </div>
            {/* <p>{props.token}</p> */}
            {applied ? null : <button onClick={storePublicKey} {...{ disabled: isPending }}>{isPending ? 'applying' : 'Apply for NFT'}</button>}
            <button id="endConnection"
                onClick={() => {
                  setActiveConnection(false)
                  navigate('/')
                }}> Disconnect
            </button>
          </div>
        </div>
      </div>
    </>
  )
}