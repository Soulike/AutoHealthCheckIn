import {Account} from './Class/Account';
import path from 'path';
import os from 'os';

/** 要打卡的账号 */
export const ACCOUNTS: Account[] = [
    new Account('hello', 'world'),
];

/** chromedriver 的路径 */
export const DRIVER_PATH = path.join(os.homedir(), '.bin', 'chromedriver');

/** Chrome 浏览器可执行文件的路径 */
export const CHROME_PATH = '/usr/bin/google-chrome';

/** 在每天的几点打卡，24 小时制 */
export const CHECK_IN_HOUR = 5;