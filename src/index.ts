import {AutoHealthCheckInExecutor} from './Class/AutoHealthCheckInExecutor';
import chrome from 'selenium-webdriver/chrome';
import {ACCOUNTS, CHROME_PATH, DRIVER_PATH} from './CONFIG';
import {Builder} from 'selenium-webdriver';

(async () =>
{
    chrome.setDefaultService(new chrome.ServiceBuilder(DRIVER_PATH).build());
    const driver = await new Builder().forBrowser('chrome')
        .setChromeOptions(new chrome.Options().setChromeBinaryPath(CHROME_PATH))
        .setChromeOptions(new chrome.Options().headless())
        .build();
    const executor = new AutoHealthCheckInExecutor(driver);

    // 这里不能使用 Promise.all，因为并行登录可能会导致 cookie 竞争
    for (const account of ACCOUNTS)
    {
        await executor.doCheckIn(account);
    }
})();