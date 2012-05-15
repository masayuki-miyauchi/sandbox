package jp.co.nssol.h5.test.selenium.testcase.tutorial;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import jp.co.nssol.h5.test.selenium.base.H5TestCase;

import org.junit.Test;
import org.openqa.selenium.WebDriver;

public class Step13_1Test extends H5TestCase {
	public Step13_1Test(WebDriver driver) {
		super(driver);
		show("tutorial/step13-1/step13-1.html");
	}

	@Test
	public void showStep13_1Page() throws InterruptedException {
		assertThat("STEP7-1のタイトルが表示されているか。", getDriver().getTitle(),
				is("hifive Aspectの適用"));
	}
}
