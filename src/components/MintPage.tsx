import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyForm: React.FC = () => {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  // const [projectid, setProjectid] = useState('');
  const [channelName, setChannelName] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [minted, setMinted] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsPending(true);
      console.log(channelName);
      const response = await axios.post('https://tokenserver-4u3r.onrender.com/mint', { 
        image,
        name,
        symbol,
        description,
        channelName
       });
      console.log(response.data); // log the server response
      setIsPending(false);
      setMinted(true);
      alert('NFT(s) Minted');
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input id="channelName" type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image Link" required />
      <input id="channelName" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
      <input id="channelName" type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="Symbol" required />
      <input id="channelName" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      {/* <input id="channelName" type="text" value={projectid} onChange={(e) => setProjectid(e.target.value)} placeholder="Project ID" /> */}
      <input id="channelName" type="text" value={channelName} onChange={(e) => setChannelName(e.target.value)} placeholder="Channel Name" required />
      {minted ? null : <button id="channelName" type="submit" disabled={isPending}>{isPending ? 'Minting...' : 'Mint' }</button> }
    </form>
  );
};

export default MyForm;
