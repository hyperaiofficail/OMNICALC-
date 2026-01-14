from playwright.sync_api import sync_playwright
import os

def verify_calculator():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Open the local file
        cwd = os.getcwd()
        page.goto(f"file://{cwd}/777.html")

        # Test 1: Valid Calculation 1 + 2 =
        # Click 1
        page.get_by_role("button", name="1").click()
        # Click +
        page.get_by_role("button", name="+").click()
        # Click 2
        page.get_by_role("button", name="2").click()
        # Click =
        page.get_by_role("button", name="=").click()

        # Wait for result
        # The display is in #curr-display
        page.wait_for_function("document.getElementById('curr-display').innerText === '3'")
        result = page.inner_text("#curr-display")
        print(f"1 + 2 result: {result}")

        # Screenshot valid
        page.screenshot(path="verification/valid_calc.png")

        # Test 2: Security check
        # Inject malicious code into currentExp and trigger calculate
        print("Injecting malicious code...")
        # Since currentExp is let, it might not be on window, but evaluate runs in global scope?
        # Actually evaluate runs in the context of the page.
        # If currentExp is not accessible via window, we can try assigning it directly if it's in scope.
        # If it was defined with let in top level script, it is in global block scope.
        # Page.evaluate runs in global scope.

        page.evaluate("currentExp = 'alert(1)'")
        page.evaluate("calculate()")

        # Check result
        # Should be "Error"
        page.wait_for_function("document.getElementById('curr-display').innerText === 'Error'")
        security_result = page.inner_text("#curr-display")
        print(f"Malicious input result: {security_result}")

        # Screenshot security
        page.screenshot(path="verification/security_check.png")

        browser.close()

if __name__ == "__main__":
    verify_calculator()
