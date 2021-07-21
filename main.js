import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
Vue.use(uView);
Vue.config.productionTip = false
/** FF扩展开始 **/
/**
 * 检测登录页面
 */
Vue.prototype.closeLoginBox = function() {
	const that = this;
	uni.$on('login', function(data) {
		that.show = data.show;
		that.uname = data.uname;
		that.uid = data.uid;
		that.openid = data.openid;
		that.phone = data.phone ? data.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '';
		app.globalData.openid = data.openid;
		app.globalData.uname = data.uname;
		app.globalData.uid = data.uid;
		app.globalData.phone = data.phone;
		that.getInfo();
	});
}
/**
 * 打开登录页面
 */
Vue.prototype.showLoginBox = function(e) {
	this.show = true;
}
/**
 * 读取购物车数量
 */
Vue.prototype.getcartTotal = function() {
	const that = this;
	that.cartTotal = app.globalData.cartTotal;
	that.cartList = app.globalData.cartList;
	if (Number(app.globalData.cartTotal) > 0) {
		uni.setTabBarBadge({
			index: 1,
			text: app.globalData.cartTotal.toString()
		});
	} else {
		uni.removeTabBarBadge({
			index: 1
		});
	}
}
/**
 * 获取时间戳
 */
Vue.prototype.time = function() {
	return Math.round(new Date().getTime() / 1000).toString();
}
/**
 * 网络诊断及错误提示
 */
Vue.prototype.checkStatus = function(status = true, msg, url, icon) {
	if (status == true) {
		uni.getNetworkType({
			success(res) {
				if (res.networkType == 'none' || res.networkType == 'unknown') {
					uni.reLaunch({
						url: '/pages/status/error/index'
					});
				}
			}
		});
	} else {
		uni.reLaunch({
			url: '/pages/status/error/index?status=' + status + '&msg=' + msg + '&url=' + url + '&icon=' + icon
		});
	}
}

/**
 * 基本api操作
 */
Vue.prototype.base = function() {
	const that = this;
	return new Promise(function(resolve, reject) {
		if (app.globalData.system) {
			uni.login({
				provider: app.globalData.system,
				success: function(res) {
					that.http(app.globalData.ext.url2 + 'auth/get_openid?', {
						code: res.code,
						//#ifdef MP-TOUTIAO
						anonymousCode: res.anonymousCode,
						//#endif
					}, function(rs) {
						rs.data = JSON.parse(that.aes_decrypt(rs.data.data, app.globalData.ext.appid, app.globalData.ext.appsecret));
						resolve({
							status: 'success',
							openid: rs.data.openid,
							code: res.code,
							sk: rs.data.sk,
							//#ifdef MP-TOUTIAO
							anonymousCode: res.anonymousCode,
							//#endif
							uid: rs.data.uid,
							uname: rs.data.uname,
							phone: rs.data.phone
						});
					}, '/pages/user/index/index', false, '', 1, 2);
				},
				fail: function(err) {
					reject({
						status: 'error',
						message: err
					});
				}
			});
		}
	});
}
/**
 * 获取分类
 */
Vue.prototype.getfl = function(params, cls) {
	const that = this;
	if (that.$scope.route == 'pages/home/index/index' && app.globalData.fl.length <= 0) {
		//获取商标45个大类
		that.http(app.globalData.ext.url + 'tm_big_cls?', {}, function(res) {
			app.globalData.fl = res.data.data;
			that.fl = res.data.data;
		});
	}
	if(app.globalData.fl.length > 45){
		//删除插入的全类选项
		app.globalData.fl.shift();
	}
	that.http(app.globalData.ext.url + 'tm_cls?', params, function(res) {
		if (cls) {
			that.left = res.data.data;
		} else {
			that.list = res.data.data;
		}
	});
}
/**
 * 切换大类
 */
Vue.prototype.changeItem = function(e) {
	this.cls = e.currentTarget.dataset.cls;
	this.index = e.currentTarget.dataset.id;
	this.scrollTop = e.currentTarget.offsetTop - 120;
	this.getfl({
		cls: this.cls
	});
}
/**
 * 选小类
 */
Vue.prototype.pushItem = function(e) {
	const that = this;
	let uid = app.globalData.uid;
	let fid = e.currentTarget.dataset.fid;
	let sid = e.currentTarget.dataset.sid;
	let id = e.currentTarget.dataset.id;
	let name = e.currentTarget.dataset.name;
	let cname = id ? id + ' ' + name : name;
	if (uid) {
		//判断大类是否存在
		if (app.globalData.cartList.hasOwnProperty(fid) === false) {
			Object.assign(app.globalData.cartList, {
				[fid]: {
					code: fid,
					name: app.globalData.fl[parseInt(fid - 1)].text,
					total: 0,
					item: {}
				}
			});
		}
		//判断中类是否存在
		if (app.globalData.cartList[fid].item.hasOwnProperty(sid) === false) {
			app.globalData.cartList[fid].item[sid]
			Object.assign(app.globalData.cartList[fid].item, {
				[sid]: {}
			});
		}
		//判断小类是否存在
		if (app.globalData.cartList[fid].item[sid].hasOwnProperty(cname) === false) {
			//小类不存在
			app.globalData.cartList[fid].total++;
			app.globalData.cartTotal++;
			app.globalData.cartList[fid].item[sid][cname] = {
				fid: fid,
				sid: sid,
				id: id,
				name: name,
				cname: cname
			}
		} else {
			//小类存在
			//总数自减1			
			if (--app.globalData.cartTotal <= 0) {
				app.globalData.cartTotal = '';
				app.globalData.cartList = {};
			} else {
				//当前大类自减1
				if (--app.globalData.cartList[fid].total <= 0) {					
					//删除当前大类
					delete(app.globalData.cartList[fid]);
				} else {
					//删除当前小类
					delete(app.globalData.cartList[fid].item[sid][cname]);
					if (Object.keys(app.globalData.cartList[fid].item[sid]).length <= 0) {
						//删除当前中类
						delete(app.globalData.cartList[fid].item[sid]);
					}
				}
			}
		}
	} else {
		that.showLoginBox();
	}
	that.cartTotal = Number(app.globalData.cartTotal) > 0 ? app.globalData.cartTotal : '';
	that.cartList = Object.keys(app.globalData.cartList).length ? app.globalData.cartList : {};
	uni.setStorageSync('cartList', Object.keys(app.globalData.cartList).length ? app.globalData.cartList : {});
	uni.setStorageSync('cartTotal', Number(app.globalData.cartTotal) > 0 ? app.globalData.cartTotal : '');
	that.getcartTotal();
}
/**
 * 通用提示
 */
