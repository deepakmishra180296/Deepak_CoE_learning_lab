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

@pytest.fixture(scope="session")
def browser_type_launch_args(browser_type_launch_args):
    # Always run headless, even if --headed is passed
    return {**browser_type_launch_args, "headless": True}

@pytest.fixture(autouse=True)
def global_error_handler(page):

    error_messages = []

    def handle_console_error(msg):
        if msg.type == "error":
            logger.error(f"[CONSOLE ERROR] {msg.text}")
            error_messages.append(msg.text)

    def handle_crash():
        logger.error("[PAGE CRASH] The page crashed unexpectedly!")

    def handle_page_error(exception):
        logger.error(f"[PAGE ERROR] {exception}")

    def handle_dialog(dialog):
        # Playwright auto-dismisses dialogs silently; record them so they are visible
        logger.error(f"[DIALOG:{dialog.type}] {dialog.message}")
        error_messages.append(f"[dialog:{dialog.type}] {dialog.message}")
        dialog.dismiss()

    page.on("dialog", handle_dialog)
    page.on("console", handle_console_error)
    page.on("crash", handle_crash)
    page.on("pageerror", handle_page_error)

    yield error_messages
