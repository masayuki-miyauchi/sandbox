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

public class Step7_1Test extends H5TestCase {
	public Step7_1Test(WebDriver driver) {
		super(driver);
		show("tutorial/step7-1/step7-1.html");
	}

	@Test
	public void showStep7_1Page() throws InterruptedException {
		assertThat("STEP7-1のタイトルが表示されているか。", getDriver().getTitle(),
				is("Tutorial Step 7-1"));
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
	public void clickSearchBtn() {
		WebDriverWait wait = new WebDriverWait(getDriver(), 10);
		click(getElementById("searchBtn"));
		wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("#resultList > div")));

		List<WebElement> elems = querySelector("#resultList > div");
		assertThat("検索結果一覧の件数", elems.size(), is(20));
	}
}
