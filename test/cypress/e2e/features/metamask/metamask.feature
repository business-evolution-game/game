Feature: Connect Metamask
  Scenario: connect to local network
    Given player loaded the home page
    And player didnt connect to the wallet
    Then player should see connect button
