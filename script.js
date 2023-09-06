var result = document.querySelector(".result");
var url = document.getElementById("url");
var shortStr = document.getElementById("shortStr");
var submit = document.getElementById("submit");
var $ = mdui.$;
var dialog = new mdui.Dialog("#dialog");

submit.onclick = function () {
  if (url.value == "") {
    alert("请输入长链接");
    return false;
  }
  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: url.value,
      shortStr: shortStr.value,
    }),
  })
    .then(function (res) {
      if (res.ok) return res.json();
      else throw res;
    })
    .then(function (data) {
      // 在弹窗上显示短链接
      result.querySelector(
        ".result-body"
      ).innerHTML = `<p>短链接：<span id="shortUrl">${location.host}/${data.data.shortUrl}</span></p>`;
      // 在弹窗上显示复制按钮
      result.querySelector(
        ".result-footer"
      ).innerHTML = `<button class="copy mdui-btn mdui-ripple mdui-text-color-light-green-900" id="copy">复制</button>`;

      // 复制按钮
      var copy = document.getElementById("copy");
      copy.onclick = function () {
        // 将短链接复制到剪贴板
        var shortUrl = document.querySelector("#shortUrl");
        try {
          let range = document.createRange();
          range.selectNode(shortUrl);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
          document.execCommand("copy");
          window.getSelection().removeAllRanges();
          alert("复制成功");
        } catch (e) {
          alert("复制失败");
        }
      };

      // 显示弹窗
      dialog.open();
    })
    .catch(async function (err) {
      console.log(err);
      let data;
      try {
        data = await err.json();
      } catch (e) {
        alert("提交失败，请检查网络");
        return false;
      }
      console.log(data);
      result.querySelector(".result-body").innerHTML = `<p>${data.msg}</p>`;
      dialog.open();
    });
};
