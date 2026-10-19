class StringCalculator:
    def add(self, numbers: str) -> int:
        if not numbers:
            return 0
        if numbers.startswith("//"):
            delimiter, numbers = numbers[2:].split("\n", 1)
            numbers = numbers.replace(delimiter, ",")
            
        normalized_numbers = numbers.replace("\n", ",")
        parts = [int(part) for part in normalized_numbers.split(",")]
        return sum(parts)
        