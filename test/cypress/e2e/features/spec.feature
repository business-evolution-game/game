Feature: Player movement and animation

  Scenario: Player moves and triggers animation
    Given the player is in the game scene
    When the player moves forward
    Then the move animation should start
    And the player position should update