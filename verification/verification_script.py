
import os
from playwright.sync_api import Page, expect, sync_playwright

def test_calculator(page: Page):
    # Get absolute path to the file
    cwd = os.getcwd()
    file_path = os.path.join(cwd, '777.html')
    url = f"file://{file_path}"

    print(f"Navigating to {url}")
    page.goto(url)

    # Calculate 5!
    # Click 5
    page.get_by_role("button", name="5").click()

    # Click x!
    # The button text is x!, function is fact
    page.get_by_role("button", name="x!").click()

    # Click =
    page.get_by_role("button", name="=").click()

    # Verify result
    # The display is in #curr-display
    # 5! = 120
    expect(page.locator("#curr-display")).to_have_text("120")

    print("Calculation verified: 5! = 120")

    # Screenshot
    page.screenshot(path="verification/baseline.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_calculator(page)
        except Exception as e:
            print(f"Test failed: {e}")
            exit(1)
        finally:
            browser.close()