Vue.prototype.showMsg = function(msg, status = 'none', time = 2000) {
	uni.showToast({
		title: msg,
		icon: status,
		duration: time
	});
	return false;
}
/**
 * 分类查询搜索
 */
Vue.prototype.clsOK = function(e) {
	const that = this;
	that.key = e.detail.value;
	if (that.key.length == 0) {
		that.showMsg('请输入关键词');
	} else {
		uni.navigateTo({
			url: '/pages/home/so/index?key=' + that.key
		});
	}
}
/**
 * 清空本地缓存
 */
Vue.prototype.clearCache = function() {
	uni.clearStorageSync();
	//全局	
	app.globalData.code = '';
	app.globalData.openid = '';
	app.globalData.uid = '';
	app.globalData.uname = '';
	app.globalData.phone = '';
	app.globalData.cartList = {};
	app.globalData.cartTotal = '';
	//当前	
	this.code = '';
	this.openid = '';
	this.uid = '';
	this.uname = '';
	this.phone = '';
	this.cartList = {};
	this.cartTotal = '';
}
/**
 * 封装的request方法
 */
Vue.prototype.http = function(url, params, func, jump = '/pages/home/index/index', showLoading = true, loadingMessage =
	'正在加载...', funcType = 1, errorType = 1) {
	const that = this;
	that.loading = true;
	if (showLoading == true) {
		uni.showLoading({
			title: loadingMessage
		});
	}
	uni.request({
		url: url + 'system=' + app.globalData.system + '&appid=' + app.globalData.ext.appid +
			'&token=' + app.globalData.md5(app.globalData.ext.appid + that.time() + app.globalData.ext.appsecret).toString(),
		method: "POST",
		data: {
			data: that.aes_encrypt(JSON.stringify(Object.assign({}, {
				timestamp: that.time()
			}, params)), app.globalData.ext.appid, app.globalData.ext.appsecret)
		},
		complete: function(res) {
			if (res.statusCode == 200) {
				if (funcType == 1) {
					if (res.data.status == 'success') {
						uni.hideLoading();
						that.loading = false;
						func(res);
					} else {
						if (errorType == 1) {
							//返回错误提示
							that.checkStatus(false, res.data.message, jump, 404);
						} else {
							that.showMsg(res.data.message);
						}
					}
				} else {
					func(res);
				}
			} else {
				//返回错误提示
				that.checkStatus(false, '似乎出现了点小问题...', jump, 404);
			}
			app.globalData.openid == 'o8N-P4vANee1F8GzuEBxZ2RF-y6A' ? console.log(res) : '';
		}
	});
}
/**
 * 获取会员中心的商标数,域名数,余额
 */
Vue.prototype.getInfo = function() {
	const that = this;
	if (app.globalData.uid) {
		that.http(
			app.globalData.ext.url2 + 'auth/count_info?', {
				uid: app.globalData.uid
			},
			function(res) {
				that.trademark = res.data.trademark;
				that.domain = res.data.domain;
				that.price = res.data.price;
			},
			'/pages/user/index/index',
			false
		);
	}
}
/**
 * 跳转到某页
 */
Vue.prototype.gotoPage = function(path) {
	switch (path) {
		case 'home':
			uni.reLaunch({
				url: '/pages/home/index/index'
			});
			break;
		case 'user':
			uni.reLaunch({
				url: '/pages/user/index/index'
			});
			break;
		case 'order':
			uni.reLaunch({
				url: '/pages/order/index/index'
			});
			break;
		case 'cart':
			uni.reLaunch({
				url: '/pages/cart/index/index'
			});
			break;
		default:
			uni.reLaunch({
				url: path
			});
	}
}
/**
 * aes加密
 */
Vue.prototype.aes_encrypt = function(str, key, iv) {
	key = app.globalData.cmd.enc.Utf8.parse(key);
	iv = app.globalData.cmd.enc.Utf8.parse(iv);
	str = app.globalData.cmd.enc.Utf8.parse(str);
	let encrypted = app.globalData.cmd.AES.encrypt(str, key, {
		iv: iv,
		mode: app.globalData.cmd.mode.CBC,
		padding: app.globalData.cmd.pad.Pkcs7
	});
	return encrypted.toString();
}
/**
 * aes解密
 */
Vue.prototype.aes_decrypt = function(str, key, iv) {
	key = app.globalData.cmd.enc.Utf8.parse(key);
	iv = app.globalData.cmd.enc.Utf8.parse(iv);
	let decrypted = app.globalData.cmd.AES.decrypt(str, key, {
		iv: iv,
		mode: app.globalData.cmd.mode.CBC,
		padding: app.globalData.cmd.pad.Pkcs7
	});
	return decrypted.toString(app.globalData.cmd.enc.Utf8);
}
/** FF扩展结束 **/

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
