// Cookie object to cache cookie data in chrome browser and process it
class Cookie {
    cookies = {}
  
    constructor(cookies) {
      // initialize cookies array
      cookies.map((cookie) => {
        this.cookies[cookie['domain']] = this.cookies[cookie['domain']] || []
        this.cookies[cookie['domain']].push(cookie)
      })
    }
  
    /**
     * 
     * @param {string} domain domain name
     * @param {string} cookie_name cookie name
     * @param {boolean} remove_browser_cookie want to remove cookie on browser or not
     */
    removeCookie(domain, cookie_name, remove_browser_cookie) {
      var cookie = this.getCookie(domain, cookie_name);
      if (cookie) {
        var url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain +
        cookie.path;
        var domain_cookies = this.getDomain(cookie.domain)
        if (domain_cookies.length > 0) {
          this.setDomain(domain, domain_cookies.filter(item => item.name != cookie.name))
        }
        if (remove_browser_cookie)
          chrome.cookies.remove({"url": url, "name": cookie.name});
      }
    }
  
    /**
     * add or update cookie to this.cookies
     * @param {cookie_object} cookie (cookie_object is cookie information get from chrome)
     */
    addCookie(cookie) {
      let has_item = false;
      if (this.cookies[cookie.domain]) {
        this.cookies[cookie.domain].some((item) => {
          if (item.name == cookie.name) {
            item.value = cookie.value
            has_item = true;
            return;
          }
      })
      }
      if (!has_item) {
        this.cookies[cookie.domain] = this.cookies[cookie.domain] || []
        this.cookies[cookie.domain].push(cookie)
      }
    }
  
    /**
     * get cookie information from specific domain
     * @param {string} domain domain name
     * @param {string} cookie cookie name
     */
    getCookie(domain, cookie) {
      return this.cookies[domain] ? this.cookies[domain].find(item => item.name == cookie) : false
    }
  
    /**
     * set cookies for domain
     * @param {string} domain domain name
     * @param {array of cookie_object} cookies (cookie_object is cookie information get from chrome)
     */
    setDomain(domain, cookies) {
      this.cookies[domain] = cookies
    }
  
    /**
     * get all available cookies in specific domain
     * @param {string} domain domain name
     * @param {array of cookie_object} cookies (cookie_object is cookie information get from chrome)
     */
    getDomain(domain) {
      return this.cookies[domain] || []
    }
}

export default Cookie;