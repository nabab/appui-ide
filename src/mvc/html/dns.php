<div class="bbn-dns-tools bbn-overlay bbn-padding bbn-vmargin">
  <bbn-dashboard class="bbn-padding bbn-margin"
                 :storage="true"
                 storage-full-name="appui-ide-dns-dashboard">
    <bbn-widget class="domain" label="CURRENT MACHINE">
      <h3><i class="nf nf-md-home_circle"></i>  Hostname: {{source.hostname}}</h3>
      <h3><i class="nf nf-md-access_point_network"></i>  Network Interfaces Infos</h3>
      <ul v-for="interface in source.net_render">
        <li>{{interface[0]}}  <i :class="interface[5] ? 'nf nf-cod-arrow_small_up' : 'nf nf-cod-arrow_small_down'"></i>
          <ul>
            <li>IPV4:
            	<ul>
                <li>Adress: {{interface[1]}}</li>
                <li>Netmask: {{interface[2]}}</li>
              </ul>
            </li>
          </ul>
          <ul>
            <li>IPV6:
            	<ul>
                <li>Adress: {{interface[3]}}</li>
                <li>Netmask: {{interface[4]}}</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </bbn-widget>
    <bbn-widget class="domain" label="DNS RECORDS">
      <p><i class="nf nf-fa-info_circle"></i> Fetch DNS Resource Records associated with a hostname.</p>
      <div class="bbn-flex-width">
        <div class="bbn-flex-fill bbn-margin">
          <bbn-input v-model="hostname.dns_get_record"
                     button-right="nf nf-fa-check"
                     :action-right="dns_get_record"
                     @keydown.enter="dns_get_record"
                     placeholder="<?= _("Hostname") ?>"
                     ></bbn-input>
          <br><br><br>
          <bbn-button title="Edit"
                      icon="nf nf-fa-trash"
                      class="bbn-state-selected"
                      @click.stop="clear('dns_get_record')">Clear results</bbn-button>
        </div>
      </div>
    </bbn-widget>
    <!--<bbn-widget class="domain" label="checkdnsrr">
      <p><i class="nf nf-fa-info_circle"></i> Check DNS records corresponding to a given Internet host name or IP address</p>
      <div class="bbn-flex-width">
        <div class="bbn-flex-fill bbn-margin">
          <bbn-input v-model="hostname.checkdnsrr"
                     button-right="nf nf-fa-check"
                     :action-right="checkdnsrr"
                     placeholder="<?= _("Hostname") ?>"
                     ></bbn-input>
        </div>
        <div class="bbn-flex-fill bbn-margin">
          <bbn-dropdown v-model="type"
                        :value="type"
                        :source=types></bbn-dropdown>
        </div>
      </div>
      <div class="bbn-margin">
        <p v-if="showResult.checkdnsrr" v-for="res in result.checkdnsrr">
          {{res[0]}} - {{res[1]}} : {{res[2]}}
        </p>
        <bbn-button title="Edit"
                    icon="nf nf-fa-trash"
                    class="bbn-state-selected"
                    @click.stop="clear('checkdnsrr')">Clear results</bbn-button>
      </div>
    </bbn-widget>
    <bbn-widget class="domain" label="gethostbyname">
      <p><i class="nf nf-fa-info_circle"></i> Get the IPv4 address corresponding to a given Internet host name</p>
      <div class="bbn-flex-width">
        <div class="bbn-flex-fill bbn-margin">
          <bbn-input v-model="hostname.gethostbyname"
                     button-right="nf nf-fa-check"
                     :action-right="gethostbyname"
                     placeholder="<?= _("Hostname") ?>"
                     ></bbn-input>
        </div>
      </div>
      <div class="bbn-margin">
        <p v-if="showResult.gethostbyname"
           v-for="res in result.gethostbyname">
          {{res[0]}}: {{res[1]}}
        </p>
        <bbn-button title="Edit"
                    icon="nf nf-fa-trash"
                    class="bbn-state-selected"
                    @click.stop="clear('gethostbyname')">Clear results</bbn-button>
      </div>
    </bbn-widget>-->
    <bbn-widget class="domain" label="DOMAIN TO IPS">
      <p><i class="nf nf-fa-info_circle"></i> Get a list of IPv4 addresses corresponding to a given Internet host name</p>
      <div class="bbn-flex-width">
        <div class="bbn-flex-fill bbn-margin">
          <bbn-input v-model="hostname.gethostbynamel"
                     button-right="nf nf-fa-check"
                     :action-right="gethostbynamel"
                     @keydown.enter="gethostbynamel"
                     placeholder="<?= _("Hostname") ?>"
                     ></bbn-input>
          <br><br><br>
          <bbn-button title="Edit"
                      icon="nf nf-fa-trash"
                      class="bbn-state-selected"
                      @click.stop="clear('gethostbynamel')">Clear results</bbn-button>
        </div>
      </div>
    </bbn-widget>
    <!--<bbn-widget class="domain" label="gethostname">
      <p><i class="nf nf-fa-info_circle"></i> Gets the host name</p>
      <div class="bbn-flex-width">
        <div class="bbn-flex-fill bbn-margin">
          <bbn-input button-right="nf nf-fa-check"
                     :action-right="gethostname"
                     disabled="true"
                     placeholder="<?= _("Test gethostname") ?>"
                     ></bbn-input>
        </div>
      </div>
      <div class="bbn-margin">
        <p v-if="showResult.gethostname">
          hostname: {{result.gethostname}}
        </p>
        <bbn-button title="Edit"
                    icon="nf nf-fa-trash"
                    class="bbn-state-selected"
                    @click.stop="clear('gethostname')">Clear results</bbn-button>
      </div>
    </bbn-widget>-->
    <bbn-widget class="ip" label="REVERSE DNS">
      <p><i class="nf nf-fa-info_circle"></i> Get the Internet host name corresponding to a given IP address</p>
      <div class="bbn-flex-width">
        <div class="bbn-flex-fill bbn-margin">
          <bbn-input v-model="ipAdr.gethostbyaddr"
                     button-right="nf nf-fa-check"
                     :action-right="gethostbyaddr"
                     @keydown.enter="gethostbyaddr"
                     placeholder="<?= _("IP address") ?>"
                     ></bbn-input>
        </div>
      </div>
      <div class="bbn-margin">
        <p v-if="showResult.gethostbyaddr"
           v-for="res in result.gethostbyaddr">
          {{res[0]}} --> {{res[1]}}
        </p>
        <bbn-button title="Edit"
                    icon="nf nf-fa-trash"
                    class="bbn-state-selected"
                    @click.stop="clear('gethostbyaddr')">Clear results</bbn-button>
      </div>
    </bbn-widget>
    <bbn-widget class="network" label="CHECK PORT FOR HOST">
      <p><i class="nf nf-fa-info_circle"></i> Check If a Port is Open on the given Host</p>
      <div class="bbn-flex-width">
        <div class="bbn-flex-fill bbn-margin">
          <bbn-input v-model="checkport.hostname"
                     @keydown.enter="checkportopen"
                     placeholder="<?= _("Host") ?>"
                     ></bbn-input>
          <bbn-button title="Check"
                    icon="nf nf-fa-check_circle"
                    class="bbn-tertiary bbn-vmargin"
                    @click.stop="checkportopen">Check port</bbn-button>
        </div>
        <div class="bbn-flex-fill bbn-margin">
          <bbn-input v-model="checkport.port"
                     @keydown.enter="checkportopen"
                     placeholder="<?= _("Port") ?>"
                     ></bbn-input>
        </div>
      </div>
      <div class="bbn-margin">
        <p v-if="showResult.checkportopen"
           v-for="res in result.checkportopen">
          {{res[0]}} --> Port {{res[1]}}:
          <i v-if="!res[2]" class="nf nf-md-lan_disconnect ic bbn-red"></i> <span v-if="!res[2]" class="bbn-red">Unreachable</span>
          <i v-else class="nf nf-cod-debug_disconnect ic bbn-green"></i> <span v-if="res[2]" class="bbn-green">Reachable</span>
        </p>
        <bbn-button title="Edit"
                    icon="nf nf-fa-trash"
                    class="bbn-state-selected"
                    @click.stop="clear('checkportopen')">Clear results</bbn-button>
      </div>
    </bbn-widget>
    <!--<bbn-widget class="network" label="getservbyport">
      <p><i class="nf nf-fa-info_circle"></i> Get Internet service which corresponds to port and protocol</p>
      <div class="bbn-flex-width">
        <div class="bbn-flex-fill bbn-margin">
          <bbn-input v-model="port"
                     button-right="nf nf-fa-check"
                     :action-right="getservbyport"
                     placeholder="<?= _("Server Port") ?>"
                     ></bbn-input>
        </div>
        <div class="bbn-flex-fill bbn-margin">
          <bbn-dropdown v-model="protocol"
                        :value="protocol"
                        :source=protocols></bbn-dropdown>
        </div>
      </div>
      <div class="bbn-margin">
        <p v-if="showResult.getservbyport" v-for="res in result.getservbyport">
          {{res[0]}} - {{res[1]}} : {{res[2]}}
        </p>
        <bbn-button title="Edit"
                    icon="nf nf-fa-trash"
                    class="bbn-state-selected"
                    @click.stop="clear('getservbyport')">Clear results</bbn-button>
      </div>
    </bbn-widget>
    <bbn-widget class="network" label="net_get_interfaces">
      <p><i class="nf nf-fa-info_circle"></i> Get network interfaces</p>
      <div class="bbn-flex-width">
        <div class="bbn-flex-fill bbn-margin">
          <bbn-input button-right="nf nf-fa-check"
                     :action-right="netgetinterfaces"
                     disabled="true"
                     placeholder="<?= _("Test net_get_interfaces") ?>"
                     ></bbn-input>
          <br><br><br>
          <bbn-button title="Edit"
                      icon="nf nf-fa-trash"
                      class="bbn-state-selected"
                      @click.stop="clear('netgetinterfaces')">Clear results</bbn-button>
        </div>
      </div>
    </bbn-widget>-->
  </bbn-dashboard>
  <bbn-floater :width="800"
               :height="400"
               :title="false"
               :closable="true"
               @close="clearPopup"
               v-if="showPopup">
    <bbn-table class="c-margin" v-if="showResult.dns_get_record"
               :source="result.dns_get_record">
      <bbns-column field="host"
                   :width="150"
                   label="Host"
                   ></bbns-column>
      <bbns-column field="class"
                   :width="80"
                   label="Class"></bbns-column>
      <bbns-column field="ttl"
                   :width="80"
                   label="TTL"></bbns-column>
      <bbns-column field="type"
                   :width="80"
                   label="Type"></bbns-column>
      <bbns-column field=""
                   :render="renderValue"
                   label="Value"></bbns-column>
    </bbn-table>
    <ul class="c-margin bbn-black" v-if="showResult.gethostbynamel">
      <li>{{result.gethostbynamel[0]}}:
        <ul>
          <li v-for="ip in result.gethostbynamel[1]">{{ip}}</li>
        </ul>
      </li>
    </ul>
    <!--<p class="c-margin bbn-black" v-if="showResult.netgetinterfaces">
      {{result.netgetinterfaces}}
    </p>-->
  </bbn-floater>
</div>