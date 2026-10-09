from string_calculator import StringCalculator
import pytest

# Step 1: Test for empty, 1 number, and 2 numbers seprated by a comma
def test_empty_string():
    calculator = StringCalculator()
    assert calculator.add("") == 0\

def test_single_number():
    calculator = StringCalculator()
    assert calculator.add("1") == 1
    assert calculator.add("5") == 5

def test_two_comma_separated_numbers():
    calculator = StringCalculator()
    assert calculator.add("1,2") == 3
    assert calculator.add("10,20") == 30

# Step 2: Test for multiple comma-separated numbers
def test_multiple_comma_separated_numbers():
    calculator = StringCalculator()
    assert calculator.add("1,2,3") == 6
    assert calculator.add("1,2,3,4,5") == 15

# Step 3: Test for newlines as delimiters
def test_newlines_accepted_as_delimiters():
    calculator = StringCalculator()
    assert calculator.add("1\n2") == 3
    assert calculator.add("1\n2,3") == 6

# Step 4: Test for custom delimiters
def test_custom_delimiter_is_supported():
    calculator = StringCalculator()
    assert calculator.add("//;\n1;2") == 3
    assert calculator.add("//|\n1|2|3") == 6

# Step 5: Test for negative numbers
def test_negative_numbers_raise_exception():
    calculator = StringCalculator()
    
    with pytest.raises(ValueError, match="negatives not allowed -2"):
        calculator.add("1,-2")
        
    with pytest.raises(ValueError, match="negatives not allowed -2, -5"):
        calculator.add("1,-2,-5")