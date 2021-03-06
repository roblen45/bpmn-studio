import * as path from 'path';
import {browser} from 'protractor';
import {ProcessDefListPage} from './pages/processdef-list-page';

describe('processDefList', () => {

  const defaultTimeout: number = 1000;
  const aureliaUrl: string = 'http://localhost:9000';

  browser.driver.manage().deleteAllCookies();
  browser.get(aureliaUrl);

  it('should display process definitions', () => {
    const processDefListPage: ProcessDefListPage = new ProcessDefListPage();
    browser.sleep(defaultTimeout);
    expect(processDefListPage.processDefs.count()).toBeGreaterThan(0);
  });

});
