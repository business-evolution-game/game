Feature: Player movement and animation

  Scenario: Player moves and triggers animation
    Given the player is in the game scene
    When the player moves forward
    Then the move animation should start
    And the player position should update


#
#  Scenario: Join to deployed contract by address
#    Given game contract for {3} players deployed to the network
#    And only one player are joined to the game contract
#    And players logged in using metamask wallet
#
#    When the player send the join by address form
#    And the player is already joined to the game
#    Then the waiting for players page should be opened