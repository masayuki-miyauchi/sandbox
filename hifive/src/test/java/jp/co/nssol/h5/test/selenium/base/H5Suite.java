package jp.co.nssol.h5.test.selenium.base;

import java.lang.reflect.Field;

import org.junit.runners.Suite;
import org.junit.runners.model.InitializationError;
import org.junit.runners.model.RunnerBuilder;

public class H5Suite extends Suite {
	private static final Class<H5TestCase> TARGET_TEST_CLASS = H5TestCase.class;
	private static final Class<TargetDriver> TEST_DRIVER_ANNOTATION_CLASS = TargetDriver.class;
	private static final String H5_TEST_CASE_DRIVERS_FIELD_NAME = "drivers";

	public H5Suite(Class<?> klass, RunnerBuilder builder)
			throws InitializationError {
		super(checkAnnotationAndCreateDrivers(klass), builder);
	}

	private static Class<?> checkAnnotationAndCreateDrivers(Class<?> klass) throws InitializationError {
		SuiteClasses annotation = (SuiteClasses) klass.getAnnotation(SuiteClasses.class);

		for (Class<?> c : annotation.value()) {
			if (!TARGET_TEST_CLASS.isAssignableFrom(c)) {
				throw new InitializationError(String.format("@SuiteClassesには、'%s'クラスを継承したテストクラスを指定して下さい。", new Object[] { TARGET_TEST_CLASS.getSimpleName() }));
			}
		}

		TargetDriver testTargetDrivers = klass.getAnnotation(TEST_DRIVER_ANNOTATION_CLASS);

		if (testTargetDrivers == null || testTargetDrivers.value() == null) {
			throw new InitializationError(String.format("テストスイートに、@%sアノテーションが記述されていません。", new Object[] { TEST_DRIVER_ANNOTATION_CLASS.getSimpleName() }));
		}

		if (testTargetDrivers.value().length == 0) {
			throw new InitializationError(String.format("@%sアノテーションに、テスト対象のドライバを１つ以上指定して下さい。", new Object[] { TEST_DRIVER_ANNOTATION_CLASS.getSimpleName() }));
		}

		try {
			Field f = H5TestCase.class.getDeclaredField(H5_TEST_CASE_DRIVERS_FIELD_NAME);
			f.setAccessible(true);
			f.set(null, DriverFactory.createDriver(testTargetDrivers.value()));
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (NoSuchFieldException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		}

		return klass;
	}

}
