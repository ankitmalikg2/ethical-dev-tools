import os
from playwright.sync_api import sync_playwright, Page, expect

def verify_ui(page: Page):
    """
    This script performs a static verification of the Regex Matcher UI.
    It opens the HTML file directly to check the layout and styling,
    as running the full extension is not possible in this environment.
    """
    # 1. Arrange: Construct the file path to the HTML file.
    # The script is in jules-scratch/verification, so we go up two levels.
    file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'regexMatcher.html'))

    # 2. Act: Go to the local HTML file.
    page.goto(f"file://{file_path}")

    # 3. Assert: Check that the main components are visible.
    # This confirms the page has loaded correctly before taking the screenshot.
    expect(page.get_by_role("heading", name="Regex Matcher")).to_be_visible()
    expect(page.get_by_label("Regular Expression:")).to_be_visible()
    expect(page.get_by_label("Test String:")).to_be_visible()
    expect(page.get_by_role("heading", name="Explanation")).to_be_visible()
    expect(page.get_by_role("heading", name="Match Information")).to_be_visible()

    # 4. Screenshot: Capture the static UI for visual verification.
    screenshot_path = "jules-scratch/verification/verification.png"
    page.screenshot(path=screenshot_path)
    print(f"Screenshot saved to {screenshot_path}")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_ui(page)
        browser.close()

if __name__ == "__main__":
    main()