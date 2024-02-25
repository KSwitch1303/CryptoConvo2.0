import { useState } from 'react';
import axios from 'axios';

function CreateChannel() {

  const [channelName, setChannelName] = useState('');
  const [token, setToken] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [generated, setGenerated] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsPending(true);

      // Check if a collection with the channel name already exists
    let res = await axios.get(`https://tokenserver-4u3r.onrender.com/collection-exists?channelName=${channelName}`);
    if (res.data.collectionExists) {
      alert('A collection with this channel name already exists!');
      setIsPending(false);
      return;
    }

    res = await axios.post('https://tokenserver-4u3r.onrender.com/generate-token', { channelName });
    setToken(res.data.token);
    setIsPending(false);
    setGenerated(true);
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
        {generated ? null : <button type="submit" disabled={isPending}>{isPending ? 'Generating...' : 'Generate Channel Token'}</button>}
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