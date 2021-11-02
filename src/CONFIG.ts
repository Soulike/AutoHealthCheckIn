import {Account} from './Class/Account';
import path from 'path';
import os from 'os';

export const ACCOUNTS: Account[] = [

]

export const DRIVER_PATH = path.join(os.homedir(), '.bin', 'chromedriver');
export const CHROME_PATH = '/usr/bin/google-chrome';