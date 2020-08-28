window.onload = function () {
  // ajax(
  //   "get",
  //   "helloworld.json",
  //   function (res) {
  //     console.log(res);
  //   },
  //   true
  // );

  // 轮播图列表
  getBannerList();

  // 秒杀专区数据
  msApi();

  // 获取热卖单品数据
  hotSaleList();

  // 猜你喜欢数据
  guessLikeApi();
  //搜索框
  var searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("keyup", debounce(getsuggestName, 500), false);
  searchInput.addEventListener("blur", hideKeyWord, false);
  searchInput.addEventListener("focus", showKeyWord, false);

  function showKeyWord() {
    if (searchInput.value !== "") {
      // getsuggestName();
      document.getElementById("search-suggest").style.display = "block";
    }
  }
  function hideKeyWord() {
    document.getElementById("search-suggest").style.display = "none";
  }
  // 动态请求接口方式显示提示框

  function getsuggestName() {
    var ul = document.getElementById("suggest-detail");
    ajax(
      "get",
      "suggest.json",
      function (res) {
        if (res.code == 0) {
          var data = res.data;
          var str = "";
          for (var i = 0; i < data.length; i++) {
            str += "<li>" + data[i].suggestname + "</li>";
          }
          ul.innerHTML = str;
          showKeyWord();
        }
      },
      true
    );
  }
  // 防抖函数：处理每次键盘敲打都会请求接口的问题
  function debounce(fn, delay) {
    var handel;
    return function () {
      clearTimeout(handel);
      handel = setTimeout(function () {
        fn();
      }, delay);
    };
  }

  //获取轮播图列表
  function getBannerList() {
    ajax(
      "get",
      "swiper.json",
      function (res) {
        if (res.code == 0) {
          //轮播图循环进入容器
          var data = res.data;
          var swiper = document.getElementById("swiper");
          var str = "";
          for (i = 0; i < data.length; i++) {
            str +=
              '<li class="swiper-item"><a href="#"><img src="' +
              data[i].banner_img +
              '" alt="" /></a></li>';
          }
          swiper.innerHTML = str;
          // 小圆点列表
          var indicators = document.getElementById("indicators");
          var str2 = "";

          for (i = 0; i < data.length; i++) {
            if (i == 0) {
              str2 +=
                ' <div class="on indicator" data-index="' + i + '"></div>';
            } else {
              str2 += ' <div class="indicator" data-index="' + i + '"></div>';
            }
          }
          indicators.innerHTML = str2;
          bannerOption();
        }
      },
      true
    );
  }

  //轮播图操作
  function bannerOption() {
    var swiper = document.getElementById("swiper"); //获取轮播图包裹元素
    var swiperItem = swiper.getElementsByClassName("swiper-item"); //获取轮播图列表
    var prev = document.getElementsByClassName("prev")[0]; //获取上一张按钮
    var next = document.getElementsByClassName("next")[0]; //获取下一张按钮
    var indicators = document.getElementsByClassName("indicator"); //获取圆点列表
    var timer = null; //设置定时器
    var index = 0; //设置当前索引是0

    // 为每张图片添加opacity属性以及位移
    for (var i = 0; i < swiperItem.length; i++) {
      if (index == i) {
        swiperItem[i].style.opacity = 1;
      } else {
        swiperItem[i].style.opacity = 0;
      }
      swiperItem[i].style.transform =
        "translateX(" + -i * swiperItem[0].offsetWidth + "px)";
    }
    //给小圆点添加点击事件
    for (var k = 0; k < indicators.length; k++) {
      indicators[k].onclick = function () {
        clearInterval(timer);
        var clickIndex = parseInt(this.getAttribute("data-index"));
        index = clickIndex;
        changeImg();
      };
    }

    // 上一张
    prev.onclick = function () {
      clearInterval(timer);
      index--;
      changeImg();
    };
    // 下一张
    next.onclick = function () {
      clearInterval(timer);
      index++;
      changeImg();
    };

    // 鼠标进入停止播放
    swiper.addEventListener(
      "mouseover",
      function () {
        clearInterval(timer);
      },
      false
    );

    // 鼠标离开继续播放
    swiper.addEventListener(
      "mouseout",
      function () {
        autoChange();
      },
      false
    );

    // 清除所有的opacity为0,并且设置循环播放 改变图片
    function changeImg() {
      if (index < 0) {
        index = swiperItem.length - 1;
      } else if (index > swiperItem.length - 1) {
        index = 0;
      }
      for (var i = 0; i < swiperItem.length; i++) {
        swiperItem[i].style.opacity = 0;
      }
      swiperItem[index].style.opacity = 1;
      setIndicatorOn();
    }

    //设置小圆点击状态
    function setIndicatorOn() {
      for (var i = 0; i < indicators.length; i++) {
        indicators[i].classList.remove("on");
      }
      indicators[index].classList.add("on");
    }

    autoChange();
    //自动播放
    function autoChange() {
      timer = setInterval(function () {
        index++;
        changeImg();
      }, 4000);
    }
  }

  //秒杀专区数据获取
  function msApi() {
    ajax(
      "get",
      "miaoshaList.json",
      function (res) {
        if (res.code == 0) {
          // 秒杀倒计时
          var ms_time = res.data.ms_time;
          countDown(ms_time);

          // 获取秒杀列表元素
          var miaoshaList = document.getElementById("miaoshaList");
          var good_list = res.data.good_list;
          var str = "";
          for (i = 0; i < good_list.length; i++) {
            str += ` <div class="ms-item">
            <a href="#" class="ms-item-lk">
              <img src="${good_list[i].good_img}" alt="" class="ms-item-img" />
              <p class="ms-item-name">${good_list[i].good_name}</p>
              <div class="ms-item-buy">
                <span class="progress"><span class="progress-bar" style="width:${good_list[i].progress}"></span></span>
                <span class="buy-num">${good_list[i].progress}</span>
              </div>
              <div class="ms-item-price clearfix">
                <span class="cm-price new-price">￥${good_list[i].new_price}</span>
                <span class="cm-price origin-price">￥${good_list[i].old_price}</span>
              </div>
            </a>
          </div>`;
          }
          miaoshaList.innerHTML = str;
        }
      },
      true
    );
  }

  // 热卖单品数据获取
  function hotSaleList() {
    ajax(
      "get",
      "hotsale.json",
      function (res) {
        if (res.code == 0) {
          var data = res.data;
          var str = "";
          var hotsalelist = document.getElementById("hotsaleList");
          for (var i = 0; i < data.length; i++) {
            str += `<li class="bs-item item">
            <a href="#">
              <img src="${data[i].good_img}" alt="" class="item-img" />
              <p class="title">
                ${data[i].good_name}
              </p>
              <div class="line-2 clearfix">
                <span class="comment">评论<em>${data[i].commentNum}</em></span>
                <span class="collect">收藏<em>${data[i].collectNum}</em></span>
              </div>
              <div class="line-3">
                <span class="strong">${data[i].new_price}</span>
                <span class="price-through">￥${data[i].old_price}</span>
                <span class="sell">月销${data[i].monthsale}笔</span>
              </div>
            </a>
          </li>`;
          }
          hotsalelist.innerHTML = str;
        }
      },
      true
    );
  }

  //获取猜你喜欢数据
  function guessLikeApi() {
    ajax(
      "get",
      "guesslike.json",
      function (res) {
        if (res.code == 0) {
          var data = res.data;
          var str = "";
          var guesslist = document.getElementById("gl");
          for (var i = 0; i < data.length; i++) {
            str += ` <li class="like-item item">
            <a href="#">
              <img src="${data[i].good_img}" alt="" class="item-img" />
            </a>
            <p class="title">${data[i].good_name}</p>
            <div class="line-3">
              <span class="strong">${data[i].new_price}</span>
              <span class="sell">月销${data[i].monthsale}笔</span>
            </div>
            <a href="#" class="item-more">发现更多相似宝贝</a>
          </li>`;
          }
          guesslist.innerHTML = str;
        }
      },
      true
    );
  }

  // 加载更多
  document.getElementById("loadMore").onclick = function () {
    for (var i = 0; i < 5; i++) {
      var liNode = document.createElement("li");
      liNode.setAttribute("class", "like-item item");
      var liContent = "";
      liContent += ` <a href="#">
    <img src="./img/good.jpg" alt="" class="item-img" />
  </a>
  <p class="title">分布式无线路由器</p>
  <div class="line-3">
    <span class="strong">1100</span>
    <span class="sell">月销3000笔</span>
  </div>
  <a href="#" class="item-more">发现更多相似宝贝</a>`;
      liNode.innerHTML = liContent;
      document.getElementById("gl").appendChild(liNode);
    }
  };

  //秒杀倒计时
  function countDown(t) {
    var ms_time = t;
    var ms_timer = setInterval(function () {
      if (ms_time < 0) {
        clearInterval(ms_timer);
      } else {
        calTime(ms_time);
        ms_time--;
      }
    }, 1000);
  }

  // 计算时间
  function calTime(time) {
    var hour = Math.floor(time / 60 / 60); //小时
    var minutes = Math.floor((time / 60) % 60); //分钟
    var seconds = Math.floor(time % 60); //秒
    hour = formatTime(hour);
    minutes = formatTime(minutes);
    seconds = formatTime(seconds);
    document.getElementsByClassName("cd_hour")[0].innerHTML = hour;
    document.getElementsByClassName("cd_minute")[0].innerHTML = minutes;
    document.getElementsByClassName("cd_second")[0].innerHTML = seconds;
  }
  // 格式化时间
  function formatTime(t) {
    if (t < 10) {
      t = "0" + t;
    }
    return t;
  }
};

