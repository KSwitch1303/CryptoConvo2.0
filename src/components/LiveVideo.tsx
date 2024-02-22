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
    
  const appId = '69c3c885e2ef4de5995793276cf21683'
  // const agoraEngine = useRTCClient( AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })); // Initialize Agora Client
  const { channelName } = useParams() //pull the channel name from the param
// console.log(channelToken);
  // set the connection state
  const [activeConnection, setActiveConnection] = useState(true);
  useEffect(() => {
    // If the wallet is not connected, delete the public key from the server
      axios.delete('http://localhost:5000/delete-key', { data: { publicKey: base58Pubkey } });
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