Feature: GreenKart Shopping Cart

  As a GreenKart customer
  I want to manage products in my cart
  So that I can review and purchase the products I need

  Background:
    Given I am on the GreenKart home page

  Scenario: Add a single product to the cart
    When I add "Cucumber" to my cart
    Then "Cucumber" should be included in my cart
    And the cart should contain 1 item

  Scenario: Add a product to the cart with invalid quantity
    When I attempt to add "Cucumber" with a quantity of -1 to my cart
    Then an error message should be displayed indicating invalid quantity
    And the cart should not include "Cucumber"

  Scenario: Add a product from search results
    When I search for "ber"
    And I add "Raspberry" to my cart
    Then "Raspberry" should be included in my cart

  Scenario: View an empty cart
    Given I have no products in my cart
    When I view my cart
    Then the cart should be empty
    And the cart total should be 0