//悬浮菜单功能实现
window.onscroll = function () {
  scrollShow();
  var winPos = document.documentElement.scrollTop || document.body.scrollTop; //兼容写法获取滚动距离
  var hotSale = document.getElementById("hotsale"); //获取热卖专区元素
  var hotHeight = hotSale.offsetTop + hotSale.offsetHeight; //获取猜你喜欢之前的总高度
  //逻辑实现
  if (winPos < hotSale.offsetTop) {
    addOn(0);
  } else if (winPos > hotSale.offsetTop && winPos < hotHeight) {
    addOn(1);
  } else {
    addOn(2);
  }
};

//添加菜单激活状态
function addOn(index) {
  var tool = document.getElementsByClassName("tool")[0];
  var toolItem = tool.getElementsByTagName("a");
  for (var i = 0; i < toolItem.length; i++) {
    toolItem[i].classList.remove("on");
  }
  toolItem[index].classList.add("on");
}

//滚动一定距离才显示返回顶部按钮
function scrollShow() {
  var top = document.documentElement.scrollTop || document.body.scrollTop;
  if (top > 500) {
    document.getElementById("goTop").style.display = "block";
  } else {
    document.getElementById("goTop").style.display = "none";
  }
}

//返回顶部
function goTop() {
  var topTimer = setInterval(function () {
    var scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    var iSpeed = Math.floor(-scrollTop / 8);
    if (scrollTop == 0) {
      clearInterval(topTimer);
    }
    document.documentElement.scrollTop = document.body.scrollTop =
      scrollTop + iSpeed;
  }, 30);
}
