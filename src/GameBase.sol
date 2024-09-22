// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

abstract contract GameBase {

    //Events
    event GameStarted();
    event WaitingForPlayerAction(address indexed player);

    //Custom errors
    error WaitingForAnotherPlayerActionError(address currentPlayer, address senderPlayer);

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
        int256 balance;
        Position position;
        bool exists;
    }

    Cell[60] public cells;
    mapping(Position=>uint8) public cellIndexes; //mapping position to cell index in the cells array

    bool public gameStarted = false;
    uint8 public currentPlayerIndex = 0; // Track whose turn it is

    // Mappings
    mapping(address => Player) public players;
    address[] public playerAddresses;


    constructor(){
        status = GameStatus.REGISTRATION;
    }


    modifier onlyStartedGame() {
        require(status==GameStatus.STARTED, "Game has not started yet.");
        _;
    }
    modifier onlyPlayer() {
        require(players[msg.sender].exists, "Only a registered player can execute this function.");
        _;
    }
    modifier onlyActivePlayer(){
        if(msg.sender!=playerAddresses[currentPlayerIndex]){
            revert WaitingForAnotherPlayerActionError(playerAddresses[currentPlayerIndex], msg.sender);
        }
        _;
    }

    function createPositionValue(uint8 steps, uint8 branch) public pure returns(Position){
        require(steps < 64, "Steps must fit in 6 bits");
        require(branch <= 3, "Branch must be 0 to 3");

        uint8 encodedValue = (branch << 6) | steps;
        return Position.wrap(encodedValue);
    }
    function getPlayerStep(Player memory player) public returns(uint8){
        return Position.unwrap(player.position) & 0x3F;
    }

    function getCurrentPlayer() internal view virtual returns(Player memory);

    function startGame() public{
        status=GameStatus.STARTED;
        emit GameStarted();
        setupNextPlayer(0);
    }

    function setupNextPlayer(uint8 playerIndex) public virtual{
        emit WaitingForPlayerAction(playerAddresses[playerIndex]);
        currentPlayerIndex=playerIndex;
    }

}