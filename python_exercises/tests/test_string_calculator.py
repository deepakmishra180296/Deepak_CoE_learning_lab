from string_calculator.string_calculator import StringCalculator
import pytest

# Step 1: Test for empty string
def test_empty_string():
    calculator = StringCalculator()
    assert calculator.add("") == 0

def test_single_number():
    calculator = StringCalculator()
    assert calculator.add("1") == 1
    assert calculator.add("5") == 5

def test_two_comma_separated_numbers():
    calculator = StringCalculator()
    assert calculator.add("1,2") == 3
    assert calculator.add("10,20") == 30