function createXmlHttpRequest() {
  var xmlHttp;
  // 判断浏览器是否支持XMLHttpRequest
  if (window.XMLHttpRequest) {
    // 创建请求对象
    xmlHttp = new XMLHttpRequest();
  } else {
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  return xmlHttp;
}
// method表示请求方式(get 和 post) url请求地址，success成功，b表示异步
function ajax(method, url, success, b) {
  var xmlHttp = createXmlHttpRequest();
  // 链接服务器
  xmlHttp.open(method, url, b);
  // 发送请求
  xmlHttp.send();
  // 响应
  xmlHttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      success(JSON.parse(this.responseText));
    }
  };
}
