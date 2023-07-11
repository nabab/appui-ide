// Javascript Document

(() => {
  return {
    data() {
      return {
        dns_options: ['DNS_A', 'DNS_CNAME', 'DNS_HINFO', 'DNS_CAA', 'DNS_MX',
                      'DNS_NS', 'DNS_PTR', 'DNS_SOA', 'DNS_TXT', 'DNS_AAAA', 'DNS_SRV', 'DNS_NAPTR', 'DNS_A6', 'DNS_ALL', 'DNS_ANY'],
        hostname: {
          'dns_get_record': '',
          'checkdnsrr': '',
          'gethostbyname': '',
          'gethostbynamel': '',
        },
        ipAdr: {
          'gethostbyaddr': '',
          'ip2long': '',
          'long2ip': '',
        },
        checkport: {
          'hostname': this.source.hostname,
          'port': -1
        },
        type: 'MX',
        protocol: 'udp',
        port: 53,
        protocols: ['tcp', 'udp'],
        types: ['A', 'MX', 'NS', 'SOA', 'PTR', 'CNAME', 'AAAA', 'A6', 'SRV', 'NAPTR', 'TXT', 'ANY'],
        showPopup: false,
        showResult: {
          'dns_get_record': false,
          'checkdnsrr': false,
          'gethostbyname': false,
          'gethostbynamel': false,
          'gethostname': false,
          'gethostbyaddr': false,
          'ip2long': false,
          'long2ip': false,
          'getservbyport': false,
          'netgetinterfaces': false,
          'getprotobyname': false,
          'checkportopen': false,
        },
        result: {
          'dns_get_record': [],
          'checkdnsrr': [],
          'gethostbyname': [],
          'gethostbynamel': [],
          'gethostname': [],
          'gethostbyaddr': [],
          'ip2long': [],
          'long2ip': [],
          'getservbyport': [],
          'netgetinterfaces': [],
          'getprotobyname': [],
          'checkportopen': [],
        },
      };
    },
    methods: {
      alertResult(successful, fnc) {
        if (successful) {
          appui.success(bbn._(fnc + " function successfully executed."));
        }
        /*else {
          appui.error(bbn._("Error during " + fnc + " function execution."));
        }*/
      },
      dns_get_record() {
        if (this.hostname.dns_get_record) {
          bbn.fn.post(appui.plugins['appui-ide'] + '/dns', {hostname: this.hostname.dns_get_record, method: 'dns_get_record'}, d => {
            this.alertResult(d.success, 'dns_get_record');
            if (d.success) {
              this.result.dns_get_record = d.result;
              this.showPopup = true;
              this.hostname.dns_get_record = '';
              this.showResult.dns_get_record = true;
            }
            bbn.fn.log(d);
          })
        }
      },
      checkdnsrr() {
        if (this.hostname.checkdnsrr) {
          bbn.fn.post(appui.plugins['appui-ide'] + '/dns', {hostname: this.hostname.checkdnsrr, type: this.type, method: 'checkdnsrr'}, d => {
            this.alertResult(d.success, 'checkdnsrr');
            if (d.success) {
              let res = [this.hostname.checkdnsrr, this.type, d.result];
              if (this.result.checkdnsrr.length == 5) {
                this.result.checkdnsrr.pop();
              }
              this.result.checkdnsrr.unshift(res);
              //this.showPopup = true;
              this.hostname.checkdnsrr = '';
              this.showResult.checkdnsrr = true;
            }
            bbn.fn.log(d);
          })
        }
      },
      gethostbyname() {
        if (this.hostname.gethostbyname) {
          bbn.fn.post(appui.plugins['appui-ide'] + '/dns', {hostname: this.hostname.gethostbyname, method: 'gethostbyname'}, d => {
            this.alertResult(d.success, 'gethostbyname');
            if (d.success) {
              let res = [this.hostname.gethostbyname, d.result];
              if (this.result.gethostbyname.length == 5) {
                this.result.gethostbyname.pop();
              }
              this.result.gethostbyname.unshift(res);
              //this.showPopup = true;
              this.hostname.gethostbyname = '';
              this.showResult.gethostbyname = true;
            }
            bbn.fn.log(d);
          })
        }
      },
      gethostbynamel() {
        if (this.hostname.gethostbynamel) {
          bbn.fn.post(appui.plugins['appui-ide'] + '/dns', {hostname: this.hostname.gethostbynamel, method: 'gethostbynamel'}, d => {
            this.alertResult(d.success, 'gethostbynamel');
            if (d.success) {
              let res = [this.hostname.gethostbynamel, d.result];
              this.result.gethostbynamel = res;
              this.hostname.gethostbynamel = '';
              this.showPopup = true;
              this.showResult.gethostbynamel = true;
            }
            bbn.fn.log(d);
          })
        }
      },
      gethostname() {
        bbn.fn.post(appui.plugins['appui-ide'] + '/dns', {method: 'gethostname'}, d => {
          this.alertResult(d.success, 'gethostname');
          if (d.success) {
            this.result.gethostname = d.result;
            //this.showPopup = true;
            this.showResult.gethostname = true;
          }
          bbn.fn.log(d);
        })
      },
      gethostbyaddr() {
        if (this.ipAdr.gethostbyaddr) {
          bbn.fn.post(appui.plugins['appui-ide'] + '/dns', {ip: this.ipAdr.gethostbyaddr, method: 'gethostbyaddr'}, d => {
            this.alertResult(d.success, 'gethostbyaddr');
            if (d.success) {
              let res = [this.ipAdr.gethostbyaddr, d.result];
              if (this.result.gethostbyaddr.length == 5) {
                this.result.gethostbyaddr.pop();
              }
              this.result.gethostbyaddr.unshift(res);
              //this.showPopup = true;
              this.ipAdr.gethostbyaddr = '';
              this.showResult.gethostbyaddr = true;
            }
            bbn.fn.log(d);
          })
        }
      },
      ip2long() {
        if (this.ipAdr.ip2long) {
          bbn.fn.post(appui.plugins['appui-ide'] + '/dns', {ip: this.ipAdr.ip2long, method: 'ip2long'}, d => {
            this.alertResult(d.success, 'ip2long');
            if (d.success) {
              let res = [this.ipAdr.ip2long, d.result];
              if (this.result.ip2long.length == 5) {
                this.result.ip2long.pop();
              }
              this.result.ip2long.unshift(res);
              //this.showPopup = true;
              this.ipAdr.ip2long = '';
              this.showResult.ip2long = true;
            }
            bbn.fn.log(d);
          })
        }
      },
      long2ip() {
        if (this.ipAdr.long2ip) {
          bbn.fn.post(appui.plugins['appui-ide'] + '/dns', {ip: this.ipAdr.long2ip, method: 'long2ip'}, d => {
            this.alertResult(d.success, 'long2ip');
            if (d.success) {
              let res = [this.ipAdr.long2ip, d.result];
              if (this.result.long2ip.length == 5) {
                this.result.long2ip.pop();
              }
              this.result.long2ip.unshift(res);
              //this.showPopup = true;
              this.ipAdr.long2ip = '';
              this.showResult.long2ip = true;
            }
            bbn.fn.log(d);
          })
        }
      },
      checkportopen() {
        if (this.checkport.hostname && this.checkport.port) {
          bbn.fn.post(appui.plugins['appui-ide'] + '/dns', {hostname: this.checkport.hostname, port: this.checkport.port, method: 'checkportopen'}, d => {
            this.alertResult(d.success, 'checkportopen');
            if (d.success || (!d.sucess && !d.error)) {
              let res = [this.checkport.hostname, this.checkport.port, d.result];
              if (this.result.checkportopen.length == 5) {
                this.result.checkportopen.pop();
              }
              this.result.checkportopen.unshift(res);
              //this.showPopup = true;
              this.checkport = {
                'hostname': this.source.hostname,
                'port': -1
              };
              this.showResult.checkportopen = true;
            }
            bbn.fn.log(d);
          })
        }
      },
      getservbyport() {
        if (this.port) {
          bbn.fn.post(appui.plugins['appui-ide'] + '/dns', {port: this.port, protocol: this.protocol, method: 'getservbyport'}, d => {
            this.alertResult(d.success, 'getservbyport');
            if (d.success) {
              let res = [this.port, this.protocol, d.result];
              if (this.result.getservbyport.length == 5) {
                this.result.getservbyport.pop();
              }
              this.result.getservbyport.unshift(res);
              //this.showPopup = true;
              this.showResult.getservbyport = true;
            }
            bbn.fn.log(d);
          })
        }
      },
      netgetinterfaces() {
        bbn.fn.post(appui.plugins['appui-ide'] + '/dns', {method: 'net_get_interfaces'}, d => {
          this.alertResult(d.success, 'net_get_interfaces');
          if (d.success) {
            this.result.netgetinterfaces = d.result;
            this.showPopup = true;
            this.showResult.netgetinterfaces = true;
          }
          bbn.fn.log(d);
        })
      },
      getprotobyname() {
        if (this.protocol) {
          bbn.fn.post(appui.plugins['appui-ide'] + '/dns', {protocol: this.protocol, method: 'getprotobyname'}, d => {
            this.alertResult(d.success, 'getprotobyname');
            if (d.success) {
              let res = [this.protocol, d.result];
              if (this.result.getprotobyname.length == 5) {
                this.result.getprotobyname.pop();
              }
              this.result.getprotobyname.unshift(res);
              //this.showPopup = true;
              this.showResult.getprotobyname = true;
            }
            bbn.fn.log(d);
          })
        }
      },
      clear(str) {
        if (str == 'dns_get_record') {
          this.hostname.dns_get_record = '';
          this.result.dns_get_record = [];
          this.showResult.dns_get_record = false;
        }
        if (str == 'checkdnsrr') {
          this.hostname.checkdnsrr = '';
          this.result.checkdnsrr = [];
          this.showResult.checkdnsrr = false;
          this.type = 'MX';
        }
        if (str == 'gethostbyname') {
          this.hostname.gethostbyname = '';
          this.result.gethostbyname = [];
          this.showResult.gethostbyname = false;
        }
        if (str == 'gethostbynamel') {
          this.hostname.gethostbynamel = '';
          this.result.gethostbynamel = [];
          this.showResult.gethostbynamel = false;
        }
        if (str == 'gethostname') {
          this.result.gethostname = [];
          this.showResult.gethostname = false;
        }
        if (str == 'gethostbyaddr') {
          this.result.gethostbyaddr = [];
          this.ipAdr.gethostbyaddr ='';
          this.showResult.gethostbyaddr = false;
        }
        if (str == 'ip2long') {
          this.result.ip2long = [];
          this.ipAdr.ip2long ='';
          this.showResult.ip2long = false;
        }
        if (str == 'long2ip') {
          this.result.long2ip = [];
          this.ipAdr.long2ip ='';
          this.showResult.long2ip = false;
        }
        if (str == 'getservbyport') {
          this.result.getservbyport = [];
          this.port = 53;
          this.showResult.getservbyport = false;
          this.protocol = 'udp';
        }
        if (str == 'netgetinterfaces') {
          this.result.netgetinterfaces = [];
          this.showResult.netgetinterfaces = false;
        }
        if (str == 'getprotobyname') {
          this.result.getprotobyname = [];
          this.showResult.getprotobyname = false;
          this.protocol = 'udp';
        }
        if (str == 'checkportopen') {
          this.result.checkportopen = [];
          this.showResult.checkportopen = false;
          this.checkport = {
            'hostname': this.source.hostname,
            'port': -1
          };
        }
      },
      clearPopup() {
        this.showPopup = false;
        this.showResult.dns_get_record = false;
        this.result.dns_get_record = [];
        this.showResult.gethostbynamel = false;
        this.result.gethostbynamel = [];
        this.showResult.netgetinterfaces = false;
        this.result.netgetinterfaces = [];
      },
      renderValue(row) {
        if (row.hasOwnProperty('type')) {
          switch (row.type) {
            case 'NS':
              res = row.target;
              break;
            case 'CAA':
              res = row.value;
              break;
            case 'TXT':
              res = row.txt;
              break;
            case 'MX':
              res = row.target;
              break;
            case 'SOA':
              res = row.mname;
              break;
            default:
              res = 'None';
              break;
          }
        	return res;
        }
        else {
          return 'N/A';
        }
      },
    }
  };
})();