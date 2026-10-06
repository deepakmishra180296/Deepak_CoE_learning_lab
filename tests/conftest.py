import pytest
import logging

logging.basicConfig(
    level = logging.INFO,
    format = '%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler("test_error.log", mode='w'),
        logging.StreamHandler()
    ]

)

logger = logging.getLogger(__name__)

@pytest.fixture(autouse=True)
def global_error_handler(page):

    def handle_console_error(msg):
        if msg.type == "error":
            logger.error(f"[CONSOLE ERROR] {msg.text}")

    def handle_crash():
        logger.error("[PAGE CRASH] The page crashed unexpectedly!")

    page.on("console", handle_console_error)
    page.on("crash", handle_crash)

    yield
