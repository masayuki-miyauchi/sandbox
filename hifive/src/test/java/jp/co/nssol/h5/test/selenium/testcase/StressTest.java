package jp.co.nssol.h5.test.selenium.testcase;

import jp.co.nssol.h5.test.selenium.base.H5TestCase;

import org.junit.Test;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebDriver;

public class StressTest extends H5TestCase {
	public StressTest(WebDriver driver) {
		super(driver);
		show("tutorial/step3/step3.html");
	}

	@Test
	public void transitionTest() throws InterruptedException {
		for (int i = 0; i < 100; i++) {
			getDriver().navigate().back();
			getDriver().navigate().forward();
		}
	}

	@Test
	public void transitionTest2() throws InterruptedException {
		for (int i = 0; i < 100; i++) {
			getDriver().navigate().back();
			click(getElementsByLinkText("step3").get(0));
			Thread.sleep(50);
		}
	}

	@Test
	public void scrollTest() throws InterruptedException {
		getDriver().manage().window().setPosition(new Point(0, 1000));
		// TODO 画面スクロールをテストする
	}
}
