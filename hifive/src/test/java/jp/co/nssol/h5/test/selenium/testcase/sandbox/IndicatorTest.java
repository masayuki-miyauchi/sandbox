package jp.co.nssol.h5.test.selenium.testcase.sandbox;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import java.util.List;

import jp.co.nssol.h5.test.selenium.base.H5TestCase;

import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class IndicatorTest extends H5TestCase {

	public IndicatorTest(WebDriver driver) {
		super(driver);
	}

	@Before
	public void reloadPage() {
		show("sandbox/indicator/");
	}

	@Test
	public void showBlockPage() throws InterruptedException {
		assertThat("『画面ブロック』のタイトルが表示されているか。", getDriver().getTitle(),
				is("hifive Block Sample"));
	}

	@Test
	public void child1StartClick() throws InterruptedException {
		click(getElementById("child1Block"));
		assertThat("画面ブロックが表示されていること。(オーバーレイ)",
				querySelector("#child1 .blockUI.blockOverlay").size(), is(1));
		assertThat("画面ブロックが表示されていること。(インジケータ)",
				querySelector("#child1 .blockUI.a.blockElement").size(), is(1));

		List<WebElement> elems = querySelector("#ul li");
		assertThat("ログが画面に表示されていること。", elems.size(), is(1));
		assertThat("ログに 'child1 start' が表示されていること。", elems.get(0).getText(),
				is("child1 start"));

		Thread.sleep(1200);

		assertThat("画面ブロックが削除されていること。(オーバーレイ)",
				querySelector("#child1 .blockUI.blockOverlay").size(), is(0));
		assertThat("画面ブロックが削除されていること。(インジケータ)",
				querySelector("#child1 .blockUI.a.blockElement").size(),
				is(0));

		elems = querySelector("#ul li");
		assertThat("ログに 'child1 end' が表示されていること。", elems.get(1).getText(),
				is("child1 end"));
	}

	@Test
	public void parentBlock() throws InterruptedException {
		click(getElementById("parentBlock"));
		assertThat("画面ブロックが表示されていること。(オーバーレイ)",
				querySelector("#parent1 .blockUI.blockOverlay").size(), is(1));
		assertThat("画面ブロックが表示されていること。(インジケータ)",
				querySelector("#parent1 .blockUI.a.blockElement").size(),
				is(1));

		List<WebElement> elems = querySelector("#ul li");
		assertThat("ログが画面に表示されていること。", elems.size(), is(1));
		assertThat("ログに 'child2 start' が表示されていること。", elems.get(0).getText(),
				is("child2 start"));

		Thread.sleep(3000);

		assertThat("画面ブロックが削除されていること。(オーバーレイ)",
				querySelector("#parent1 .blockUI.blockOverlay").size(), is(0));
		assertThat("画面ブロックが削除されていること。(インジケータ)",
				querySelector("#parent1 .blockUI.a.blockElement").size(),
				is(0));

		elems = querySelector("#ul li");
		assertThat("ログに 'child2 end' が表示されていること。", elems.get(1).getText(),
				is("child2 end"));
	}

	@Test
	public void childrenBlock() throws InterruptedException {
		click(getElementById("childrenBlock"));
		assertThat("画面ブロックが表示されていること。(オーバーレイ)",
				querySelector("#child3 .blockUI.blockOverlay").size(), is(1));
		assertThat("画面ブロックが表示されていること。(インジケータ)",
				querySelector("#child3 .blockUI.a.blockElement").size(),
				is(1));
		assertThat("画面ブロックが表示されていること。(オーバーレイ)",
				querySelector("#child4 .blockUI.blockOverlay").size(), is(1));
		assertThat("画面ブロックが表示されていること。(インジケータ)",
				querySelector("#child4 .blockUI.a.blockElement").size(),
				is(1));

		List<WebElement> elems = querySelector("#ul li");
		assertThat("ログが2件画面に出力されていること。", elems.size(), is(2));

		Thread.sleep(3000);

		assertThat("画面ブロックが削除されていること。(オーバーレイ)",
				querySelector("#child3 .blockUI.blockOverlay").size(), is(0));
		assertThat("画面ブロックが削除されていること。(インジケータ)",
				querySelector("#child3 .blockUI.a.blockElement").size(), is(0));
		assertThat("画面ブロックが削除されていること。(オーバーレイ)",
				querySelector("#child4 .blockUI.blockOverlay").size(), is(0));
		assertThat("画面ブロックが削除されていること。(インジケータ)",
				querySelector("#child4 .blockUI.a.blockElement").size(),
				is(0));

		elems = querySelector("#ul li");
		assertThat("ログが2件画面に出力されていること。", elems.size(), is(4));
	}
}
