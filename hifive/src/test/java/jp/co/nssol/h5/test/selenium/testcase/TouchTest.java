package jp.co.nssol.h5.test.selenium.testcase;

import java.net.MalformedURLException;

import jp.co.nssol.h5.test.selenium.base.H5TestCase;

import org.junit.Test;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.interactions.touch.TouchActions;

public class TouchTest extends H5TestCase {
	public TouchTest(WebDriver driver) {
		super(driver);
		show("sandboxInternal/sketch/sketch.html");
	}

	// @Test
	public void flickTest() throws InterruptedException {
		TouchActions touch = new TouchActions(getDriver());

		for (int i = 0; i < 3; i++) {
			touch.flick(getElementsByLinkText("hifiveコミュニティ").get(0), 0, -50, 50);
			touch.build().perform();
			Thread.sleep(200);
		}
	}

	// @Test
	public void touchActionsDoubleTap() throws InterruptedException,
			MalformedURLException {
		TouchActions touch = new TouchActions(getDriver());
		touch.singleTap(getElementsByClassName("backgroundPiece").get(0));
		touch.singleTap(getElementById("load"));
		touch.singleTap(getElementById("drawModeSwitch"));
		touch.build().perform();

		TouchActions touch2 = new TouchActions(getDriver());

		Thread.sleep(1000);

		// O
		touch2.down(300, 450);
		touch2.move(280, 470);
		touch2.move(280, 550);
		touch2.move(300, 570);
		touch2.move(340, 570);
		touch2.move(360, 550);
		touch2.move(360, 470);
		touch2.move(340, 450);
		touch2.move(300, 450);
		touch2.up(300, 450);

		// K
		touch2.down(450, 450);
		touch2.move(450, 570);
		touch2.up(450, 570);
		touch2.down(450, 510);
		touch2.move(520, 450);
		touch2.up(520, 450);
		touch2.down(450, 510);
		touch2.move(520, 570);
		touch2.up(520, 570);
		touch2.build().perform();

		takeScreenShot();
	}

	@Test
	public void execJavaScript() throws InterruptedException {
		JavascriptExecutor exec = (JavascriptExecutor) getDriver();
		exec.executeScript("document.body.style.background = \"red\"");
		Thread.sleep(3000);

		// AndroidDriverではエラー
		Object obj = exec
				.executeAsyncScript("var callback = arguments[arguments.length-1]; window.setTimeout(callback('hello!'), 500)");
		System.out.println(obj);
	}
	// @Test
	// public void yahooTest() throws InterruptedException {
	// getDriver().get("http://www.yahoo.co.jp/");
	// WebDriverWait wait = new WebDriverWait(getDriver(), 10);
	//
	// WebElement searchTxt = wait.until(presenceOfElementLocated(By
	// .id("sch-ipt")));
	// searchTxt.sendKeys("ネコ");
	// searchTxt.sendKeys("ネコ");
	// TouchActions touch = new TouchActions(getDriver());
	// touch.sendKeys(searchTxt, "ネコ");
	// touch.singleTap(getDriver().findElement(
	// By.cssSelector("#sch-submit-btn > input")));
	// touch.build();
	// touch.perform();
	//
	// wait.until(textToBePresentInElement(
	// By.cssSelector(".WSu > header > h2"), "ウェブ"));
	//
	// touch.flick(0, 200);
	// touch.build();
	// touch.perform();
	// }
}
