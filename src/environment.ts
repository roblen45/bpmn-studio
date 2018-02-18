
// tslint:disable-next-line no-default-export
export default {
  debug: true,
  testing: true,
  baseRoute:  'http://localhost:8000',
  processlist: {
    pageLimit: 10,
  },
  processengine: {
    poolingInterval: 5000,
    routes: {
      processes: `${this.baseRoute}/datastore/ProcessDef`,
      startProcess: `${this.baseRoute}/processengine/start`,
      processInstances: `${this.baseRoute}/datastore/Process`,
      messageBus: `${this.baseRoute}/mb`,
      iam: `${this.baseRoute}/iam`,
      userTasks: `${this.baseRoute}/datastore/UserTask`,
    },
  },
  events: {
    xmlChanged: 'xmlChanged',
  },
  consumerClient: {
    baseRoute: this.baseRoute,
  },
};
