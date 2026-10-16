import pytest
from playwright.sync_api import Page, expect

@pytest.mark.flaky(reruns=2, reruns_delay=2)
def test_welcome_message_is_visible(page: Page) -> None:
	"""
	Verify that the welcome message is present and visible.
	"""
	
	page.goto("https://example.com")
	
	welcome_message = page.get_by_test_id("welcome-message")

	try:
		expect(welcome_message).to_be_visible(timeout=5000)

	except AssertionError as error:
		pytest.fail(
			f"welcome message is missing or not visible."
			f"Details: {error}",
			pytrace=False
			)