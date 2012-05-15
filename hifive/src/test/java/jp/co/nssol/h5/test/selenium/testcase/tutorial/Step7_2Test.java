package jp.co.nssol.h5.test.selenium.testcase.tutorial;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import java.util.List;

import jp.co.nssol.h5.test.selenium.base.H5TestCase;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class Step7_2Test extends H5TestCase {
	public Step7_2Test(WebDriver driver) {
		super(driver);
		show("tutorial/step7-2/step7-2.html");
	}

	@Test
	public void checkSelectMenu() {
		WebElement e = getElementById("select-category");
		List<WebElement> li = querySelector("option", e);
		assertThat("商品検索 セレクトメニュー", li.get(0).getAttribute("value"), is("1"));
		assertThat("商品検索 セレクトメニュー", li.get(0).getText(), is("おもちゃ(男の子)"));
		assertThat("商品検索 セレクトメニュー", li.get(1).getAttribute("value"), is("2"));
		assertThat("商品検索 セレクトメニュー", li.get(1).getText(), is("おもちゃ(女の子)"));
	}

	@Test
	public void clickSearchBtn() throws InterruptedException {
		//		Wait wait = new Wait() {
		//			@Override
		//			public boolean until() {
		//				return getDriver().findElements(
		//						By.cssSelector("#resultList > div")).size() > 0;
		//			}
		//		};
		//		click(getElementById("searchBtn"));
		//		wait.wait("hoge", 10000);
		//
		//		WebDriverWait wait2 = new WebDriverWait(getDriver(), 10);
		//
		//		ExpectedCondition<WebElement> condition = new ExpectedCondition<WebElement>() {
		//			@Override
		//			public WebElement apply(WebDriver driver) {
		//				return driver.findElement(By.cssSelector("#resultList > div"));
		//			}
		//		};
		//		click(getElementById("searchBtn"));
		//		wait2.until(condition);
		//
		//		FluentWait<WebDriver> wait3 = new FluentWait<WebDriver>(getDriver())
		//				.ignoring(NoSuchElementException.class)
		//				.withTimeout(10, TimeUnit.SECONDS)
		//				.pollingEvery(1, TimeUnit.SECONDS);
		//		click(getElementById("searchBtn"));
		//		wait3.until(ExpectedConditions.presenceOfElementLocated(By
		//				.cssSelector("#resultList > div")));

		WebDriverWait wait4 = new WebDriverWait(getDriver(), 10);
		click(getElementById("searchBtn"));
		wait4.until(ExpectedConditions.presenceOfElementLocated(By
				.cssSelector("#resultList > div")));

		List<WebElement> elems = querySelector("#resultList > div");
		assertThat("検索結果一覧の件数", elems.size(), is(20));

	}
}
