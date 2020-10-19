import Configs from "/class/Configs.js"
import Helpers from "/class/Helpers.js"

if (!chrome.cookies) {
  chrome.cookies = chrome.experimental.cookies;
}
document.addEventListener('DOMContentLoaded', function() {
  TH_Onload();
});

function TH_Onload(){
  chrome.cookies.getAll({}, (cookies) => {
    var cookieConfig = new Configs(cookies)
    // cookie on change event
    chrome.cookies.onChanged.addListener((info) => {
      // update cookie whenever match with cookie key in config and from bonadmin.com
      if (info.removed) {
        // update cookie in cookieConfig without remove cookie in browser
        cookieConfig.removeCookie(info.cookie.domain, info.cookie.name)
      } else {
        cookieConfig.addCookie(info.cookie)
      }
      if (info.cookie.domain == '.bonadmin.com' && cookieConfig.getCookiesKey().includes(info.cookie.name)) {
        cookieConfig.updateCookie(true)
      }
    })
    var add_cookie_config = (e) => {
      console.log(e.keyCode)
      // if press enter on input or click add button
      if (e.keyCode == 13 || !e.keyCode) {
        let cookie_key_input = Helpers.select('#cookie-to-copy');
        if (cookie_key_input.value.trim() !== '') 
          cookieConfig.addCookieKey(cookie_key_input.value)
        // empty input
        cookie_key_input.value = ""
      }
    }
    var add_domain_config = (e) => {
      // if press enter on input or click add button
      if (e.keyCode == 13 || !e.keyCode) {
        let domain_input = Helpers.select('#domain-to-set');
        if (domain_input.value.trim() !== '') 
          cookieConfig.addDomain(domain_input.value)
        // empty input
        domain_input.value = ""
      }
    }
    // add button event
    let add_cookie_btn = Helpers.select('#add-cookie');
    let add_domain_btn = Helpers.select('#add-domain');
    let cookie_key_input = Helpers.select('#cookie-to-copy');
    let domain_input = Helpers.select('#domain-to-set');
    add_cookie_btn.addEventListener('click', add_cookie_config)
    cookie_key_input.addEventListener('keyup', add_cookie_config)
    add_domain_btn.addEventListener('click', add_domain_config)
    domain_input.addEventListener('keyup', add_domain_config)
    // update button event
    let update_btn = Helpers.select('#update-btn');
    update_btn.addEventListener('click', function(){
      if (cookieConfig.getDomains().length > 0) {
        cookieConfig.updateCookie(true)
      } else {
        alert('No domain was found')
      }
    })
    cookieConfig.reloadDomainTable();
    cookieConfig.reloadCookieKeyTable();
    cookieConfig.reloadCookieDomainTable();
  });
}

