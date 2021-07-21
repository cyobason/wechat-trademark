<template>
	<view class="page pb-30">
		<block v-if="cartTotal">
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
									<view class="cart_item">{{ vvv.cname }}</view>
								</block>
							</view>
						</view>
					</view>
				</view>
				<movable-view :x="x" :y="y" direction="vertical" style="z-index: 1000;">
					<view class="float_box">
						<view class="float_btn" style="width:100rpx;height:100rpx;" @click="copyAll">
							<image src="/static/icon/copy.png" mode="aspectFit"></image>
							<view class="float_text">复制</view>
						</view>
						<view class="float_btn" style="width:100rpx;height:100rpx;" @click="gotoPage('home')">
							<image src="/static/icon/home.png" mode="aspectFit"></image>
							<view class="float_text">选类</view>
						</view>
						<button open-type="share" class="float_btn" style="padding:0;width:100rpx;height:100rpx;">
							<u-icon name="zhuanfa" color="#fff" size="50" style="margin-top: 10rpx;margin-bottom: 0;"></u-icon>
							<view class="float_text" style="margin-top: -10rpx;">分享</view>
						</button>
					</view>
				</movable-view>
			</movable-area>
		</block>
		<u-empty v-if="!cartTotal" font-size="30" icon-size="400" src="/static/icon/null.png" text="分享的数据已过期" mode="list" margin-top="100"></u-empty>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			uid: '',
			code: '',
			showBtn: true,
			showloading: false,
			cartTotal: '',
			cartList: {},
			winH: app.globalData.winH,
			x: app.globalData.winW - 40,
			y: 300
		};
	},
	onLoad(e) {
		const that = this;
		that.code = e.token;
		that.uid = e.uid;
		if (typeof e.token == undefined) {
			that.showloading = true;
		}
	},
	onShow() {
		this.getShare(this.code);
	},
	onShareAppMessage(e) {
		const that = this;
		that.showBtn = false;
		setTimeout(function() {
			that.showBtn = true;
			that.showMsg('操作成功', 'success');
		}, 300);
		return {
			title: app.globalData.shareTitle,
			path: '/pages/share/index/index?token=' + that.code + '&uid=' + that.uid
		};
	},
	methods: {
		/**
		 * 复制全部分类
		 */
		copyAll(e) {
			const that = this;
			let rs = '';
			let xl = [];
			for (var i in that.cartList) {
				for (var ii in that.cartList[i].item) {
					for (var iii in that.cartList[i].item[ii]) {
						xl.push(i + '`' + ii + '`' + that.cartList[i].item[ii][iii].id + '`' + that.cartList[i].item[ii][iii].name + ';');
					}
				}
			}
			rs = xl.join('\n');
			uni.setClipboardData({
				data: rs
			});
		},
		getShare(token) {
			const that = this;
			if (token) {
				that.http(
					app.globalData.ext.url2 + 'auth/get_share?',
					{ code: token, uid: that.uid },
					function(res) {
						that.showloading = false;
						that.code = token;
						that.cartList = JSON.parse(res.data.data.content);
						that.cartTotal = res.data.data.total;
						app.globalData.cartList = that.cartList;
						app.globalData.cartTotal = that.cartTotal;
					},
					'/pages/share/index/index',
					false,
					'',
					2
				);
			} else {
				that.checkStatus(false, 'Token过期或者不存在', '/pages/home/index/index', 404);
			}
		}
	}
};
</script>
