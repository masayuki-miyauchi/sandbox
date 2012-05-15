package jp.co.nssol.h5.test.selenium.testcase.tutorial;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import jp.co.nssol.h5.test.selenium.base.H5TestCase;

import org.junit.Test;
import org.openqa.selenium.Alert;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

public class Step3Test extends H5TestCase {
	public Step3Test(WebDriver driver) {
		super(driver);
		show("tutorial/step3/step3.html");
	}

	@Test
	public void test1() throws InterruptedException {
		assertThat("STEP3のタイトルが表示されているか。", getDriver().getTitle(),
				is("hifive Hello World"));
	}

	@Test
	public void test2() throws InterruptedException {
		WebDriverWait wait = new WebDriverWait(getDriver(), 10000);

		ExpectedCondition<Alert> condition = new ExpectedCondition<Alert>() {
			@Override
			public Alert apply(WebDriver driver) {
				return getDriver().switchTo().alert();
			}
		};
		click(getElementById("btn"));
		Alert alert = wait.until(condition);

		assertThat("アラートに「Hello, World!」が表示されたか。", alert.getText(),
				is("Hello, World!"));
		alert.accept();
	}
}