<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import 'uview-ui/index.scss';
</style>
<script>
const update = uni.getUpdateManager();
const crypto = require('crypto-js');
export default {
	globalData: {
		ext: {						
			domain:'https://chaolong.com',
			url: 'https://chaolong.com/tmapi/search/',
			url2: 'https://chaolong.com/clweapp/',		
			appid: '',
			appsecret: '',
			version: '1.0.14'
		},
		system: '',
		so: [],
		cmd: crypto,
		md5: crypto.MD5,
		winH: 0,
		winW: 0,
		navH: 50,
		cartTotal: '',
		cartList: {},
		shareTitle: '超龙商标',
		shareImg: '',
		code: '',
		uname: '',
		openid:'',
		uid: '',
		phone: '',
		fl: [],
		somode: [
			{
				value: 3,
				text: '精确查询'
			},
			{
				value: 2,
				text: '近似查询'
			},
			{
				value: 5,
				text: '申请号'
			},
			{
				value: 1,
				text: '拼音相同'
			},
			{
				value: 4,
				text: '申请人'
			}
		]
	},
	onLaunch: function() {
		const that = this;
		/* 小程序的自动检查更新 - 只有小程序有用 */
		update.onUpdateReady(function() {
			uni.showModal({
				title: '提示',
				content: '发现新的版本',
				showCancel: false,
				success(res) {
					if (res.confirm) {
						that.clearCache();
						update.applyUpdate();
					}
				}
			});
		});

		/* 获取当前是什么客户端 */
		//#ifdef APP-PLUS
		that.globalData.system = uni.getSystemInfoSync().platform;
		//#endif
		//#ifdef H5
		that.globalData.system = 'h5';
		//#endif
		//#ifdef MP-WEIXIN
		that.globalData.system = 'weixin';
		//#endif
		//#ifdef MP-ALIPAY
		that.globalData.system = 'alipay';
		//#endif
		//#ifdef MP-BAIDU
		that.globalData.system = 'baidu';
		//#endif
		//#ifdef MP-TOUTIAO
		that.globalData.system = 'toutiao';
		//#endif
		//#ifdef MP-QQ
		that.globalData.system = 'qq';
		//#endif
		//#ifdef MP-360
		that.globalData.system = '360';
		//#endif	
		that.globalData.winW = uni.getSystemInfoSync().windowWidth;
		that.globalData.winH = uni.getSystemInfoSync().windowHeight;
		that.globalData.cartList = uni.getStorageSync('cartList') ? uni.getStorageSync('cartList') : {};
		that.globalData.cartTotal = Number(uni.getStorageSync('cartTotal')) > 0 ? uni.getStorageSync('cartTotal') : '';
		that.globalData.openid= uni.getStorageSync('openid') ? uni.getStorageSync('openid') : '';
		that.globalData.uid = uni.getStorageSync('uid') ? uni.getStorageSync('uid') : '';
		that.globalData.uname = uni.getStorageSync('uname') ? uni.getStorageSync('uname') : '';
		that.globalData.phone = uni.getStorageSync('phone') ? uni.getStorageSync('phone') : '';
		that.globalData.code = uni.getStorageSync('code') ? uni.getStorageSync('code') : '';
		that.globalData.shareImg = '/static/icon/share_' + that.globalData.system + '.png';

		if (that.globalData.uid && that.globalData.uname == '') {
			that.globalData.openid = '';
			that.globalData.code = '';
			that.globalData.uid = '';
			that.globalData.uname = '';
			that.globalData.phone = '';
			that.globalData.cartList = {};
			that.globalData.cartTotal = '';
			that.clearCache();
		}		
	},
	onShow: function() {},
	onHide: function() {}
};
</script>
<style>
@import '/static/css/style.css';
</style>
