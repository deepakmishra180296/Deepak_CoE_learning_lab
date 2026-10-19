class StringCalculator:
    def add(self, numbers: str) -> int:
        if not numbers:
            return 0
        else:
            normalized_numbers = numbers.replace("\n", ",")
            parts = [int(part) for part in normalized_numbers.split(",")]
            return sum(parts)
        