import Cookie from "./Cookie.js"
import Helpers from "./Helpers.js"
class Configs extends Cookie {
  configs = {}
  domain_selected = ''
  source_domain = '.bonadmin.com'
  constructor(cookies) {
    // initiallize Cookie
    super(cookies)
    this.initConfig()
    this.domain_selected = this.configs['domain_to_set'] ? this.configs['domain_to_set'][0] : ''
  }

  // init configuration
  initConfig() {
    if (localStorage.getItem('cookieConfig')) {
      this.configs = JSON.parse(localStorage.getItem('cookieConfig'))
    } else {
      let initConfig = {
        key_to_copy: [
          '_UAI2',
        ],
        domain_to_set: [
          "localhost"
        ]
      }
      localStorage.setItem('cookieConfig', JSON.stringify(initConfig))
      this.configs = initConfig
    }
  }

  // add one cookie key to config
  addCookieKey(key) {
    if (!this.configs['key_to_copy'].includes(key)) {
      this.configs['key_to_copy'].push(key)
      localStorage.setItem('cookieConfig', JSON.stringify(this.configs))
      this.reloadCookieKeyTable()
    }
  }

  /**
   * Add one domain to config
   * @param {string} domain domain name
   */
  addDomain(domain) {
    if (!this.configs['domain_to_set'].includes(domain)) {
      this.configs['domain_to_set'].push(domain)
      localStorage.setItem('cookieConfig', JSON.stringify(this.configs))
      this.reloadDomainTable()
      if (this.configs['domain_to_set'].length == 1) {
        this.domain_selected = domain
        this.reloadCookieDomainTable()
      }
    }
  }

  /**
   * Remove one cookie key in config
   * @param {string} key key name
   */
  removeCookieKey(key) {
    this.configs['key_to_copy'] = this.removeItemAll(this.getCookiesKey(), key)
    localStorage.setItem('cookieConfig', JSON.stringify(this.configs))
  }

  /**
   * Remove one domain in config
   * @param {string} domain domain name
   */
  removeDomain(domain) {
    this.configs['domain_to_set'] = this.removeItemAll(this.getDomains(), domain)
    localStorage.setItem('cookieConfig', JSON.stringify(this.configs))
  }

