import { useState } from 'react';
import axios from 'axios';

function CreateChannel() {

  const [channelName, setChannelName] = useState('');
  const [token, setToken] = useState('');
  


  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await axios.post('https://tokenserver-4u3r.onrender.com/generate-token', { channelName });
    setToken(res.data.token);
  };


    return (
        <div className="createchannel">
            <h1>create form</h1>
            <form onSubmit={handleSubmit}>
        <label>
          Channel Name:
          <div className="card">
             <input type="text" value={channelName} onChange={(e) => setChannelName(e.target.value)} />
          </div>
         
        </label>
        <button type="submit">Generate Token</button>
      </form>
      {token && (
        <>
          <p>{token}</p>
          <button onClick={() => {navigator.clipboard.writeText(token); alert("copied")}}>Copy</button>
        </>
        
      )}
        </div>
     );
}

 
export default CreateChannel;