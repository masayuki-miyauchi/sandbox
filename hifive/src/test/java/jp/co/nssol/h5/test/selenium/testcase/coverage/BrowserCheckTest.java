package jp.co.nssol.h5.test.selenium.testcase.coverage;

import jp.co.nssol.h5.test.selenium.base.H5TestCase;

import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class BrowserCheckTest extends H5TestCase {
	public BrowserCheckTest(WebDriver driver) {
		super(driver);
	}

	@Test
	public void showBrowserCheckPage() throws InterruptedException {

		WebElement locationBox = querySelector("#location").get(0);
		locationBox.clear();
		locationBox
		.sendKeys("http://localhost:8080/htmlhifiveWeb/coverage/webdriver/sandboxInternal/coverage/");
		WebElement openInFrame = querySelector("[title='open URL in the iframe below [Enter]']").get(0);
		openInFrame.click();
		Thread.sleep(100);
		getDriver().switchTo().defaultContent();
		Thread.sleep(100);
	}
}