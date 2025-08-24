import re
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Step 1: Navigate and fill out the first page
        page.goto("http://localhost:3000", timeout=30000)

        # Verify initial state
        expect(page.get_by_role("heading", name="Data Awal")).to_be_visible()

        # Select gender
        page.get_by_label("Laki-laki").check()

        # Input assets
        rp_input = page.locator("div.relative input[type='text']")
        expect(rp_input).to_be_visible()
        rp_input.type("1.000.000.000") # one billion
        expect(rp_input).to_have_value("1000000000")
        page.screenshot(path="jules-scratch/verification/01_step1_filled.png")

        page.get_by_role("button", name="Next ➡").click()

        # Step 2: Hutang page
        expect(page.locator("h1")).to_have_text("Step 2: Total Hutang")
        page.locator("div.relative input[type='text']").type("50.000.000") # 50 million
        page.get_by_role("button", name="Next ➡").click()

        # Step 3: Wasiat page
        expect(page.locator("h1")).to_have_text("Step 3: Wasiat")
        page.locator("div.relative input[type='text']").type("10.000.000") # 10 million
        page.get_by_role("button", name="Next ➡").click()

        # Step 4: Ahli Waris page - verify conditional field
        expect(page.locator("h1")).to_have_text("Step 4: Data Ahli Waris")

        # Verify "Istri" is visible and "Suami" is not
        expect(page.get_by_label("Istri")).to_be_visible()
        expect(page.get_by_label("Suami")).not_to_be_visible()

        # Take final screenshot for verification
        page.screenshot(path="jules-scratch/verification/verification.png")

        print("Verification script ran successfully.")

    except Exception as e:
        print(f"An error occurred during verification: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
