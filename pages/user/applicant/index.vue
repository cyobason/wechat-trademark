<template>
	<view class="page pb-30">
		<scroll-view class="flex-top" style="height:45px;"><u-tabs :list="types" :current="index" @change="change"></u-tabs></scroll-view>
		<view :style="'margin-top:45px;'">
			<movable-area :style="'height:' + (winH - 45) + 'px;'">
				<view class="list_item" v-for="(v, i) in list" :key="i">
					<navigator hover-class="none" :url="'/pages/user/applicant/form?id=' + v.id + '&index=' + types.map(item => item.subject).indexOf(v.nameType)">
						<view class="list_item_top">
							<view class="list_item_ren">{{ v.linkName }}</view>
							<view class="list_item_phone">{{ v.linkPhone }}</view>
							<view class="list_item_type">{{ v.nameType }}</view>
						</view>
						<view class="list_item_content">
							<view class="list_item_content_text">{{ v.subject }}</view>
							<view class="list_item_content_text">{{ v.address }}</view>
							<view v-if="v.submitStatus == 0" class="list_item_content_text" style="justify-content: flex-end;">
								<view style="color:#c8c9cc;font-size:0.7rem;">待审核</view>
								<u-button size="mini" type="error" @click="del_sqr(v.id, i)">删除申请人</u-button>
							</view>
						</view>
					</navigator>
				</view>
				<view class="next" v-if="next"><button type="default" size="mini" :loading="showloading" @click="get_sqr(page)">加载更多</button></view>
				<movable-view :x="x" :y="y" direction="vertical" style="z-index: 1000;">
					<view class="float_box" v-if="uid">
						<navigator hover-class="none" :url="'/pages/user/applicant/form?id=0&index=' + index">
							<view class="float_btn"><image src="/static/icon/add.png" mode="aspectFit"></image></view>
						</navigator>
					</view>
				</movable-view>
				<u-empty text="亲,还没有相关申请人模板" src="/static/icon/od.png" font-size="30" margin-top="-200" icon-size="400"  v-if="nodata"></u-empty>
			</movable-area>
		</view>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			winH: app.globalData.winH,
			x: app.globalData.winW - 40,
			y: 300,
			showloading: false,
			next: false,
			nodata: false,
			page: 1,
			id: 0,
			uid: app.globalData.uid,
			list: [],
			types: [
				{
					name: '全部',
					subject: ''
				},
				{
					name: '大陆企业',
					subject: '中国大陆企业'
				},
				{
					name: '大陆个人',
					subject: '中国大陆个人'
				},
				{
					name: '港澳台企业',
					subject: '中国港澳台企业'
				},
				{
					name: '港澳台个人',
					subject: '中国港澳台个人'
				},
				{
					name: '国外企业',
					subject: '国外企业'
				},
				{
					name: '国外个人',
					subject: '国外个人'
				}
			],
			index: 0
		};
	},
	onLoad() {
		const that = this;
		//不显示分享按钮
		uni.hideShareMenu();
		if (app.globalData.uid) {
			that.get_sqr(1);
		} else {
			that.clearCache();
			that.gotoPage('user');
		}
	},
	onShow() {	
		this.uid = app.globalData.uid;
	},
	methods: {
		change(e) {
			this.index = e;
			this.page = 1;
			this.next = false;
			this.showloading = false;
			this.nodata = false;
			this.list = [];
			this.get_sqr(1);
		},
		get_sqr(page, id = 0) {
			const that = this;
			if (page > 1) that.showloading = true;
			that.http(
				app.globalData.ext.url2 + 'applicant/get_sqr?',
				{
					uid: app.globalData.uid,
					types: that.types[that.index].subject,
					page: page
				},
				function(res) {
					let rs = res.data.data;
					if (page == 1) {
						that.list = [];
						uni.pageScrollTo({
							scrollTop: 0
						});
						if (rs.list.length <= 0) {							
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
				'/pages/user/applicant/index'
			);
		},
		del_sqr(id, i) {
			const that = this;
			uni.showModal({
				title: '提示',
				content: '确认删除申请人信息？',
				success: function(res) {
					if (res.confirm) {
						that.http(
							app.globalData.ext.url2 + 'applicant/del_sqr?',
							{
								id: id,
								uid: app.globalData.uid
							},
							function(res) {
								that.list.splice(i, 1);
								that.list = that.list;
								that.showMsg(res.data.message, res.data.status);
							},
							'/pages/user/applicant/index',
							false,
							'',
							1,
							2
						);
					}
				}
			});
		}
	}
};
</script>