// Javascript Document
(() => {
    return {
      data(){
        return {
          log: '',
          followLog: true,
          client: {},
          response: {},
          request: {},
          requestLogs: [],
          responseLogs: [],
          clientLogs: [],
          windows: []
        };
      },
      computed: {
        clientJSON() {
          return JSON.stringify(this.client);
        },
        requestJSON() {
          return JSON.stringify(this.request);
        },
        responseJSON() {
          return JSON.stringify(this.response);
        }
      },
      methods: {
        selectClient(o) {
          if (JSON.stringify(o) !== this.clientJSON) {
            this.client = o;
          }
        },
        selectRequest(o) {
          if (JSON.stringify(o) !== this.requestJSON) {
            this.request = o;
          }
        },
        selectResponse(o) {
          if (JSON.stringify(o) !== this.responseJSON) {
            this.response = o;
          }
        },
        checkInfo(){
          appui.poll();
        },
        pollerSW(){
          appui.poll({poll: true});
        },
        addToLog(data) {
          if (!data) {
            return;
          }

          if (bbn.fn.isString(data)) {
            this.log += (data + "\n");
            return;
          }
          if (data.logs) {
            let code = this.getRef('code');
            let log = '';
            bbn.fn.each(data.logs, a => {
              if (a && (typeof a === 'object')) {
                log += JSON.stringify(a, null, 2);
              }
              else {
                log += a;
              }
              log += "\n";
            });
            this.log = this.log + log;
            setTimeout(() => {
              if (this.followLog) {
                code.scrollBottom()
              }
            }, 250)
          }
          if (data.client
              && (JSON.stringify(data.client) !== this.clientJSON)
          ) {
            this.clientLogs.unshift(
              bbn.fn.extend({
                time: bbn.fn.dateSQL().substr(11),
                tst: bbn.fn.timestamp()
              }, data.client)
            );
            if (this.clientLogs > 50) {
              this.clientLogs.splice(50, 10);
            }
            this.client = data.client;
          }
          if (data.request
              && (JSON.stringify(data.request) !== this.requestJSON)
          ) {
            this.requestLogs.unshift(
              bbn.fn.extend({
                time: bbn.fn.dateSQL().substr(11),
                tst: bbn.fn.timestamp()
              }, data.request)
            );
            if (this.requestLogs > 50) {
              this.requestLogs.splice(50, 10);
            }
            this.request = data.request;
          }
          if (data.response
              && (JSON.stringify(data.response) !== this.responseJSON)
          ) {
            this.responseLogs.unshift(
              bbn.fn.extend({
                time: bbn.fn.dateSQL().substr(11),
                tst: bbn.fn.timestamp()
              }, data.response)
            );
            if (this.responseLogs > 50) {
              this.responseLogs.splice(50, 10);
            }
            this.response = data.response;
          }
          if (data.windows
             && (JSON.stringify(data.windows) !== this.windowsJSON)
          ) {
            let oks = [];
            bbn.fn.each(data.windows, a => {
              oks.push(a.id);
              if (!bbn.fn.getRow(this.windows, {id: a.id})) {
                this.windows.push(a);
              }
            });
            for (let i = 0; i < this.windows.length; i++) {
              if (!oks.includes(this.windows[i].id)) {
                this.windows.splice(i, 1);
                i--;
              }
            }
          }
        },
        clear(){
          this.followLog = true;
          this.log = '';
        }
      },
      created() {
        appui.$on('sw-log', this.addToLog);
        //appui.$on('received', bbn.fn.log);
      },
      beforeDestroy(){
        appui.$off('sw-log', this.addToLog);
        //appui.$off('received', bbn.fn.log);
      }
    };
  })()
