<template>
	<view class="page pt-50">
		<movable-area :style="'height:' + (winH - 40) + 'px;'">
			<scroll-view class="flex-top soBt">
				<view class="so_search">
					<view class="so_search_icon"><u-icon name="search" color="#2979ff" size="35"></u-icon></view>
					<view class="so_search_input"><input confirm-type="search" placeholder="查找商标类别，例如：茶" @confirm="clsOK" /></view>
				</view>
			</scroll-view>
			<view class="kuang_box" :style="{ height: winH + 'px' }">
				<scroll-view scroll-y="true" class="kuang_left" :style="{ height: winH + 'px' }" :scroll-into-view="'item_' + item" :scroll-top="scrollTop">
					<view
						v-for="(v, i) in left"
						:key="i"
						:class="['kuang_left_item', index == i ? 'active' : '']"
						:id="'item_' + i"
						:data-cls="v.sid"
						@click="changeItem"
						:data-id="i"
					>
						<view>{{ v.sid }}</view>
					</view>
				</scroll-view>
				<scroll-view scroll-y="true" class="kuang_right" :style="{ height: winH + 'px;' }">
					<block v-if="loading"><view class="mt-20"></view></block>
					<block v-else>
						<view class="kuang_right_top mt-20 mr-20 ml-20 mb-20">
							<view class="kuang_right_top_content">【{{ cls }}】{{ left[index].name }}</view>
						</view>
						<view class="kuang_right_list mr-20 ml-20 mb-10">
							<block v-for="(v, i) in list" :key="i">
								<view class="kuang_right_list_item" :data-fid="fid" :data-sid="v.fid" :data-id="v.sid" :data-name="v.name" @click="pushItem">
									<view class="kuang_right_list_item_icon">
										<block v-if="cartList[fid].item[v.fid][v.sid ? v.sid + ' ' + v.name : v.name].cname">
											<image src="/static/icon/gou.png" mode="aspectFit"></image>
										</block>
									</view>
									<view class="kuang_right_list_item_text">{{ v.sid ? '【' + v.sid + '】' : '' }}{{ v.name }}</view>
								</view>
							</block>
						</view>
					</block>
				</scroll-view>
				<movable-view :x="x" :y="y" direction="vertical" style="z-index: 1000;">
					<view class="float_box" v-if="cartTotal">
						<navigator url="/pages/cart/index/index" open-type="switchTab">
							<view class="float_btn" style="width:100rpx;height:100rpx;">
								<view class="float_dot" v-if="cartTotal">{{ cartTotal }}</view>
								<image src="/static/icon/cart.png" mode="aspectFit"></image>
								<view class="float_text">已选</view>
							</view>
						</navigator>
					</view>
				</movable-view>
			</view>
			<ff-show-login :show="show"></ff-show-login>
		</movable-area>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			x: app.globalData.winW - 40,
			y: 300,
			cartTotal: '',
			cartList: {},
			loading: true,
			scrollTop: 0,
			fid: '',
			cls: '',
			key: '',
			left: '',
			list: '',
			index: '',
			show: false,
			uid: app.globalData.uid,
			phone: app.globalData.phone,
			winH: app.globalData.winH
		};
	},
	onLoad(e) {
		const that = this;
		if (e.fid != '' || e.cls != '') {
			that.fid = e.fid;
			that.cls = e.cls;
			that.index = e.index;
		} else {
			that.gotoPage('home');
		}		
	},
	onShow() {
		const that = this;
		//关闭登录页,传入当前的变量
		that.closeLoginBox();
		//读取购物车已选数量
		that.getcartTotal();		
		//左边
		that.getfl({cls: that.fid},that.fid);		
		//右边
		that.getfl({cls: that.cls});
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
	methods: {}
};
</script>
