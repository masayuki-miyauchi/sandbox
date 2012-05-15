package jp.co.nssol.h5.test.selenium.testcase.tutorial;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import jp.co.nssol.h5.test.selenium.base.H5TestCase;

import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class Step13_2Test extends H5TestCase {
	public Step13_2Test(WebDriver driver) {
		super(driver);
		show("tutorial/step13-2/step13-2.html");
	}

	@Test
	public void showStep7_1Page() throws InterruptedException {
		assertThat("STEP13-2のタイトルが表示されているか。", getDriver().getTitle(),
				is("hifive Aspectの適用"));
	}

	@Test
	public void clickBtn() {
		WebElement e = getElementById("btn");
		click(e);
		// TODO console.logを確認
	}
}
