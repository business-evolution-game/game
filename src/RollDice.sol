import "./RoleDiceI.sol";

contract RollDice is RollDiceI{
    
    function rollDice() external override returns (uint8){
        uint8 dice1 = uint8((block.timestamp + block.prevrandao) % 6 + 1);
        uint8 dice2 = uint8((block.timestamp + block.prevrandao + 1) % 6 + 1);
        return (dice1 << 3) | (dice2 & 0x07);
    }
}