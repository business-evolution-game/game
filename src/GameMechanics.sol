// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./CellManagement.sol";
import "./CustomAgreements.sol";
import "hardhat/console.sol";
import "./RoleDiceI.sol";

contract GameMechanics is CellManagement, CustomAgreements {
    // Event for player movement
    event PlayerMoved(address player, uint8 newPosition);

    /**
    * @param status - {'WAITING_FOR_MOVE' | 'ANY_USER_ACTION' | 'CHOOSING_BRANCH' | 'WAITING_PAYMENT'}
    * @param payload - is parameter that can have different value depends on the user status
    * @notice here is a list with data structure for all possible statuses
    *   WAITING_FOR_MOVE -
    *   ANY_USER_ACTION -
    *   CHOOSING_BRANCH - [newPlayerStep:uint8, branches:uint8]
    *   WAITING_PAYMENT - [paymentValue:uint]
    */
    event ChangedPlayerStatus(address player, string status, bytes payload);

//    error WaitingForAnotherPlayerActionError(address currentPlayer, address senderPlayer);

    //Constants
//    uint8 constant NOT_SETUP_PLAYER = 10;

    RollDiceI rollDice;

    //Game state
    enum CurrentPlayerAction {WAITING_FOR_MOVE,ANY_USER_ACTION, CHOOSING_BRANCH, WAITING_PAYMENT}


    uint8 currentDiceValue;
    CurrentPlayerAction public currentPlayerAction;

    constructor(RollDiceI _rollDice) CellManagement() CustomAgreements(){
        rollDice = _rollDice;
        currentPlayerAction = CurrentPlayerAction.WAITING_FOR_MOVE;
    }


    function setupNextPlayer() public{
        currentPlayerIndex = (currentPlayerIndex + 1) % uint8(playerAddresses.length);
        super.setupNextPlayer(currentPlayerIndex);
    }

    function getCurrentPlayer() internal view override returns(Player memory){
        return players[playerAddresses[currentPlayerIndex]];
    }

    // Take player turn and handle movement
    function takeTurn() external onlyStartedGame onlyPlayer onlyActivePlayer {

        currentDiceValue = rollDice.rollDice();
        uint8 moveFor = getCurrentDicesSum();
        uint8 newPlayerStep = getPlayerStep(players[msg.sender])+moveFor;
        uint8 branches = getStepBranchesCount(newPlayerStep);

        if(branches > 1){
            currentPlayerAction=CurrentPlayerAction.CHOOSING_BRANCH;
            emit ChangedPlayerStatus(msg.sender, 'CHOOSING_BRANCH', abi.encode(newPlayerStep, branches));
            return;
        }
        movePlayer(newPlayerStep, 0);
    }

    function chooseBranch(uint8 branch) external onlyStartedGame onlyPlayer onlyActivePlayer {
        require(currentPlayerAction==CurrentPlayerAction.CHOOSING_BRANCH, "You are not on the choosing branch state");

        uint8 moveFor = getCurrentDicesSum();
        uint8 newPlayerStep = getPlayerStep(players[msg.sender])+moveFor;
        uint8 branches = getStepBranchesCount(newPlayerStep);

        require(branches>=branch, "You truing move to branch that out of the available branches");
        movePlayer(newPlayerStep, branch);
    }

    function movePlayer(uint8 step, uint8 branch) internal{
        Position newPosition = createPositionValue(step, branch);
        players[msg.sender].position = newPosition;
        emit PlayerMoved(msg.sender, Position.unwrap(newPosition));

        Cell memory cell = cells[cellIndexes[newPosition]];
        if(cell.cellType==CellType.BUSINESS){
            if(cell.owner!=address(0)){
                uint paymentValue = getPaymentValue(msg.sender, newPosition);
                if(paymentValue>0){
                    currentPlayerAction=CurrentPlayerAction.WAITING_PAYMENT;
                    console.log("should pay ",paymentValue);
                    emit ChangedPlayerStatus(msg.sender, 'WAITING_PAYMENT', abi.encode(paymentValue));
                    return;
                }
            }else{
                //TODO: bye the business
            }
        }else{
            //TODO: processing another cell types
        }
        currentPlayerAction=CurrentPlayerAction.ANY_USER_ACTION;
        emit ChangedPlayerStatus(msg.sender, 'ANY_USER_ACTION', "");
    }

    function nextPlayer() external onlyStartedGame onlyPlayer onlyActivePlayer{
        //todo: check current player status
        setupNextPlayer();
    }

    function makePayment() external onlyStartedGame onlyPlayer onlyActivePlayer{
        require(currentPlayerAction==CurrentPlayerAction.WAITING_PAYMENT, "You are not on the waiting for payment state");

        uint paymentValue = getPaymentValue(msg.sender, players[msg.sender].position);
        require(players[msg.sender].balance > int256(paymentValue), "Your balance is too low.");

        //TODO: check the type of payment (another player or bank)
        //TODO: change the balance

    }


    function getCurrentDicesSum() public returns (uint8 sum) {
        return ((currentDiceValue >> 3) & 0x07) + (currentDiceValue & 0x07);
    }
}