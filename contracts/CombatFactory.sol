//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract CombatFactory {
    address fighterFactoryAddress;

    uint idDigits = 16;
    uint idModulus = 10 ** idDigits;

    struct Combat {
        address owner;
        uint id;
        uint fighter1; 
        uint fighter2; 
        uint fighter3;
    }

    constructor() {
        fighterFactoryAddress = msg.sender;
    }

    mapping(address => Combat) public combatMap;

    function createCombat(uint _fighter1, uint _fighter2, uint _fighter3) public {
        uint _id = uint(keccak256(abi.encodePacked(msg.sender, blockhash(block.number - 1), _fighter1, _fighter2, _fighter3))) % idModulus;

        // TODO: check if the fighters are owned by the sender
        // TODO: check if the fighters are all different from each other :)
        Combat memory newCombat;
        newCombat.id = _id;
        newCombat.owner = msg.sender;
        newCombat.fighter1 = _fighter1;
        newCombat.fighter2 = _fighter2;
        newCombat.fighter3 = _fighter3;

        combatMap[msg.sender] = newCombat;

        console.log('[New Combat]', _id);
        console.log('[owner]', msg.sender);
        console.log('[fighter1]', _fighter1);
        console.log('[fighter2]', _fighter2);
        console.log('[fighter3]', _fighter3);
    }

    function getCurrentCombat() public view returns (uint) {
        return combatMap[msg.sender].id;
    }
    
}