<template>
	<view class="page">
		<view class="user_top">
			<view class="user_top_box">
				<block v-if="uid">
					<view class="user_top_pic"><open-data type="userAvatarUrl"></open-data></view>
					<view class="user_top_right" @click="gotoPage('/pages/user/system/index')">
						<view class="user_top_name">{{ uname }}</view>
						<view class="user_top_phone">{{ phone }}</view>
					</view>
				</block>
				<block v-else>
					<view class="user_top_pic"><u-icon name="account-fill" color="#969799" size="60"></u-icon></view>
					<view class="user_top_right" @click="showLoginBox">
						<view class="user_top_name">未登录</view>
						<view class="user_top_phone">点击登录/注册</view>
					</view>
				</block>
			</view>
		</view>
		<view class="user_menu_box">
			<view class="user_nav">
				<view class="user_nav_item" @click="gotoPage('order')">
					<view class="user_nav_number">
						{{ trademark }}
						<text class="user_nav_small">个</text>
					</view>
					<view class="user_nav_title">商标</view>
				</view>
				<view class="user_nav_item">
					<view class="user_nav_number">
						{{ domain }}
						<text class="user_nav_small">个</text>
					</view>
					<view class="user_nav_title">域名</view>
				</view>
				<!-- <view class="user_nav_item">
						<view class="user_nav_number">{{ coupon }}<text class="user_nav_small">张</text></view>
						<view class="user_nav_title">优惠券</view>
					</view> -->
				<view class="user_nav_item">
					<view class="user_nav_number">
						{{ price }}
						<text class="user_nav_small">元</text>
					</view>
					<view class="user_nav_title">余额</view>
				</view>
			</view>
			<view class="user_menu">
				<u-grid :col="3" :border="false" @click="goTo">
					<block v-if="uid">
						<u-grid-item index="sqr">
							<view class="user_menu_pic"><image src="../../../static/icon/ren.png" mode="aspectFit"></image></view>
							<view class="user_menu_title">申请人</view>
						</u-grid-item>
						<u-grid-item index="fw">
							<view class="user_menu_pic"><image src="../../../static/icon/fawen.png" mode="aspectFit"></image></view>
							<view class="user_menu_title">我的发文</view>
						</u-grid-item>
						<u-grid-item index="wts">
							<view class="user_menu_pic"><image src="../../../static/icon/weituoshu.png" mode="aspectFit"></image></view>
							<view class="user_menu_title">生成委托书</view>
						</u-grid-item>
						<u-grid-item index="ty">
							<view class="user_menu_pic"><image src="../../../static/icon/tuyang.png" mode="aspectFit"></image></view>
							<view class="user_menu_title">生成图样</view>
						</u-grid-item>
					</block>
					<u-grid-item index="sz">
						<view class="user_menu_pic"><image src="../../../static/icon/system.png" mode="aspectFit"></image></view>
						<view class="user_menu_title">系统设置</view>
					</u-grid-item>
				</u-grid>
			</view>
		</view>
		<view class="user_btn_exit"><u-button v-if="uid" size="default" type="error" @click="checkOut">退出登录</u-button></view>
		<ff-show-login :show="show"></ff-show-login>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			coupon: '-',
			domain: '-',
			price: '-',
			trademark: '-',
			show: false,
			version: app.globalData.ext.version,
			phone: app.globalData.phone,
			uname: app.globalData.uname,
			uid: app.globalData.uid,
			cartTotal: app.globalData.cartTotal
		};
	},
	onLoad() {

	},
	onShow() {
		const that = this;
		//关闭登录页,传入当前的变量
		that.closeLoginBox();
		that.uid = app.globalData.uid;
		that.uname = app.globalData.uname;
		//读取购物车已选数量
		that.getcartTotal();
		that.getInfo();
		that.phone = that.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
	},
	onShareAppMessage() {
		const that = this;
		setTimeout(function() {
			that.showMsg('操作成功', 'success');
		}, 1000);
		return {
			title: app.globalData.shareTitle,
			imageUrl: app.globalData.shareImg,
			path: '/pages/home/index/index?uid=' + app.globalData.uid
		};
	},
	onUnload() {
		uni.$off('login');
	},
	methods: {
		checkOut() {
			const that = this;
			that.coupon = '-';
			that.domain = '-';
			that.price = '-';
			that.trademark = '-';
			that.show = false;
			that.clearCache();
		},
		goTo(e) {
			switch (e) {
				case 'sqr':
					uni.navigateTo({
						url: '/pages/user/applicant/index'
					});
					break;
				case 'fw':
					uni.navigateTo({
						url: '/pages/user/document/index'
					});
					break;
				case 'wts':
					uni.navigateTo({
						url: '/pages/user/tools/weituoshu'
					});
					break;
				case 'wd':
					uni.navigateTo({
						url: '/pages/user/tools/file'
					});
					break;
				case 'ty':
					uni.navigateTo({
						url: '/pages/user/tools/tuyang'
					});
					break;
				case 'sz':
					uni.navigateTo({
						url: '/pages/user/system/index'
					});
					break;
			}
		}
	}
};
</script>
