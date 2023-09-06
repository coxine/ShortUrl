var result = document.querySelector('.result');
        var url = document.getElementById('url');
        var shortStr = document.getElementById('shortStr');
        var submit = document.getElementById('submit');
        submit.onclick = function () {
            if (url.value == '') {
                alert('请输入长链接');
                return false;
            }
            fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: url.value,
                    shortStr: shortStr.value
                })
            }).then(function (res) {
                if (res.ok)
                    return res.json();
                else
                    throw res;
            }).then(function (data) {
                // alert('提交成功，短链接为：' + data.data.shortUrl);
                // 在弹窗上显示短链接

                result.querySelector('.result-body').innerHTML =
                    `<p>短链接：<span id="shortUrl">${location.host}/${data.data.shortUrl}</span></p>`;
                // 在弹窗上显示复制按钮
                result.querySelector('.result-footer').innerHTML =
                    `<button class="copy mdui-btn mdui-ripple" id="copy">复制</button>`;

                // 复制按钮
                var copy = document.getElementById('copy');
                copy.onclick = function () {
                    // 将短链接复制到剪贴板
                    var shortUrl = document.querySelector('#shortUrl');
                    try {
                        let range = document.createRange();
                        range.selectNode(shortUrl);
                        window.getSelection().removeAllRanges();
                        window.getSelection().addRange(range);
                        document.execCommand('copy');
                        window.getSelection().removeAllRanges();
                        alert("复制成功");
                    } catch (e) {
                        alert("复制失败");
                    }
                }
                // 显示弹窗
                result.classList.add('result-show');
            }).catch(async function (err) {
                console.log(err);
                let data;
                try {
                    data = await err.json();
                } catch (e) {
                    alert('提交失败，请检查网络');
                    return false
                }
                console.log(data);
                result.querySelector('.result-body').innerHTML = `<p>${data.msg}</p>`;
                result.querySelector('.result-footer').innerHTML =
                    `<button class="confirm mdui-btn mdui-ripple" id="confirm">确定</button>`;
                var confirm = document.getElementById('confirm');
                confirm.onclick = function () {
                    result.classList.remove('result-show');
                }
                result.classList.add('result-show');
            })
        }
        // 关闭按钮
        document.querySelector('.result-close').onclick = function () {
            result.classList.remove('result-show');
        }
        // 点击空白处关闭弹窗
        result.onclick = function (e) {
            // 阻止事件冒泡
            e.stopPropagation();
            if (e.target == result) {
                result.classList.remove('result-show');
            }
        }