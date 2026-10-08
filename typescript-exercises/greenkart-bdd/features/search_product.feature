Feature: GreenKart Product Search

  As a GreenKart customer
  I want to search for products
  So that I can quickly find the products I want to purchase

  Background:
    Given I am on the GreenKart home page

  Scenario: Search for an existing product
    When I search for "Cucumber"
    Then "Cucumber" should be displayed in the search results

  Scenario: Search using a partial product name
    When I search for "ber"
    Then products matching "ber" should be displayed in the search results

  Scenario: Search for a product using different capitalization
    When I search for "CUCUMBER"
    Then "Cucumber" should be displayed in the search results

  Scenario: Search for a product that is not available
    When I search for "Laptop"
    Then no products should be displayed in the search results