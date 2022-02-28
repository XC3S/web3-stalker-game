import React from 'react';
import './App.css';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import FighterFactory from './artifacts/contracts/FighterFactory.sol/FighterFactory.json';

const fighterFactoryAddress = "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44";

function App() {
  
  const [fighterName, setFighterName] = useState();
  const [myFighters, setMyFighters] = useState([]);

  useEffect(() => {
    console.log('[Get Fighters Initially]');
    getMyFighters();
  }, []);

  async function requestAccount(){
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function getMyFighterCount() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(fighterFactoryAddress, FighterFactory.abi, provider)
      try {
        const data = await contract.getMyFighterCount()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  async function getMyFighters() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(fighterFactoryAddress, FighterFactory.abi, provider)
      try {
        const data = await contract.getMyFighters()

        const res = data.map((item) => {
          return {
            id: parseInt(item?.id?._hex, 16),
            name: item?.name,
            owner: item?.owner,
            dna: parseInt(item?.dna?._hex, 16),
            stats: {
              attack: parseInt(item?.attack?._hex, 16),
              defense: parseInt(item?.defense?._hex, 16),
              baseHealth: parseInt(item?.baseHealth?._hex, 16),
              health: parseInt(item?.health?._hex, 16),
            }
          }
        });

        setMyFighters(res);
        console.log('data: ', res);

      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  async function getAllFighters() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(fighterFactoryAddress, FighterFactory.abi, provider)
      try {
        const data = await contract.getAllFighters()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }
  

  async function createFighter(){
    if(!fighterName) return;
    if(typeof window.ethereum !== 'undefined'){
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(fighterFactoryAddress, FighterFactory.abi, signer);
      const transaction = await contract.createFighter(fighterName);
      console.log('[transaction]', transaction);
    }
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h3>Create Fighter</h3>
          <input onChange={e => setFighterName(e.target.value)} placeholder="Fighter Name"/>
          <button onClick={createFighter}>Create Fighter</button>
        </div>
        <div>
          <h3>Get</h3>
          <button onClick={getMyFighterCount}>getMyFighterCount</button><br/>
          <button onClick={getAllFighters}>getAllFighters</button><br/>
          <button onClick={getMyFighters}>getMyFighters</button><br/>
        </div>
        <div>
          <h3>My Fighters</h3>
          <div className='fighter-list'>
            {myFighters.map(item => {
              return <div className='fighter' key={item.id.toString()}>
                <div>{item.name}</div>
                <div>{item.stats.health}/{item.stats.baseHealth}</div>
              </div>
            })}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
