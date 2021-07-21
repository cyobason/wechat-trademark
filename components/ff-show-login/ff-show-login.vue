<template>
	<u-popup v-model="show" mode="center" :mask-close-able="false" border-radius="50">
		<view class="showLogin">
			<view class="showLogin_title">您还未登录</view>
			<view class="showLogin_des">请先登录再进行操作</view>
			<image :src="'/static/icon/' + img + '.png'" mode="aspectFit"></image>
			<u-row justify="between">
				<u-col span="6"><u-button size="medium" type="error" plain @click="exitLogin">暂不登录</u-button></u-col>
				<u-col span="6">
					<block v-if="showPhone"><u-button size="medium" type="success" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">手机授权</u-button></block>
					<block v-else><u-button size="medium" type="error" open-type="getUserInfo" @getuserinfo="getUserInfo" lang="zh_CN">立即登录</u-button></block>
				</u-col>
			</u-row>
		</view>
	</u-popup>
</template>

<script>
const app = getApp();
export default {
	name: 'login',
	props: {
		show: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			img: 'login',
			showPhone: false,
			uname: '',
			openid: '',
			sk: '',
			avatar: ''
		};
	},
	methods: {
		exitLogin() {
			this.showPhone = false;
			this.img = 'login';
			uni.$emit('login', { show: false, uid: '', phone: '', uname: '', openid: '' });
		},
		getUserInfo(e) {
			const that = this;
			that.base().then(function(data) {
				if (data.status == 'success') {
					uni.getUserInfo({
						provider: app.globalData.system,
						lang: 'zh_CN',
						complete: function(res) {							
							if (res.userInfo != undefined) {
								that.showPhone = true;
								that.img = 'auth';
								that.uname = data.uname ? data.uname : res.userInfo.nickName;
							} else {
								//回错误提示
								that.checkStatus(false, '似乎出现了点小问题...', '/pages/user/index/index', 404);
							}
						}
					});
				} else {
					//返回错误提示
					that.checkStatus(false, '似乎出现了点小问题...', '/pages/user/index/index', 404);
				}
			});
		},
		getPhoneNumber(e) {
			const that = this;
			let ed = e.detail.encryptedData;
			let iv = e.detail.iv;
			that.base().then(function(data) {
				if (data.status == 'success') {
					that.http(
						app.globalData.ext.url2 + 'auth/login?',
						{
							openid: data.openid,
							code: data.code,
							sk: data.sk,
							iv: iv,
							ed: ed,
							avatar: that.avatar,
							uname: that.uname
						},
						function(rs) {
							app.globalData.openid = rs.data.data.openid;
							app.globalData.uid = rs.data.data.uid;
							app.globalData.uname = rs.data.data.uname;
							app.globalData.phone = rs.data.data.phone;
							app.globalData.code = data.code;
							uni.setStorageSync('openid', data.openid);
							uni.setStorageSync('uid', rs.data.data.uid);
							uni.setStorageSync('uname', rs.data.data.uname);
							uni.setStorageSync('phone', rs.data.data.phone);
							uni.setStorageSync('code', data.code);
							uni.$emit('login', { show: false, uid: rs.data.data.uid, phone: rs.data.data.phone, uname: rs.data.data.uname, openid: rs.data.data.openid });
							that.showMsg('登录成功', 'success');
						},
						'/pages/user/index/index',
						false,
						'',
						1,
						2
					);
				} else {
					//回错误提示
					that.checkStatus(false, '似乎出现了点小问题...', '/pages/user/index/index', 404);
				}
			});
		}
	}
};
</script>
