import {AutoHealthCheckInExecutor} from './Class/AutoHealthCheckInExecutor';
import chrome from 'selenium-webdriver/chrome';
import {ACCOUNTS, CHECK_IN_HOUR, CHROME_PATH, DRIVER_PATH} from './CONFIG';
import {Builder} from 'selenium-webdriver';
import {setInterval} from 'timers/promises';
import signale from 'signale';

(async () =>
{
    signale.info('自动打卡脚本已启动');

    chrome.setDefaultService(new chrome.ServiceBuilder(DRIVER_PATH).build());
    const driver = await new Builder().forBrowser('chrome')
        .setChromeOptions(new chrome.Options().setChromeBinaryPath(CHROME_PATH))
        .setChromeOptions(new chrome.Options().headless())
        .build();

    // 退出之前清理
    process.on('beforeExit', async () =>
    {
        await driver.quit();
    });

    const executor = new AutoHealthCheckInExecutor(driver);

    signale.success('webdriver 构建成功');

    // 启动时立即进行一次打卡
    await Promise.all(ACCOUNTS.map(account => executor.doCheckIn(account)));

    // 今天是不是已经打卡了？
    let checkedInToday = false;

    // 挑选一个质数分钟作为间隔，随机化打卡分钟
    const INTERVAL = 19 * 60 * 1000;

    for await (const _ of setInterval(INTERVAL))
    {
        if (!checkedInToday)
        {
            const nowDate = new Date();
            if (nowDate.getHours() === CHECK_IN_HOUR)
            {
                signale.info('到达设定打卡时间，开始打卡');
                await Promise.all(ACCOUNTS.map(account => executor.doCheckIn(account)));
                checkedInToday = true;

                // 一个小时后，重置是否已打卡
                setTimeout(() =>
                {
                    checkedInToday = false;
                }, 60 * 60 * 1000);
            }
        }
    }
})();