package jp.co.nssol.h5.test.selenium.testcase.coverage;

import jp.co.nssol.h5.test.selenium.base.H5TestCase;

import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class ShowCoveragePage extends H5TestCase {
	public ShowCoveragePage(WebDriver driver) {
		super(driver);
	}

	@Test
	public void showCoveragePage() throws InterruptedException {
		show("coverage/inst/jscoverage.html");
	}
}
