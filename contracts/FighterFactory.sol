//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract FighterFactory {

    uint idDigits = 16;
    uint idModulus = 10 ** idDigits;

    uint dnaDigits = 16;
    uint dnaModulus = 10 ** dnaDigits;

    struct Fighter {
        address owner;
        string name;
        uint id;
        uint baseHealth;
        uint health;
        uint attack;
        uint defense;
        uint dna;
    }

    mapping (uint => address) public fighterToOwner;
    mapping (address => uint) ownerFighterCount; // replace with ownerToFighters.length ??ß
    mapping (address => Fighter[]) public ownerToFighters;
    mapping (uint => Fighter) public fighterFromId;
    // generate an Id and map it to the fighter?

    Fighter[] public fighters;
    
    function getMyFighterCount() public view returns (uint) {
        return ownerFighterCount[msg.sender];
    }

    function getAllFighters() public view returns (Fighter[] memory) {
        return fighters;
    }

    function getMyFighters() public view returns (Fighter[] memory) {
        return ownerToFighters[msg.sender];
    }

    function createFighter(string memory _name) public {
        uint _id = uint(keccak256(abi.encodePacked(msg.sender, blockhash(block.number - 1)))) % idModulus;
        uint randDna = _generateRandomDna(_name);
        console.log("Creating fighter with dna: ", randDna);

        Fighter memory  _fighter = Fighter(msg.sender, _name, _id, 1000, 1000, 10, 10, randDna);

        fighters.push(_fighter);
        //uint fighterId = fighters.length - 1;
        fighterToOwner[_id] = msg.sender;
        fighterFromId[_id] = _fighter;
        ownerFighterCount[msg.sender]++;
        ownerToFighters[msg.sender].push(_fighter);

        console.log('create fighter done');
        console.log('total fighters: ', fighters.length);
    }

    function _generateRandomDna(string memory _str) private view returns (uint) {
        // @TODO: Don't generate the dna based on the name since Players could simulate the outcome
        uint rand = uint(keccak256(abi.encodePacked(_str)));
        return rand % dnaModulus;
    }
}
