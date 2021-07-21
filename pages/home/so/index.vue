<template>
	<view class="page pt-50">
		<movable-area :style="'height:' + (winH - 40) + 'px;'">
			<scroll-view class="flex-top soBt">
				<view class="so_search">
					<view class="so_search_icon"><u-icon name="search" color="#2979ff" size="35"></u-icon></view>
					<view class="so_search_input"><input confirm-type="search" placeholder="查找商标类别，例如：茶" @confirm="clsOK" /></view>
				</view>
			</scroll-view>
			<scroll-view scroll-y class="home_so_box" :style="'height:' + winH + 'px;'">
				<view class="home_so_top">
					<view class="home_so_text">
						为您找到
						<text style="color:red;font-weight: 600;">{{ num }}</text>
						条记录
					</view>
					<button @click="gotoPage('home')" style="border: 1px solid #FEAE4B;color: #FEAE4B;margin-right: 0;" size="mini" plain>返回首页</button>
				</view>
				<view v-for="(v, i) in list" :key="i">
					<view class="home_so_list">
						<view class="home_so_list_top">
							<view class="home_so_cls">{{ fl[i - 1].name }}</view>
							<view class="home_so_cls_name">{{ fl[i - 1].names }}</view>
						</view>
						<view class="home_so_item_box">
							<view
								class="home_so_list_item"
								:data-fid="vv.code"
								:data-sid="vv.fid"
								:data-id="vv.sid"
								:data-name="vv.name"
								@click="pushItem"
								v-for="(vv, ii) in v"
								:key="ii"
							>
								<view class="home_so_list_item_icon">
									<block v-if="cartList[vv.code].item[vv.fid][vv.sid ? vv.sid + ' ' + vv.name : vv.name].cname">
										<image src="/static/icon/gou.png" mode="aspectFit"></image>
									</block>
								</view>
								<view class="home_so_list_item_text">【{{ vv.fid }}】{{ vv.sid }} {{ vv.name }}</view>
							</view>
						</view>
					</view>
				</view>
				<movable-view :x="x" :y="y" direction="vertical">
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
			</scroll-view>
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
			num: 0,
			key: '',
			list: '',
			cartTotal: '',
			cartList: {},
			loading: true,
			show: false,
			uid: app.globalData.uid,
			phone: app.globalData.phone,
			fl: app.globalData.fl,
			winH: app.globalData.winH
		};
	},
	onLoad(e) {
		const that = this;
		if (e.key) {
			that.key = decodeURI(e.key);
			that.getcategory({ key: that.key });
		}
		this.cartTotal = app.globalData.cartTotal;
		this.cartList = app.globalData.cartList;
	},
	onShow() {
		const that = this;
		//关闭登录页,传入当前的变量
		that.closeLoginBox();
		//读取购物车已选数量
		that.getcartTotal();
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
	methods: {
		getcategory(param) {
			const that = this;
			that.http(
				app.globalData.ext.url + 'tm_cls_so?',
				param,
				function(res) {
					that.num = res.data.data.total;
					that.list = res.data.data.list;
				},
				'/pages/home/so/index'
			);
		}
	}
};
</script>
