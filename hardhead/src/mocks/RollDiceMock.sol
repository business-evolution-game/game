import "../RoleDiceI.sol";

contract RollDiceMock is RollDiceI{

    uint8 nextDiceValue;

    constructor(uint8 defaultValue){
        nextDiceValue=defaultValue;
    }

    function setNextDiceValue(uint8 value) public{
        nextDiceValue=value;
    }
    function rollDice() external override returns (uint8){
        return nextDiceValue;
    }
}