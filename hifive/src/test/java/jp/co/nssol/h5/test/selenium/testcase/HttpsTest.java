package jp.co.nssol.h5.test.selenium.testcase;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import java.util.List;

import jp.co.nssol.h5.test.selenium.base.H5TestCase;

import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class HttpsTest extends H5TestCase {

	public HttpsTest(WebDriver driver) {
		super(driver);
	}

	@Test
	public void accessVeriSingTestPage() {
		getDriver().get("https://ssltest2.verisign.co.jp/");
		List<WebElement> e = querySelector("body > p > b");
		assertThat("HTTPSのページが見えるか", e.size(), is(1));
		assertThat(e.get(0).getText(), is("Class 3 Public Primary Certification Authority"));
	}

}
