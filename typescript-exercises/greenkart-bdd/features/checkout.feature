Feature: GreenKart Checkout

  As a GreenKart customer
  I want to complete my checkout
  So that I can successfully place my order

  Scenario: Proceed to checkout with a single product
    Given I have "Cucumber" in my cart
    When I proceed to checkout
    Then "Cucumber" should be included in the order summary

  Scenario: Proceed to checkout with multiple products
    Given I have "Cucumber" and "Beans" in my cart
    When I proceed to checkout
    Then "Cucumber" should be included in the order summary
    And "Beans" should be included in the order summary

  Scenario: Calculate the order total correctly
    Given I have "Cucumber" and "Beans" in my cart
    When I proceed to checkout
    Then the order total should equal the sum of the individual product totals