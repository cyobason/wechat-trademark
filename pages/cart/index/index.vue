<template>
	<view class="page pb-30">
		<block v-if="cartTotal && uid">
			<movable-area :style="'height:' + (winH - 40) + 'px;'">
				<view class="list_item" v-for="(v, i) in cartList" :key="i">
					<view class="list_item_top">
						<view class="list_item_ren">{{ v.name }}</view>
						<view class="list_item_type" style="font-size: 0.7rem;">
							共
							<text style="color:#ff9900;padding:0 10rpx;">{{ v.total }}</text>
							项
						</view>
					</view>
					<view class="list_item_content">
						<view class="list_item_content_text">
							<view class="cart_body" v-for="(vv, ii) in v.item" :key="ii">
								<view class="cart_item_num">{{ ii }}</view>
								<block v-for="(vvv, iii) in vv" :key="iii">
									<view class="cart_item" :data-fid="vvv.fid" :data-sid="vvv.sid" :data-id="vvv.id" :data-name="vvv.name" @click="pushItem">{{ vvv.cname }}</view>
								</block>
							</view>
						</view>
						<view class="list_item_content_text" v-id="uid">
							<view class="list_item_content_text_view">
								<!--u-button size="mini" type="primary" @click="orderOne(i)">下单</u-button-->
								<u-button size="mini" type="success" @click="copyOne(i)">复制</u-button>
								<u-button size="mini" type="error" @click="delOne(i)">删除</u-button>
							</view>
						</view>
					</view>
				</view>
				<movable-view :x="x" :y="y" direction="vertical" v-if="uid" style="z-index: 1000;">
					<view class="float_box">
						<view class="float_btn" style="width:100rpx;height:100rpx;" @click="copyAll">
							<image src="/static/icon/copy.png" mode="aspectFit"></image>
							<view class="float_text">复制</view>
						</view>
						<view class="float_btn" style="width:100rpx;height:100rpx;" @click="delAll">
							<image src="/static/icon/del.png" mode="aspectFit"></image>
							<view class="float_text">删除</view>
						</view>
						<button open-type="share" class="float_btn" style="padding:0;width:100rpx;height:100rpx;">
							<u-icon name="zhuanfa" color="#fff" size="50" style="margin-top: 10rpx;margin-bottom: 0;"></u-icon>
							<view class="float_text" style="margin-top: -10rpx;">分享</view>
						</button>
					</view>
				</movable-view>
			</movable-area>
		</block>
		<u-empty v-if="!cartTotal" font-size="30" icon-size="400" src="/static/icon/cartnull.png" text="您还未挑选分类呢" margin-top="100">
			<u-button slot="bottom" size="medium" type="error" @click="gotoPage('home')">开始选类</u-button>
		</u-empty>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			uid: app.globalData.uid,
			code: '',
			showBtn: true,
			cartTotal: '',
			cartList: {},
			winH: app.globalData.winH,
			x: app.globalData.winW - 40,
			y: 300
		};
	},
	onLoad() {
	},
	onShow() {
		const that = this;
		that.uid = app.globalData.uid;
		//读取购物车已选数量
		that.getcartTotal();
		that.cartList = app.globalData.cartList;
		that.cartTotal = app.globalData.cartTotal;
	},
	onShareAppMessage(e) {
		const that = this;
		that.code = app.globalData.cmd.SHA1(new Date().valueOf() + '.' + app.globalData.uid).toString();
		that.showBtn = false;
		that.http(
			app.globalData.ext.url2 + 'auth/set_share?',
			{ code: that.code, uid: app.globalData.uid, total: app.globalData.cartTotal, content: JSON.stringify(app.globalData.cartList) },
			function(res) {
				setTimeout(function() {
					that.showBtn = true;
					that.showMsg(res.data.message, res.data.status);
				}, 1000);
			},
			'/pages/cart/index/index',
			false
		);
		return {
			title: app.globalData.shareTitle,
			path: '/pages/share/index/index?token=' + that.code + '&uid=' + app.globalData.uid
		};
	},
	methods: {
		/**
		 * 单个类下单
		 */
		orderOne(fid) {
			uni.navigateTo({
				url: '/pages/order/form/index?fid=' + fid
			});
		},
		/**
		 * 复制单个分类
		 */
		copyOne(fid) {
			const that = this;
			let rs = '';
			let xl = [];
			for (var i in app.globalData.cartList[fid].item) {
				for (var ii in app.globalData.cartList[fid].item[i]) {
					xl.push(fid + '`' + i + '`' + app.globalData.cartList[fid].item[i][ii].id + '`' + app.globalData.cartList[fid].item[i][ii].name + ';');
				}
			}
			rs = xl.join('\n');
			uni.setClipboardData({
				data: rs
			});
		},
		/**
		 * 复制全部分类
		 */
		copyAll(e) {
			const that = this;
			let rs = '';
			let xl = [];
			for (var i in app.globalData.cartList) {
				for (var ii in app.globalData.cartList[i].item) {
					for (var iii in app.globalData.cartList[i].item[ii]) {
						xl.push(i + '`' + ii + '`' + app.globalData.cartList[i].item[ii][iii].id + '`' + app.globalData.cartList[i].item[ii][iii].name + ';');
					}
				}
			}
			rs = xl.join('\n');
			uni.setClipboardData({
				data: rs
			});
		},
		/**
		 * 删除一个大类
		 */
		delOne(fid) {
			const that = this;
			if (typeof app.globalData.cartList[fid].total == undefined) {
				app.globalData.cartList[fid].total = 0;
			}
			let total = app.globalData.cartTotal - app.globalData.cartList[fid].total;
			app.globalData.cartTotal = Number(total) > 0 ? total : '';
			delete app.globalData.cartList[fid];
			that.cartTotal = app.globalData.cartTotal;
			that.cartList = Object.keys(app.globalData.cartList).length ? app.globalData.cartList : {};
			uni.setStorageSync('cartTotal', app.globalData.cartTotal);
			uni.setStorageSync('cartList', Object.keys(app.globalData.cartList).length ? app.globalData.cartList : {});
			//读取购物车已选数量
			that.getcartTotal();
		},
		/**
		 * 清空购物车
		 */
		delAll() {
			const that = this;
			uni.showModal({
				title: '提示',
				content: '是否一键清空？',
				success: function(res) {
					if (res.confirm) {
						that.cartList = {};
						that.cartTotal = '';
						app.globalData.cartTotal = '';
						app.globalData.cartList = {};
						uni.setStorageSync('cartList', {});
						uni.setStorageSync('cartTotal', '');
						//读取购物车已选数量
						that.getcartTotal();
					}
				}
			});
		}
	}
};
</script>
