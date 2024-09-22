// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./GameMechanics.sol";

import "hardhat/console.sol";

contract MainGame is GameMechanics{

    uint8 public playerCount;

    constructor(RollDiceI _rollDice, uint8 _playerCount) GameMechanics(_rollDice){
        require(_playerCount<5 && _playerCount>1, "One board require 2 to 4 players.");
        playerCount=_playerCount;
        addPlayer();
    }

    function join() external{
        require(status==GameStatus.REGISTRATION, "The game is already started.");
        require(players[msg.sender].addr == address(0), "You are already joined");

        addPlayer();
        if(playerAddresses.length==playerCount){
            startGame();
        }
    }

    function addPlayer() internal{
        playerAddresses.push(msg.sender);
        players[msg.sender] = Player({
            addr:msg.sender,
            balance:100000,
            position:Position.wrap(0),
            exists:true
        });
    }
}