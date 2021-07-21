<template>
	<view class="page pt-50">
		<scroll-view class="flex-top soBt">
			<view class="so_search">
				<view class="so_search_icon"><u-icon name="search" color="#2979ff" size="35"></u-icon></view>
				<view class="so_search_input"><input confirm-type="search" placeholder="查找商标类别，例如：茶" @confirm="clsOK" /></view>
			</view>
		</scroll-view>
		<view class="kuang_box" :style="{ height: winH + 'px' }">
			<scroll-view scroll-y="true" class="kuang_left" :style="{ height: winH + 'px' }" :scroll-into-view="'item_' + index" :scroll-top="scrollTop">
				<view
					v-for="(v, i) in fl"
					:key="i"
					:class="['kuang_left_item', index == i ? 'active' : '']"
					:id="'item_' + i"
					:data-cls="v.value < 10 ? '0' + v.value : v.value"
					@click="changeItem"
					:data-id="i"
				>
					<view>{{ v.name }}</view>
					<view>{{ v.names }}</view>
				</view>
			</scroll-view>
			<scroll-view scroll-y="true" class="kuang_right" :style="{ height: winH + 'px' }">
				<view class="kuang_right_top mt-20 mr-20 ml-20 mb-20">
					<view class="kuang_right_top_title">{{ fl[index].text }}</view>
					<view class="kuang_right_top_content">{{ fl[index].des }}</view>
				</view>
				<block v-if="loading"></block>
				<block v-else>
					<view class="kuang_right_list mr-20 ml-20 mb-10">
						<block v-for="(v, i) in list" :key="i">
							<navigator :url="'/pages/home/list/index?fid=' + v.fid + '&cls=' + v.sid + '&index=' + i" hover-class="none">
								<view class="kuang_right_list_item">【{{ v.sid }}】{{ v.name }}</view>
							</navigator>
						</block>
					</view>
				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			cartTotal: '',
			cartList: {},
			loading: true,
			scrollTop: 0,
			cls: '01',
			index: 0,
			key: '',
			list: '',
			fl: app.globalData.fl,
			winH: app.globalData.winH - 50
		};
	},
	onLoad() {},
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
	onShow() {
		const that = this;
		//读取购物车已选数量
		that.getcartTotal();
		that.getfl({ cls: that.cls });
	},
	methods: {}
};
</script>
