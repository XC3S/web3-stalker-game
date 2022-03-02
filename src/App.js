import React from 'react';
import './App.css';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import FighterFactory from './artifacts/contracts/FighterFactory.sol/FighterFactory.json';
import CombatFactory from './artifacts/contracts/CombatFactory.sol/CombatFactory.json';

const fighterFactoryAddress = "0x5fc8d32690cc91d4c39d9d3abcbd16989f875707";
const combatFactoryAddress = "0x61c36a8d610163660e21a8b7359e1cac0c9133e1";

function App() {
  
  const [fighterName, setFighterName] = useState();
  const [myFighters, setMyFighters] = useState([]);

  const [combatFighterId1, setCombatFighterId1] = useState();
  const [combatFighterId2, setCombatFighterId2] = useState();
  const [combatFighterId3, setCombatFighterId3] = useState();

  useEffect(() => {
    console.log('[Get Fighters Initially]');
    getMyFighters();
    getCurrentCombat();
  }, []);

  async function requestAccount(){
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function getCurrentCombat() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(combatFactoryAddress, CombatFactory.abi, provider)
      try {
        const data = await contract.getCurrentCombat()
        console.log('[Current Combat] ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  async function createCombat() {
    const fighter1Id = parseInt(combatFighterId1);
    const fighter2Id = parseInt(combatFighterId2);
    const fighter3Id = parseInt(combatFighterId3);

    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const contract = new ethers.Contract(combatFactoryAddress, CombatFactory.abi, signer)
      try {
        const data = await contract.createCombat(fighter1Id,fighter2Id,fighter3Id);
        console.log('[new Combat] ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  async function getMyFighterCount() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(fighterFactoryAddress, FighterFactory.abi, provider)
      try {
        const data = await contract.getMyFighterCount()
        console.log('[getMyFighterCount]', data)
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
        console.log('[getMyFighters]', res);

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
        console.log('[getAllFighters]', data)
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
                <div style={{'fontSize': '12px', 'color': 'grey'}}>{item.id}</div>
                <div>{item.stats.health}/{item.stats.baseHealth}</div>
              </div>
            })}
          </div>
        </div>
        <div>
          <h3>new Combat</h3>
          <input onChange={e => setCombatFighterId1(e.target.value)} placeholder="Fighter Id 1"/><br/>
          <input onChange={e => setCombatFighterId2(e.target.value)} placeholder="Fighter Id 2"/><br/>
          <input onChange={e => setCombatFighterId3(e.target.value)} placeholder="Fighter Id 3"/><br/>
          <button onClick={createCombat}>Create Combat</button>
        </div>
      </header>
    </div>
  );
}

export default App;
