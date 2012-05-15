package jp.co.nssol.h5.test.selenium.suite;

import jp.co.nssol.h5.test.selenium.base.H5Suite;
import jp.co.nssol.h5.test.selenium.base.TargetDriver;
import jp.co.nssol.h5.test.selenium.testcase.sandbox.IndicatorTest;
import jp.co.nssol.h5.test.selenium.testcase.sandbox.JqmOnHifiveFwTest;

import org.junit.runner.RunWith;
import org.junit.runners.Suite.SuiteClasses;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.safari.SafariDriver;

@TargetDriver({ ChromeDriver.class, FirefoxDriver.class, SafariDriver.class })
@RunWith(H5Suite.class)
@SuiteClasses({ IndicatorTest.class, JqmOnHifiveFwTest.class })
public class SandBoxTest {

}
