package jp.co.nssol.h5.test.selenium.testcase.coverage.marge;

import jp.co.nssol.h5.test.selenium.base.H5TestCase;

import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

/**
 * TODO テストケースの追加
 * 
 * @author fukuda
 * 
 */
public class RunnerJQuery1_6 extends H5TestCase {

	public static final String QUNIT_PAGE =
			"http://localhost:8080/htmlhifiveWeb/coverage/inst/test/runner.jquery1.6.html";

	public RunnerJQuery1_6(WebDriver driver) throws InterruptedException {
		super(driver);
	}
	@Test
	public void openQUnit() throws InterruptedException{

		WebElement locationBox = querySelector("#location").get(0);
		locationBox.clear();
		locationBox.sendKeys(QUNIT_PAGE);
		WebElement openInWindow = querySelector("[title='open URL in the iframe below [Enter]']").get(0);
		openInWindow.click();
		Thread.sleep(1000);
	}
}
