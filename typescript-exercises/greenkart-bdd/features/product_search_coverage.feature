Feature: GreenKart Product Search Coverage

  As a GreenKart customer
  I want the product search to return exactly the products that match what I type
  So that I can trust the results and quickly find the products I want to purchase

  Background:
    Given I am on the GreenKart home page
    And the full product catalog has loaded

  @search @positive
  Scenario Outline: Search returns exactly the matching products
    When I type "<search term>" into the product search
    Then the product results should be exactly "<expected products>"

    Examples:
      | search term     | expected products                                                |
      | Cucumber - 1 Kg | Cucumber - 1 Kg                                                  |
      | Tomato          | Tomato - 1 Kg                                                    |
      | CARROT          | Carrot - 1 Kg                                                    |
      | bEeTrOoT        | Beetroot - 1 Kg                                                  |
      | Ca              | Cauliflower - 1 Kg, Carrot - 1 Kg, Capsicum, Cashews - 1 Kg      |
      | melon           | Musk Melon - 1 Kg, Water Melon - 1 Kg                            |
      | Water Melon     | Water Melon - 1 Kg                                               |

  @search @negative
  Scenario Outline: Search terms that match no product show no results
    When I type "<search term>" into the product search
    Then no product cards should be shown
    And the no-results message should be shown

    Examples: Near-misses and non-product text
      | search term | reason                                         |
      | Pizza       | non-existent product                           |
      | Tomatoe     | misspelling of Tomato                          |
      | Broccoli    | standard spelling, catalog spells Brocolli     |
      | 12345       | digits only                                    |
      | @#$%        | special characters                             |
      | <script>    | HTML tag is treated as plain text              |

  @search @negative
  Scenario Outline: Regex-special characters are treated as literal text
    When I type "<search term>" into the product search
    Then no product cards should be shown
    And the no-results message should be shown

    Examples: Regex metacharacters
      | search term | reason                      |
      | (           | unbalanced group opener     |
      | [           | unbalanced character class  |
      | .*          | regex match-anything        |
      | \\\\        | double backslash           |

  @search @negative
  Scenario: A single backslash is treated as literal text
    When I type a single backslash into the product search
    Then no product cards should be shown
    And the no-results message should be shown

  @search @negative
  Scenario: Search recovers after a special-character search
    When I type "@#$%" into the product search
    Then no product cards should be shown
    When I type "Tomato" into the product search
    Then the product results should be exactly "Tomato - 1 Kg"

  @search @edge
  Scenario: An empty search shows the full catalog
    When I type "" into the product search
    Then the product results should be the full catalog

  @search @edge @known-bug
  Scenario: A whitespace-only search is treated as empty and shows the full catalog
    When I type "   " into the product search
    Then the product results should be the full catalog

  @search @edge
  Scenario Outline: Short and partial terms match every product containing them
    When I type "<search term>" into the product search
    Then the product results should be exactly "<expected products>"

    Examples:
      | search term | expected products                                                                                   |
      | y           | Raspberry - 1/4 Kg, Strawberry - 1/4 Kg                                                             |
      | 1/4         | Raspberry - 1/4 Kg, Strawberry - 1/4 Kg, Almonds - 1/4 Kg, Pista - 1/4 Kg, Walnuts - 1/4 Kg        |

  @search @edge @known-bug
  Scenario: Leading and trailing spaces around a valid term are ignored
    When I type " Apple " into the product search
    Then the product results should be exactly "Apple - 1 Kg"

  @search @edge
  Scenario: Searching the weight suffix matches every product except Capsicum
    When I type "Kg" into the product search
    Then the product results should be every product except "Capsicum"

  @search @edge
  Scenario: A 256-character search shows no results
    When I type a product search of 256 characters
    Then no product cards should be shown
    And the no-results message should be shown

  @search @edge
  Scenario: Clearing the search after a filtered search restores the full catalog
    When I type "Tomato" into the product search
    Then the product results should be exactly "Tomato - 1 Kg"
    When I clear the product search
    Then the product results should be the full catalog

  @search @edge
  Scenario: Replacing one search term with another shows only the new term's products
    When I type "Apple" into the product search
    Then the product results should be exactly "Apple - 1 Kg"
    When I replace the product search with "Mango"
    Then the product results should be exactly "Mango - 1 Kg"

  @search @edge
  Scenario: Clicking the search button after typing a term keeps the filtered results
    When I type "Mango" into the product search
    And I click the product search button
    Then the product results should be exactly "Mango - 1 Kg"
