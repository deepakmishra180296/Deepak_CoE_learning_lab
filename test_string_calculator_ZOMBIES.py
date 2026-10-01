import pytest
from string_calculator_ZOMBIES import StringCalculatorZOMBIES

# Z - Zero
def test_empty_string():
    calculator = StringCalculatorZOMBIES()
    assert calculator.add("") == 0

# O - One
def test_one_number():
    calculator = StringCalculatorZOMBIES()
    assert calculator.add("1") == 1
    assert calculator.add("5") == 5

# M - Many (or More complex)
def test_multiple_comma_separated_numbers():
    calculator = StringCalculatorZOMBIES()
    assert calculator.add("1,2") == 3
    assert calculator.add("1,2,3,4,5") == 15

def test_multiple_numbers_with_newline_delimiters():
    calculator = StringCalculatorZOMBIES()
    assert calculator.add("1\n2,3") == 6

# B - Boundary Behaviors
def test_boundary_custom_delimiter():
    calculator = StringCalculatorZOMBIES()
    assert calculator.add("//;\n1;2") == 3

def test_boundary_numbers_greater_than_1000():
    calculator = StringCalculatorZOMBIES()
    assert calculator.add("2,1001") == 2
    assert calculator.add("1000,1") == 1001

# E - Exercise Exceptional behavior
def test_negative_numbers_raise_error():
    calculator = StringCalculatorZOMBIES()
    with pytest.raises(ValueError, match="negatives not allowed -2"):
        calculator.add("1,-2")
    with pytest.raises(ValueError, match="negatives not allowed -2, -5"):
        calculator.add("1,-2,-5")
