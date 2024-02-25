import { useState } from 'react'
import { useWallet } from "@solana/wallet-adapter-react";
interface ConnectFormProps {
  connectToVideo: (channelName: string,channelToken: string) => void
}

export const ConnectForm = ({ connectToVideo } : ConnectFormProps) => {
  const { publicKey  } = useWallet();
  
  const [channelName, setChannelName] = useState('')
  const [invalidInputMsg, setInvalidInputMsg] = useState('')
  const [channelToken, setChannelToken] = useState('')
  
  const handleConnect = async (e: React.FormEvent<HTMLFormElement>) => {
    
    // trim spaces
    const trimmedChannelName = channelName.trim()
    // await storePublicKey() 
    // validate input: make sure channelName is not empty
    if (trimmedChannelName === '') {
      e.preventDefault() // keep the page from reloading on form submission
      setInvalidInputMsg("Channel name can't be empty.") // show warning
      setChannelName('') // resets channel name value in case user entered blank spaces 
      return;
    } 

    const trimmedChannelToken = channelToken.trim()
    
    // validate input: make sure channelName is not empty
    if (trimmedChannelToken === '') {
      e.preventDefault() // keep the page from reloading on form submission
      setInvalidInputMsg("Channel name can't be empty.") // show warning
      setChannelName('') // resets channel name value in case user entered blank spaces 
      return;
    } 
  
    connectToVideo(trimmedChannelName,trimmedChannelToken)
  }

  return (
    <>
      <form onSubmit={handleConnect}>
        <img src={"./logo.png"} className="logo" alt="logo" />
        <div className="card">
          <input 
            id="channelName"
            type='text'
            placeholder='Channel Name'
            value={channelName}
            onChange={(e) => {
              setChannelName(e.target.value)
              setInvalidInputMsg('') // clear the error message
            }}
          />
          <input 
            id="channelName"
            type='text'
            placeholder='Channel Token'
            value={channelToken}
            onChange={(e) => {
              setChannelToken(e.target.value)
              setInvalidInputMsg('') // clear the error message
            }}
          />
          {publicKey ? <button>Connect to Call</button> : <button disabled>Connect Wallet</button>}
          
          { invalidInputMsg && <p style={{color: 'red'}}> {invalidInputMsg} </p>}
        </div>
      </form>
    </>
    
  )
}