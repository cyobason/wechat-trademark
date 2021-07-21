<template>
	<view class="page pb-30">
		<block v-if="uid">
			<scroll-view class="flex-top" style="height:40px;"><u-tabs :list="top" :current="index" @change="change" :is-scroll="false"></u-tabs></scroll-view>
			<view style="margin-top: 40px;">
				<view class="list_item" v-for="(v, i) in list" :key="i">
					<navigator hover-class="none" :url="'/pages/order/form/index?id=' + v.id">
						<view class="list_item_top">
							<view class="list_item_ren">第{{ v.cate }}类</view>
							<view class="list_item_type">{{ v.uptime }}</view>
						</view>
						<view class="list_item_content">
							<view class="list_item_content_text">商标名称：{{ v.subject }}</view>
							<view class="list_item_content_text">商标状态：{{ v.statusType ? v.statusType : '-' }}</view>
							<view class="list_item_content_text">
								<u-row justify="between">
									<u-col span="6">
										<view v-if="v.price_id == 0"><u-tag text="待付款" type="error" /></view>
										<view v-if="v.price_id > 0"><u-tag text="已付款" type="success" /></view>
									</u-col>
									<u-col span="6">
										<view class="u-text-right" style="color: #303133;font-weight: 600;padding-top: 8rpx;">合计：{{ v.price_price }}元</view>
									</u-col>
								</u-row>
							</view>
						</view>
					</navigator>
				</view>
			</view>
			<u-empty v-if="nodata" font-size="30" icon-size="400" src="/static/icon/od.png" text="您还没有订单哦" margin-top="100"></u-empty>
			<view class="next" v-if="next"><button type="default" size="mini" :loading="showloading" @click="get_od(page)">加载更多</button></view>
		</block>
		<u-empty v-if="!uid" font-size="30" icon-size="400" src="/static/icon/us.png" text="您还未登录,请先登录" margin-top="100">
			<u-button slot="bottom" size="medium" type="error" @click="showLoginBox">立即登录</u-button>
		</u-empty>
		<ff-show-login :show="show"></ff-show-login>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			list: [],
			show: false,
			showloading: false,
			next: false,
			nodata: false,
			page: 1,
			id: 0,
			uid: app.globalData.uid,
			cartTotal: app.globalData.cartTotal,
			index: 0,
			top: [
				{
					name: '全部'
				},
				{
					name: '待付款'
				},
				{
					name: '已付款'
				}
			]
		};
	},
	onLoad() {
		const that = this;
		//不显示分享按钮
		uni.hideShareMenu();		
	},
	onShow() {
		const that = this;
		//关闭登录页,传入当前的变量
		that.closeLoginBox();
		//读取购物车已选数量
		that.getcartTotal();
		that.uid = app.globalData.uid;
		that.get_od(that.page);
	},
	onShareAppMessage(e) {},
	onUnload() {
		uni.$off('login');
	},
	methods: {
		change(e) {
			this.page = 1;
			this.next = false;
			this.showloading = false;
			this.nodata = false;
			this.index = e;
			this.list = [];
			this.get_od(1);
		},
		get_od(page) {
			const that = this;
			if (app.globalData.uid) {
				if (page > 1) that.showloading = true;
				that.http(
					app.globalData.ext.url2 + 'order/get_od?',
					{
						uid: app.globalData.uid,
						type: that.index,
						page: page
					},
					function(res) {
						let rs = res.data.data;
						if (page == 1) {
							uni.pageScrollTo({
								scrollTop: 0
							});
							if (rs.list.length <= 0) {
								that.list = [];
								that.nodata = true;
							} else {
								that.list = rs.list;
							}
						} else {
							if (rs.list.length > 0) {
								that.list = that.list.concat(rs.list);
							}
						}
						that.showloading = false;
						that.next = rs.next == 1 ? true : false;
						that.page = rs.next == 1 ? ++page : 1;
					},
					'/pages/order/index/index'
				);
			}
		}
	}
};
</script>
