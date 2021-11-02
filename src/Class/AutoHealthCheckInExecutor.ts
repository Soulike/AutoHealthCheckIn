import {By, Key, WebDriver} from 'selenium-webdriver';
import {Account} from './Account';
import assert from 'assert';
import querystring from 'querystring';
import signale from 'signale';

export class AutoHealthCheckInExecutor
{
    private static readonly usedDrivers = new WeakSet<WebDriver>();

    private readonly driver: WebDriver;

    private isWorking: boolean;
    private readonly workQueue: Account[];

    constructor(driver: WebDriver)
    {
        if (AutoHealthCheckInExecutor.usedDrivers.has(driver))
        {
            throw new Error('不能重复使用 WebDriver');
        }
        this.driver = driver;
        this.workQueue = [];
        this.isWorking = false;
    }

    public async doCheckIn(account: Account)
    {
        this.workQueue.push(account);
        if (!this.isWorking)
        {
            await this.flushWorkQueue();
        }
    }

    /**
     * 逐个处理整个队列中的任务，防止竞争
     * */
    private async flushWorkQueue()
    {
        this.isWorking = true;
        while (this.workQueue.length > 0)
        {
            const account = this.workQueue.pop()!;

            await this.doLogin(account);
            const {msg, wid} = await this.getWid();

            signale.info(`账号 ${account.getUsername()} 登录返回信息：${msg}`);

            const {driver} = this;
            const url = 'https://ehallapp.nju.edu.cn/xgfw/sys/yqfxmrjkdkappnju/apply/saveApplyInfos.do';
            const payload = {
                'WID': wid,
                'CURR_LOCATION': '江苏省南京市栖霞区仙林大道163号',
                'IS_TWZC': '1',
                'IS_HAS_JKQK': '1',
                'JRSKMYS': '1',
                'JZRJRSKMYS': '1',
            };

            const urlWithQueryString = `${url}?${querystring.encode(payload)}`;
            await driver.get(urlWithQueryString);

            const json = await driver.findElement(By.css('pre')).getText();
            const info = JSON.parse(json);
            signale.info(`账号 ${account.getUsername()} 打卡返回信息：${info.msg}`);
        }
        this.isWorking = false;
    }

    private async doLogin(account: Account)
    {
        const {driver} = this;
        await driver.get('https://authserver.nju.edu.cn/authserver/login');
        await driver.findElement(By.id('username')).sendKeys(account.getUsername());
        await driver.findElement(By.id('password')).sendKeys(account.getPassword(), Key.ENTER);
    }

    /**
     * Must call `doLogin()` before calling `getWid()`
     * @private
     */
    private async getWid(): Promise<{ msg: string, wid: string }>
    {
        const {driver} = this;
        await driver.get('https://ehallapp.nju.edu.cn/xgfw/sys/yqfxmrjkdkappnju/apply/getApplyInfoList.do');
        const json = await driver.findElement(By.css('pre')).getText();
        const info = JSON.parse(json);
        const msg = info.msg;
        assert(typeof msg === 'string');
        const wid = info.data[0].WID;
        assert(typeof wid === 'string');

        return {msg, wid};
    }
}