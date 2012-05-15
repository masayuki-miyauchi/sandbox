package jp.co.nssol.h5.test.selenium.testcase.tutorial;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import jp.co.nssol.h5.test.selenium.base.H5TestCase;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class Step5Test extends H5TestCase {
	public Step5Test(WebDriver driver) {
		super(driver);
		show("tutorial/step5/step5.html");
	}

	@Test
	public void test1() throws InterruptedException {
		assertThat("STEP5のタイトルが表示されているか。", getDriver().getTitle(),
				is("hifive ビュー操作"));
	}

	@Test
	public void test2() {
		WebElement input = getElementById("to");
		input.sendKeys("10");
		WebElement btn = getElementById("output");
		click(btn);

		WebElement ul = getElementById("list");
		WebElement liFirst = ul.findElement(By.cssSelector("li:nth-child(1)"));
		assertThat("実行結果の１行目の値。", liFirst.getText(), is("1"));

		WebElement liLast = ul.findElement(By.cssSelector("li:last-child"));
		assertThat("実行結果の最終行の値。", liLast.getText(), is("10"));
	}
}
