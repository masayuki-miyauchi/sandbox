package jp.co.nssol.h5.test.selenium.suite;

import jp.co.nssol.h5.test.selenium.base.H5Suite;
import jp.co.nssol.h5.test.selenium.base.TargetDriver;
import jp.co.nssol.h5.test.selenium.testcase.tutorial.Step13_1Test;
import jp.co.nssol.h5.test.selenium.testcase.tutorial.Step13_2Test;
import jp.co.nssol.h5.test.selenium.testcase.tutorial.Step3Test;
import jp.co.nssol.h5.test.selenium.testcase.tutorial.Step5Test;
import jp.co.nssol.h5.test.selenium.testcase.tutorial.Step6Test;
import jp.co.nssol.h5.test.selenium.testcase.tutorial.Step7_1Test;
import jp.co.nssol.h5.test.selenium.testcase.tutorial.Step7_2Test;

import org.junit.runner.RunWith;
import org.junit.runners.Suite.SuiteClasses;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;

@TargetDriver({ ChromeDriver.class, FirefoxDriver.class, InternetExplorerDriver.class })
@RunWith(H5Suite.class)
@SuiteClasses({ Step3Test.class, Step5Test.class, Step6Test.class,
	Step7_1Test.class, Step7_2Test.class, Step13_1Test.class,
	Step13_2Test.class })
public class TutorialTest {

}
