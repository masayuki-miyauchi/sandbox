package jp.co.nssol.h5.test.selenium.testcase.sandbox;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import java.util.List;

import jp.co.nssol.h5.test.selenium.base.H5TestCase;

import org.junit.Test;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class JqmOnHifiveFwTest extends H5TestCase {
	public JqmOnHifiveFwTest(WebDriver driver) {
		super(driver);
		show("sandbox/jqm/");
	}

	@Test
	public void showPage() throws InterruptedException {
		assertThat("タイトルが表示されているか。", getDriver().getTitle(), is("JQM on hifiveFW"));
	}

	@Test
	public void submitGlobalClick() throws InterruptedException {
		click(getElementById("submit1"));
		assertThat("画面ブロックが表示されていること。(オーバーレイ)",
				querySelector("body .blockUI.blockOverlay").size(), is(1));
		assertThat("画面ブロックが表示されていること。(インジケータ)",
				querySelector("body .blockUI.a.blockPage").size(), is(1));

		Thread.sleep(6000);

		assertThat("画面ブロックが削除されていること。(オーバーレイ)",
				querySelector("body .blockUI.blockOverlay").size(), is(0));
		assertThat("画面ブロックが削除されていること。(インジケータ)",
				querySelector("body .blockUI.a.blockPage").size(), is(0));
	}

	@Test
	public void pageTransitionTestBtnClick() throws InterruptedException {
		List<WebElement> e = getElementsByXPath("//input[@value='Page Transition Test']");
		assertThat("Page Transition Testボタンが取得できたか。", e.size(), is(1));

		// click(e.get(0));

		JavascriptExecutor js = (JavascriptExecutor) getDriver();
		js.executeScript("$(\"input[value='Page Transition Test']\").click()");

		// Wait<WebDriver> wait = new WebDriverWait(10);
		// ExpectedCondition<WebElement> condition = new
		// ExpectedCondition<WebElement>() {
		// public WebElement apply(WebDriver driver) {
		// return driver.findElement(By.id("transitionTestHeader"));
		// }
		// };
		//
		// WebElement elem = wait.until(condition);

		Thread.sleep(1000);

		assertThat("ヘッダーに遷移先のタイトルが表示されているか。",
				getElementById("transitionTestHeader").getText(),
				is("Page Transitions"));

		getDriver().navigate().back();

		Thread.sleep(1000);

		assertThat("遷移元タイトルが表示されているか。", getDriver().getTitle(),
				is("JQM on hifiveFW"));
	}
}
