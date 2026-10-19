from string_calculator.string_calculator import StringCalculator
import pytest

# Step 1: Test for empty string
def test_empty_string():
    calculator = StringCalculator()
    assert calculator.add("") == 0