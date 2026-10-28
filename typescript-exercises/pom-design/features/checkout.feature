@storefront @checkout
Feature: GreenKart Checkout

  As a GreenKart shopper
  I want to review my order before paying
  So that I can confirm I am buying the right products at the right price

  Background:
    Given I am on the GreenKart storefront

  @smoke
  Scenario: Review a single-product order at checkout
    Given I have "Cucumber" in my cart
    When I proceed to checkout
    Then "Cucumber" should be included in the order summary
    And the order total should be greater than zero
