package jp.co.nssol.h5.test.selenium.suite;

import jp.co.nssol.h5.test.selenium.base.H5Suite;
import jp.co.nssol.h5.test.selenium.base.TargetDriver;
import jp.co.nssol.h5.test.selenium.testcase.coverage.ShowCoveragePage;
import jp.co.nssol.h5.test.selenium.testcase.coverage.marge.CoverageMarge;
import jp.co.nssol.h5.test.selenium.testcase.coverage.marge.CoverageMargeOut;
import jp.co.nssol.h5.test.selenium.testcase.coverage.marge.Runner;
import jp.co.nssol.h5.test.selenium.testcase.coverage.marge.RunnerJQuery1_6;
import jp.co.nssol.h5.test.selenium.testcase.coverage.marge.WaitForQUnitTest;

import org.junit.runner.RunWith;
import org.junit.runners.Suite.SuiteClasses;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;

@TargetDriver({ FirefoxDriver.class, ChromeDriver.class, InternetExplorerDriver.class })
@RunWith(H5Suite.class)
@SuiteClasses({
/* カバレッジページを開くためのクラス */
	ShowCoveragePage.class,

/* 実行したいテストクラスをここに記述 */
	Runner.class, WaitForQUnitTest.class,
 RunnerJQuery1_6.class, WaitForQUnitTest.class,

/* 以下はマージ結果を表示するためのクラス */
	CoverageMarge.class, CoverageMargeOut.class })
public class CoverageMargeTest {
}