  /**
   * Remove all specific item in array
   * @param {array} arr 
   * @param {string} value item to remove
   */
  removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }

  // get cookie key in configuration
  getCookiesKey() {
    return this.configs['key_to_copy']
  }

  // get domain in configuration
  getDomains() {
    return this.configs['domain_to_set']
  }

  // reload all table
  reloadAll() {
    this.reloadDomainTable()
    this.reloadCookieKeyTable()
    this.reloadCookieDomainTable()
  }

  // reload domain configuration table
  reloadDomainTable() {
    this.reloadTable(this.configs['domain_to_set'], '.domain-list')
  }
  
  // reload cookie key configuration table
  reloadCookieKeyTable() {
    this.reloadTable(this.configs['key_to_copy'], '.cookie-list')
  }

  // reload cookies belong to specific domain in main big table
  reloadCookieDomainTable() {
    this.reloadTable(super.getDomain(this.domain_selected), '.main-list')
  }

  reloadTable(data, table_class) {
    /**
     * generate one row of Domain configuration table or Cookie configuration table
     * @param {string} data domain/cookie name
     */
    // generate one row of domain cookie
    function tableRow(data) {
      return [
        '<tr select-key="'+data+'">',
          '<td class="item-name"><span class="text">'+data+'</span></td>',
          '<td width="60px"><button class="btn btn-danger btn-sm delete-btn" new delete-key="'+data+'">Delete</button></td>',
        '</tr>'
      ].join('')
    }
    /**
     * Generate one row of domain cookie
     * @param {cookie_object} data (cookie_object is cookie information get from chrome)
     */
    function tableDomainCookieRow(data) {
      return [
        '<tr>',
          '<td width="100px"><span class="text">'+data['name']+'</span></td>',
          '<td><span class="text">'+data['value']+'</span></td>',
          '<td width="60px"><button class="btn btn-danger btn-sm delete-btn" new delete-key="'+data['name']+'" delete-domain="'+data['domain']+'">Delete</button></td>',
        '</tr>'
      ].join('')
    }

    /**
     * Set class selected for domain table 
     * @param {string} domain_selected 
     */
    function setSelectedRow(domain_selected) {
      Helpers.selectAll(table_class + ' tbody tr').forEach((row) => {
        let $row = row
        const selected_key = $row.getAttribute('select-key')
        if (selected_key != domain_selected) {
          $row.classList.remove('selected')
        } else {
          $row.classList.add('selected')
        }
      })
    }
    let name_arr = data;
    let is_main_content_table = table_class == '.main-list'
    let is_domain_table = table_class == '.domain-list'
    let is_cookie_table = table_class == '.cookie-list'
    let html = `${name_arr.map(item => !is_main_content_table ? tableRow(item) : tableDomainCookieRow(item)).join('')}`;
    // set text if html is empty
    if (is_domain_table && html == '') {
      html = "Domain configuration is empty"
    }
    // set text if html is empty
    if (is_cookie_table && html == '') {
      html = "Cookie configuration is empty"
    }
    let table_body = Helpers.select(table_class + ' tbody');
    // overwrite tbody in table
    table_body.innerHTML = html;
    // on click on domain table row event
    if (is_domain_table) {
      // if there is no existed "selected domain", get data of first one by default
      if (!Helpers.select(table_class + ' tbody tr[select-key="'+this.domain_selected+'"]')) {
        let $first_row = Helpers.select(table_class + ' tbody tr:first-child')
        $first_row.classList.add('selected')
        this.domain_selected = $first_row.getAttribute('select-key')
        this.reloadCookieDomainTable()
      } else {
        Helpers.select(table_class + ' tbody tr[select-key="'+this.domain_selected+'"]').classList.add('selected')
        this.reloadCookieDomainTable()
      }
      Helpers.selectAll(table_class + ' tbody tr').forEach((row) => {
        // update big main table with current cookie of selected domain's row
        row.addEventListener('click', (e) => {
          let $this = e.target;
          // only trigger if click on row not on button
          if ($this.tagName !== 'BUTTON') {
            let $row = $this.closest('tr')
            const selected_key = $row.getAttribute('select-key')
            this.domain_selected = selected_key
            // reload cookie domain table
            this.reloadCookieDomainTable()
            setSelectedRow(selected_key)
          }
        })
      })
    }

    // delete button event
    Helpers.selectAll(table_class + ' .delete-btn[new]').forEach((button) => {
      button.addEventListener('click', (e) => {
        let $this = e.target;
        const delete_key = $this.getAttribute('delete-key')
        const delete_domain = $this.getAttribute('delete-domain')
        // remove specific cookie in main big table
        if (is_main_content_table) {
          super.removeCookie(delete_domain, delete_key, true)
          this.reloadCookieDomainTable()
        }
        // remove specific item in domain table
        if (is_domain_table) {
          this.removeDomain(delete_key)
          this.reloadDomainTable()
        }
        // remove specific item in cookie table
        if (is_cookie_table) {
          this.removeCookieKey(delete_key)
          this.reloadCookieKeyTable()
        }
        $this.removeAttribute('new')
      })
    })
  }

  /**
   * Sync cookie from designated website with designated domain in configuration
   * @param {boolean} reload reload all table or not
   */
  updateCookie(reload) {
    const domains = this.getDomains()
    const cookie_key = this.getCookiesKey()
    // get all cookies of domain "source_domain"
    var cookies = super.getDomain(this.source_domain);
    // expiration date timestamp
    var this_year = new Date();
    this_year.setFullYear(this_year.getFullYear() + 1);
    var next_year = this_year.getTime()
    cookies.forEach((cookie) => {
      const name = cookie['name'];
      // if "source_domain"'s cookie match with "cookie" in config, add that cookie to current "domain" in config
      if (cookie_key.includes(cookie['name'])) {
        domains.forEach(domain => {
          let cookie_data = {
            url: "http://" + domain,
            domain: domain,
            expirationDate: next_year,
            httpOnly: false, 
            name: name,
            path: "/",
            sameSite: "unspecified", 
            secure: false,
            storeId: "0", 
            value: cookie['value']
          }
          chrome.cookies.set(cookie_data)
          super.addCookie(cookie_data)
        });
      }
    })
    if (reload)
      // reload all table on screen
      this.reloadAll()
  }
}
export default Configs;