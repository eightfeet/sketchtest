/* eslint-disable */

/**
 * BrowserUpdate 提示
 */
(function() {
  var $buoop = {vs:{i:8,f:25,o:20,s:8,c:30},api:4};
  function $buo_f(){
    var e = document.createElement("script");
    e.src = "//browser-update.org/update.min.js";
    document.body.appendChild(e);
  };
  try {document.addEventListener("DOMContentLoaded", $buo_f,false)}
  catch(e){window.attachEvent("onload", $buo_f)}
})();

/**
 * 百度统计代码
 */
var _hmt = _hmt || [];
(function() {
var hm = document.createElement("script");
hm.src = "https://hm.baidu.com/hm.js?3c7c0279531215b3d6e7e9e4d6475baf";
var s = document.getElementsByTagName("script")[0];
s.parentNode.insertBefore(hm, s);
})();
