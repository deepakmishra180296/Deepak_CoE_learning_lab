@storefront @cart
Feature: GreenKart Shopping Cart

  As a GreenKart shopper
  I want to add products to my cart
  So that I can keep track of what I intend to buy

  Background:
    Given I am on the GreenKart storefront

  @smoke
  Scenario: Add a single product to the cart
    When I add "Cucumber" to my cart
    Then "Cucumber" should be included in my cart
    And my cart should contain 1 item
