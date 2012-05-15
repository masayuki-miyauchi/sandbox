package jp.co.nssol.h5.test.selenium.testcase.tutorial;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import jp.co.nssol.h5.test.selenium.base.H5TestCase;

import org.junit.Test;
import org.openqa.selenium.WebDriver;

public class Step6Test extends H5TestCase {
	public Step6Test(WebDriver driver) {
		super(driver);
		show("tutorial/step6/step6.html");
	}

	@Test
	public void test1() throws InterruptedException {
		assertThat("STEP6のタイトルが表示されているか。", getDriver().getTitle(),
				is("hifive ロジックの使用"));
	}

	@Test
	public void test2() {
		getElementById("left").sendKeys("2");
		getElementById("right").sendKeys("4");
		click(getElementById("calc"));

		assertThat("実行結果。", getElementById("result").getText(), is("6"));
	}
}
