class StringCalculator:
    def add(self, numbers: str) -> int:
        if not numbers:
            return 0
        else:
            return sum(int(num) for num in numbers.split(","))