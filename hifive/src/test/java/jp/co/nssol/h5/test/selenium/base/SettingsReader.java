package jp.co.nssol.h5.test.selenium.base;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.InvalidPropertiesFormatException;
import java.util.Properties;

public class SettingsReader {
	/**
	 * webdriver_config.xmlから指定されたキーのプロパティを取得します。
	 * 
	 * @param key
	 * @return プロパティ
	 */
	protected static String getProperty(String key) {
		Properties p = new Properties();
		try {
			p.loadFromXML(new FileInputStream("config/webdriver_config.xml"));
		} catch (InvalidPropertiesFormatException e) {
			e.printStackTrace();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		return p.getProperty(key);
	}
}
