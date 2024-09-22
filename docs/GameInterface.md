
## Events
```solidity 
event GameStarted();
event WaitingForPlayerAction(address indexed player);
event BusinessPurchased(address player, uint8 positoin);
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
    
   
```


## Custom errors
```solidity 
error WaitingForAnotherPlayerActionError(address currentPlayer, address senderPlayer);
```

