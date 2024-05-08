export enum SchemaName {
  performance = 'performance',
  alarm = 'alarm_rule',
  alarmRecord = 'alarm_record',
  customException = 'custom_exception',
  consoleException = 'console_exception',
  resourceException = 'resource_exception',
  jsException = 'js_exception',
  requestException = 'request_exception',
  user = 'user',
  application = 'application',
}

export const defaultPager = {
  page: 1,
  pageSize: 15,
};

export enum Eid {
  performance = 'performance',
  resourceException = 'resource_exception',
  jsException = 'js_exception',
  requestException = 'request_exception',
}
