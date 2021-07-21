<template>
	<view class="page pt-50 pb-30">
		<scroll-view class="flex-top soBt">
			<view class="so_search">
				<view class="so_search_icon"><u-icon name="search" color="#2979ff" size="35"></u-icon></view>
				<view class="so_search_input"><input confirm-type="search" placeholder="请输入商标名称或申请号" @confirm="so_fw" /></view>
			</view>
		</scroll-view>
		<view class="list_item" v-for="(v, i) in list" :key="i">
			<view class="list_item_top">
				<view class="list_item_ren">{{ v.subject }}</view>
				<view class="list_item_type">{{ v.dateline }}</view>
			</view>
			<view class="list_item_content">
				<view class="list_item_content_text">
					【第{{ v.cate }}类】
					<text selectable>{{ v.tmName }}</text>
				</view>
				<view class="list_item_content_text">
					申请号:
					<text selectable>{{ v.regNo }}</text>
				</view>
				<view class="list_item_content_text">{{ v.applicantName }}</view>
				<view class="list_item_content_text" style="justify-content: flex-end;"><u-button size="mini" type="success" @click="show_fw(v.filename)">查看发文</u-button></view>
			</view>
		</view>
		<view class="next" v-if="next"><button type="default" size="mini" :loading="showloading" @click="get_fw(page)">加载更多</button></view>
		<u-empty text="亲,还没有相关发文" src="/static/icon/od.png" font-size="30" margin-top="100" icon-size="400" v-if="nodata"></u-empty>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			winH: app.globalData.winH,
			uid: app.globalData.uid,
			id: 0,
			showloading: false,
			next: false,
			nodata: false,
			page: 1,
			list: [],
			key: ''
		};
	},
	onLoad() {
		const that = this;
		//不显示分享按钮
		uni.hideShareMenu();
		if (app.globalData.uid) {
			that.get_fw(1);
		} else {
			that.clearCache();
			that.gotoPage('user');
		}
	},
	onShow() {
		this.uid = app.globalData.uid;
	},
	methods: {
		get_fw(page) {
			const that = this;
			if (page > 1) that.showloading = true;
			that.http(
				app.globalData.ext.url2 + 'document/get_fw?',
				{
					uid: app.globalData.uid,					
					id: that.id,
					key: that.key,
					page: page
				},
				function(res) {
					let rs = res.data.data;
					if (page == 1) {
						that.list = [];
						uni.pageScrollTo({
							scrollTop: 0
						});						
						if (rs.length <= 0) {
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
				'/pages/user/document/index'
			);
		},
		so_fw(e) {
			const that = this;
			that.key = e.detail.value;
			that.get_fw(1);
		},
		show_fw(pdf) {
			const that = this;
			uni.downloadFile({
				url: app.globalData.ext.domain + pdf,
				success: function(res) {
					let filePath = res.tempFilePath;
					uni.openDocument({
						filePath: filePath,
						showMenu: true
					});
				},
				fail: function(res) {
					that.showMsg('下载发文失败');
				}
			});
		}
	}
};
</script>
