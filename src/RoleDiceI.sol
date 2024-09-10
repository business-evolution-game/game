/*
* @dev This interface is using to get random dices and injecting into the game
*/
interface RollDiceI {

    /*
    * @dev this function return the generated value for two dices firs 3 bits is dice 1 and next 3 bites is dice 2
    * for example 0b011010 it means two dices with value 3 and 2
    */
    function rollDice() external returns (uint8);
}