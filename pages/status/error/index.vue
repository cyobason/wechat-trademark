<template>
	<view class="page">
		<u-empty font-size="30" icon-size="400" :src="'/static/icon/' + icon + '.png'" :text="msg" margin-top="100">
			<u-button slot="bottom" size="medium" type="default" :loading="loading" plain @click="checkNet">请重试</u-button>
		</u-empty>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			status: true,
			msg: '网络连接失败',
			icon: '404',
			url: '/pages/home/index/index',
			loading: false
		};
	},
	onLoad(e) {
		//不显示分享按钮
		uni.hideShareMenu();
		const that = this;
		if (e.status) {
			that.status = e.status == 'false' ? false : true;
		}
		if (e.msg) {
			that.msg = e.msg;
		}
		if (e.icon) {
			that.icon = e.icon;
		}
		if (e.url) {
			that.url = e.url;
		}
	},
	onShow() {
		//读取购物车已选数量
		this.getcartTotal();
	},
	methods: {
		checkNet() {
			const that = this;
			that.loading = true;
			if (that.status) {
				uni.getNetworkType({
					success(res) {
						if (res.networkType == 'none' || res.networkType == 'unknown') {
							that.loading = false;
						} else {
							uni.reLaunch({
								url: '/pages/home/index/index'
							});
						}
					}
				});
			} else {
				uni.reLaunch({
					url: that.url
				});
			}
		}
	}
};
</script>
