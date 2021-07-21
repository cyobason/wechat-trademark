<template>
	<view class="page">
		<u-cell-group>
			<u-cell-item v-if="phone" title="切换手机" :value="phone" :arrow="true" @click="switchPhone"></u-cell-item>
			<u-cell-item title="当前版本" :value="version" :arrow="false"></u-cell-item>
		</u-cell-group>
		<ff-show-login :show="show"></ff-show-login>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			show:false,
			phone: app.globalData.phone,
			uid: app.globalData.uid,
			version: app.globalData.ext.version
		};
	},
	onLoad() {
		//不显示分享按钮
		uni.hideShareMenu();	
	},
	onShow() {
		const that = this;
		//关闭登录页,传入当前的变量
		this.closeLoginBox();
		that.phone = that.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
	},
	onUnload() {
	
	},
	methods: {
		switchPhone() {
			const that = this;
			if (app.globalData.uid && app.globalData.phone) {
				uni.showModal({
					title: '提示',
					content: '是否切换手机号?',
					success: function(res) {
						if (res.confirm) {
							that.http(
								app.globalData.ext.url2 + 'auth/switch_phone?',
								{
									uid: app.globalData.uid
								},
								function(res) {	
									that.show = true;
									that.clearCache();
								},
								'/pages/user/system/index'
							);
						}
					}
				});
			}
		}
	}
};
</script>
