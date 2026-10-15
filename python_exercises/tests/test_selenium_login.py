from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver


URL = "https://playwrightlab.github.io/login.html"
EMAIL = "test@playlab.com"
PASSWORD = "Password123"

def test_login():
    driver = webdriver.Chrome()
    wait =  WebDriverWait(driver, 10)

    try:
        driver.get(URL)

        email_input = wait.until(
            EC.presence_of_element_located((By.ID, "loginEmail"))
        )
        email_input.send_keys(EMAIL)

       
        password_input = wait.until(
            EC.presence_of_element_located((By.ID, "loginPassword"))
        )
        password_input.send_keys(PASSWORD)

       
        login_button = wait.until(
            EC.element_to_be_clickable((By.XPATH, '//*[@id="loginForm"]/button'))
        )
        login_button.click()

        
        success_message = wait.until(
            EC.presence_of_element_located((By.ID, "welcomeTitle"))
        )

        
        assert success_message.is_displayed(), "Login failed: Success message not displayed."

    finally:
       
        driver.quit()