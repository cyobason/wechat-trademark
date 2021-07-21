<template>
	<view class="page">
		<view class="so_title">商标查询</view>
		<view class="so_kuang">
			<picker @change="changeCls" :value="cls" :range="fl" range-key="text">
				<view class="so_picker">{{ fl[cls]['name'] }}</view>
			</picker>
			<input class="so_input" @input="changeKey" :value="key" @confirm="sendSo(1)" confirm-type="search" placeholder="请输入商标名称、注册号" />
		</view>
		<view class="so_radio">
			<radio-group @change="changeMode">
				<view class="" v-for="(v, i) in somode" :key="v.value">
					<radio :value="i" :checked="i === mode" color="#F15532" />
					{{ v.text }}
				</view>
			</radio-group>
		</view>
		<view style="width: 90%;margin: 30rpx auto 0 auto;">
			<u-button size="default" type="success" @click="sendSo">开始查询</u-button>
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
			showloading: false,
			next: false,
			nodata: false,
			page: 1,
			action: 'tm_name_exact',
			fl: app.globalData.fl,
			show: false,
			phone: app.globalData.phone,
			uid: app.globalData.uid,
			somode: app.globalData.somode,
			cartTotal: app.globalData.cartTotal
		};
	},
	onLoad() {
		
	},
	onShow() {
		const that = this;
		//关闭登录页,传入当前的变量
		this.closeLoginBox();
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
	onHide() {
		const that = this;
		that.key = '';		
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
		},
		/**
		 * 商标查询变更分类
		 */
		changeCls(e) {
			this.cls = e.detail.value;
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
		},
		/**
		 * 商标查询
		 */
		sendSo() {
			const that = this;
			if (app.globalData.phone == '') {
				that.showLoginBox();
				return false;
			}
			if (that.key == '' || that.key.length < 2) {
				that.showMsg('关键词不能小于2个字符');
			} else {
				that.http(
					app.globalData.ext.url + that.action + '?',
					{
						uid: app.globalData.uid,
						key: that.key,
						cls: that.cls,
						page: that.page
					},
					function(res) {
						uni.hideLoading();
						if (res.data.status == 'success') {
							if (res.data.data.list.length > 0) {
								app.globalData.so = res.data.data;
								uni.navigateTo({
									url: '/pages/so/list/index?key=' + that.key + '&cls=' + that.cls + '&mode=' + that.mode + '&action=' + that.action
								});
							} else {
								that.list = {};
								that.showMsg(res.data.message);
							}
						} else {
							that.list = {};
							that.showMsg(res.data.message);
						}
					},
					'/pages/so/index/index',
					true,
					'正在加载...',
					2
				);
			}
		}
	}
};
</script>
