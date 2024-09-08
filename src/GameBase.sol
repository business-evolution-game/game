// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

abstract contract GameBase {

    enum GameStatus {REGISTRATION, STARTED, FINISHED, INTERRUPTED}
    GameStatus public status;

    type Position is uint8; //first 6 bites is step and the next bites is branch for example 11000110xb is 3 branch of 6 step
    enum CellType {UNKNOWN,BUSINESS, START, TAX, OFFICE}
    struct Cell {
        Position position;
        CellType cellType;

        uint startPrice;
        uint rentPrice;
        uint level;
        address owner;
    }

    struct Player {
        address addr;
        uint256 balance;
        Position position;
        bool exists;
    }

    Cell[60] public cells;
    mapping(Position=>uint8) cellIndexes; //mapping position to cell index in the cells array


    uint8 public totalSteps = 34;
    bool public gameStarted = false;
    uint8 public currentPlayerIndex = 0; // Track whose turn it is

    // Mappings
    mapping(address => Player) public players;
    address[] public playerAddresses;


    constructor(){
        status = GameStatus.REGISTRATION;
    }


    modifier onlyStartedGame() {
        require(status==GameStatus.STARTED, "This function can be executed only when the game id started.");
        _;
    }

    modifier onlyPlayer() {
        require(players[msg.sender].exists, "Only a registered player can execute this function.");
        _;
    }

    modifier onlyActivePlayer() {
        require(playerAddresses[currentPlayerIndex]==msg.sender, "Only active player can execute this function.");
        _;
    }

    function getCurrentPlayer() internal view virtual returns(Player memory);


    // Utility functions (e.g., for dice roll simulation)
    function rollDice() public view returns (uint8) {
        return uint8((block.timestamp + block.prevrandao) % 6 + 1);
    }
}