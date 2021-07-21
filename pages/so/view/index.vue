<template>
	<view class="page">
		<view class="so_view_box">
			<view class="so_view_top">
				<view class="so_view_logo"><image :src="'https://imgcdn.zuigao.com/' + list.trademark.reg_no + '.jpg'" mode="aspectFit"></image></view>
				<view class="so_view_title">
					<u-tag :text="list.trademark.status" v-if="list.trademark.status == '暂无下证'" mode="dark" type="primary" />
					<u-tag :text="list.trademark.status" v-if="list.trademark.status == '注册公告中'" mode="dark" type="error" />
					<u-tag :text="list.trademark.status" v-if="list.trademark.status == '初审公告中'" mode="dark" type="warning" />
					<u-tag :text="list.trademark.status" v-if="list.trademark.status == '注册成功'" mode="dark" type="success" />
					<u-tag :text="list.trademark.status" v-if="list.trademark.status == '已过期'" mode="dark" type="info" />
				</view>
			</view>
			<view class="so_view_body">
				<view clss="so_view_item">
					<view class="so_view_item_title">商标名</view>
					<view class="so_view_item_content">{{ list.trademark.name }}</view>
				</view>
				<view clss="so_view_item">
					<view class="so_view_item_title">申请号</view>
					<view class="so_view_item_content">
						{{ list.trademark.reg_no }}
						<text class="color-hui1" v-if="list.trademark.reg_date">(申请日期: {{ list.trademark.reg_date }})</text>
					</view>
				</view>
				<view clss="so_view_item">
					<view class="so_view_item_title">
						商标选类 (第{{ list.trademark.cls < 10 ? '0' + list.trademark.cls : list.trademark.cls }}类 {{ fl[Number(cls) - 1].names }})
					</view>
					<block v-if="list.goods.length > 0">
						<view class="so_view_item_content" v-for="(v, i) in list.goods" :key="i">
							<text>{{ i + 1 }}.{{ v }}</text>
						</view>
					</block>
					<block v-else>-</block>
				</view>
				<view clss="so_view_item">
					<view class="so_view_item_title">申请人</view>
					<view class="so_view_item_content">
						{{ list.contact.name }}
						<text class="color-hui1">{{ list.contact.address }}</text>
					</view>
				</view>
				<view clss="so_view_item">
					<view class="so_view_item_title">初审公告期号</view>
					<view class="so_view_item_content">
						<block v-if="list.trademark.first_no">
							{{ list.trademark.first_no }}
							<text class="color-hui1" v-if="list.trademark.first_date">(初审公告日期:{{ list.trademark.reg_date }})</text>
						</block>
						<block v-else>-</block>
					</view>
				</view>
				<view clss="so_view_item">
					<view class="so_view_item_title">注册公告期号</view>
					<view class="so_view_item_content">
						<block v-if="list.trademark.last_no">
							{{ list.trademark.last_no }}
							<text class="color-hui1" v-if="list.trademark.reg_date">(初审公告日期:{{ list.trademark.reg_date }})</text>
						</block>
						<block v-else>-</block>
					</view>
				</view>
				<view clss="so_view_item">
					<view class="so_view_item_title">专用权期限</view>
					<view class="so_view_item_content">
						<block v-if="list.trademark.use_end == '0000-00-00'">-</block>
						<block v-else>{{ list.trademark.use_start }} ~ {{ list.trademark.use_end }}</block>
					</view>
				</view>
				<view clss="so_view_item">
					<view class="so_view_item_title">代理人</view>
					<view class="so_view_item_content">{{ list.agent.agent_name }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			id: '',
			cls: '',
			list: {},
			fl: ''
		};
	},
	onLoad(e) {
		const that = this;
		if (e.id != undefined && e.cls != undefined) {
			that.id = e.id;
			that.cls = e.cls;
			//获取商标45个大类
			that.http(app.globalData.ext.url + 'tm_big_cls?', {}, function(res) {
				that.fl = res.data.data;
			});
			that.getContent(that.id, that.cls);
		} else {
			uni.reLaunch({
				url: '/pages/so/index/index'
			});
		}
	},
	onShow() {
		//读取购物车已选数量
		this.getcartTotal();
	},
	onUnload() {},
	onShareAppMessage() {
		const that = this;
		setTimeout(function() {
			that.showMsg('操作成功', 'success');
		}, 1000);
		return {
			title: app.globalData.shareTitle,
			imageUrl: app.globalData.shareImg,
			path: '/pages/so/index/index?uid=' + app.globalData.uid
		};
	},
	methods: {
		getContent(id, cls) {
			const that = this;
			that.http(
				app.globalData.ext.url + 'tm_info?',
				{
					uid: app.globalData.uid,
					id: id,
					cls: cls
				},
				function(res) {
					that.list = res.data.data;
				},
				'/pages/so/list/index',
				true,
				'加载中...',
				1,
				2
			);
		}
	}
};
</script>
