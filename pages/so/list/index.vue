<template>
	<view class="page">
		<scroll-view class="flex-top">
			<view class="so_search">
				<view class="so_search_icon"><u-icon name="search" color="#2979ff" size="35"></u-icon></view>
				<view class="so_search_input"><input confirm-type="search" :value="key" placeholder="请输入商标名称、注册号" @input="changeKey" @confirm="sendSo(1)" /></view>
			</view>
		</scroll-view>
		<scroll-view class="flex-top soBt" style="top:50px;height: 28px;">
			<view class="so_select">
				<picker class="so_select_item" @change="changeCls" :value="cls" :range="fl" range-key="text">
					<view class="so_select_item">{{ fl[cls]['name'] }}</view>
				</picker>
				<picker class="so_select_item" @change="changeMode" :value="mode" :range="somode" range-key="text">
					<view class="so_select_item">{{ somode[mode]['text'] }}</view>
				</picker>
			</view>
		</scroll-view>
		<view :style="'height:' + winH + 'px;margin-top:78px;'">
			<view class="list" v-for="(v, i) in list" :key="i" :data-cls="v.cls" :data-id="v.reg_no_id" @click="gotoView">
				<view class="listImg" :data-no="v.reg_no" :data-cls="v.cls">
					<image :src="'https://imgcdn.zuigao.com/' + v.reg_no + '.jpg'" lazy-load="true" mode="aspectFit"></image>
				</view>
				<view class="listBox" :data-no="v.reg_no" :data-cls="v.cls">
					<view class="listTop">
						<view class="listTitle cut">
							<text selectable>{{ v.name }}</text>
						</view>
						<view class="listFl"><u-tag :text="(v.cls < 10 ? '0' + v.cls : v.cls) + '类'" mode="light" type="error" /></view>
					</view>
					<view class="listDz">
						<view class="listIcon"><image src="/static/icon/x.png" mode="aspectFit"></image></view>
						<view class="cut">
							<text selectable>{{ v.c_name }}</text>
						</view>
					</view>
					<view class="listDown">
						<view class="listRegNum">
							<view class="listIcon"><image src="/static/icon/no.png" mode="aspectFit"></image></view>
							<view>
								<text selectable>{{ v.reg_no }}</text>
							</view>
						</view>
						<view class="listType">
							<u-tag :text="v.status" v-if="v.status == '暂无下证'" mode="dark" type="primary" />
							<u-tag :text="v.status" v-if="v.status == '注册公告中'" mode="dark" type="error" />
							<u-tag :text="v.status" v-if="v.status == '初审公告中'" mode="dark" type="warning" />
							<u-tag :text="v.status" v-if="v.status == '注册成功'" mode="dark" type="success" />
							<u-tag :text="v.status" v-if="v.status == '已过期'" mode="dark" type="info" />
						</view>
					</view>
				</view>
			</view>
			<view class="next" v-if="next"><button type="default" size="mini" :loading="showloading" @click="sendSo(page)">加载更多</button></view>
			<u-empty text="亲,没有检索到相关商标数据" mode="search" v-if="nodata"></u-empty>
		</view>
		<ff-show-login :show="show"></ff-show-login>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			key: '',
			cls: 0,
			mode: 0,
			list: [],
			show: false,
			showloading: false,
			next: false,
			nodata: false,
			page: 1,
			phone: app.globalData.phone,
			uid: app.globalData.uid,
			action: 'tm_name_exact',
			fl: app.globalData.fl,
			somode: app.globalData.somode,
			cartTotal: app.globalData.cartTotal,
			winH: app.globalData.winH - 78
		};
	},
	onLoad(e) {
		const that = this;
		if (e.key) {
			that.key = decodeURI(e.key);
			that.cls = Number(e.cls);
			that.mode = Number(e.mode);
			that.action = e.action;
			that.page = 2;
			that.next = app.globalData.so.count == 1 ? true : false;
			that.list = app.globalData.so.list;
		} else {
			uni.redirectTo({
				url: '/pages/so/index/index'
			});
		}		
	},
	onShow() {
		const that = this;
		//关闭登录页,传入当前的变量
		that.closeLoginBox();
		//读取购物车已选数量
		that.getcartTotal();
		if (that.fl.length == 45) {
			//插入全类选项
			that.fl.unshift({
				value: 0,
				name: '全部分类',
				names: '全部分类',
				text: '全部分类',
				des: '全部分类'
			});
		}
	},
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
	onUnload() {
		uni.$off('login');
		if (this.fl.length > 45) {
			//删除插入的全类选项
			this.fl.shift();
		}
	},
	methods: {
		/**
		 * 商标查询变更关键词
		 */
		changeKey(e) {
			this.key = e.detail.value;
			this.page = 1;
			this.next = false;
			this.showloading = false;
			this.nodata = false;			
		},
		/**
		 * 商标查询变更分类
		 */
		changeCls(e) {
			this.cls = e.detail.value;
			this.page = 1;
			this.next = false;
			this.showloading = false;
			this.nodata = false;
			this.list = [];
			this.sendSo(1);
		},
		/**
		 * 商标查询变更查询模式
		 */
		changeMode(e) {
			const that = this;
			switch (e.detail.value) {
				case '0':
					//精确
					that.action = 'tm_name_exact';
					break;
				case '1':
					//近似
					that.action = 'tm_name_like';
					break;
				case '2':
					//申请号
					that.action = 'tm_reg_no';
					break;
				case '3':
					//拼音查询
					that.action = 'tm_pinyin';
					break;
				case '4':
					//申请人
					that.action = 'tm_reg_man';
					break;
			}
			that.mode = Number(e.detail.value);
			that.sendSo(1);
		},
		/**
		 * 商标查询
		 */
		sendSo(page) {
			const that = this;
			if (app.globalData.phone == '') {
				that.showLoginBox();
				return false;
			}
			if (that.key == '' || that.key.length < 2) {
				that.showMsg('关键词不能小于2个字符');
			} else {
				if (page > 1) that.showloading = true;
				that.http(
					app.globalData.ext.url + that.action + '?',
					{
						uid: app.globalData.uid,
						key: that.key,
						cls: that.cls,
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
						that.next = rs.count == 1 ? true : false;
						that.page = rs.count == 1 ? ++page : 1;
					},
					'/pages/so/index/index'
				);
			}
		},
		/**
		 * 跳转至内容页
		 */
		gotoView(e) {
			uni.navigateTo({
				url: '/pages/so/view/index?id=' + e.currentTarget.dataset.id + '&cls=' + e.currentTarget.dataset.cls
			});
		}
	}
};
</script>
