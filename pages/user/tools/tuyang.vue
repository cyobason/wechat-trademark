<template>
	<view class="page" style="padding: 30rpx;">
		<view class="tools_pic"><image :src="pic" mode="aspectFit"></image></view>
		<u-form :model="form" ref="uForm">
			<u-form-item label="商标名称:" label-width="auto" required prop="name"><u-input v-model="form.name" placeholder="请输入商标名称" /></u-form-item>
			<u-form-item label="商标字体:" label-width="auto" required prop="font">
				<u-input type="select" :select-open="fontShow" v-model="form.font" placeholder="请选择商标字体" @click="fontShow = true"></u-input>
			</u-form-item>
			<u-form-item label="字体大小:" label-width="auto" prop="size"><u-input v-model="form.size" placeholder="请输入数字" /></u-form-item>
			<u-form-item label="X坐标偏移量:" label-width="auto" prop="xAxis"><u-input v-model="form.xAxis" placeholder="请输入数字" /></u-form-item>
			<u-form-item label="Y坐标偏移量:" label-width="auto" prop="yAxis"><u-input v-model="form.yAxis" placeholder="请输入数字" /></u-form-item>
		</u-form>
		<view class="mt-30"><u-button type="primary" @click="make">生成图样</u-button></view>
		<view class="mt-30"><u-button :disabled="ok" type="success" @click="save">保存图样</u-button></view>
		<u-select mode="single-column" :list="fontList" v-model="fontShow" @confirm="fontShowCall"></u-select>
		<view class="u-font-25 u-m-t-20 u-type-info">授权方法:</view>
		<view class="u-font-25 u-m-t-10 u-type-info">授权相册方法点击右上角"..." -> 设置 -> 相册</view>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			uid: app.globalData.uid,
			ok: true,
			fontShow: false,
			pic: '',
			form: {
				name: '',
				font: '黑体',
				size: '',
				xAxis: '',
				yAxis: ''
			},
			rules: {
				name: [
					{
						required: true,
						message: '请输入商标名称',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				font: [
					{
						required: true,
						message: '请选择商标字体',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				]
			},
			fontList: [{ label: '黑体', value: '黑体' }, { label: '宋体', value: '宋体' }, { label: '仿宋', value: '仿宋' }, { label: '楷体', value: '楷体' }]
		};
	},
	onLoad() {
		const that = this;
		//不显示分享按钮
		uni.hideShareMenu();
		if (!app.globalData.uid) {
			that.clearCache();
			that.gotoPage('user');
		}
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	onShow() {
		this.uid = app.globalData.uid;
	},
	methods: {
		fontShowCall(e) {
			this.form.font = '';
			this.form.font = e[0].value;
		},
		make() {
			const that = this;
			that.$refs.uForm.validate(valid => {
				if (valid) {
					that.http(
						app.globalData.ext.url2 + 'tools/make?',
						{
							uid: app.globalData.uid,
							form: that.form
						},
						function(res) {
							that.ok = false;
							that.pic = res.data.data.replace(/[\r\n]/g, '');
							that.showMsg(res.data.message, res.data.status);
						},
						'/pages/user/tools/tuyang',
						true,
						'操作中...',
						1,
						2
					);
				}
			});
		},
		save() {
			const that = this;
			// #ifdef MP-WEIXIN
			uni.getSetting({
				//获取用户的当前设置
				success: res => {
					if (res.authSetting['scope.writePhotosAlbum']) {
						//验证用户是否授权可以访问相册
						that.saveImageToPhotosAlbum();
					} else {
						uni.authorize({
							//如果没有授权，向用户发起请求
							scope: 'scope.writePhotosAlbum',
							success: () => {
								that.saveImageToPhotosAlbum();
							},
							fail: () => {
								that.showMsg('请授权打开相册,点击右上角"..." -> 设置 -> 相册');
							}
						});
					}
				}
			});
			// #endif
		},
		saveImageToPhotosAlbum() {
			const that = this;
			// #ifdef MP-WEIXIN
			let base64 = that.pic.replace(/^data:image\/(.*);base64,/, '');
			let filePath = wx.env.USER_DATA_PATH + '/' + that.time() + '.jpg';
			uni.getFileSystemManager().writeFile({
				filePath: filePath, //创建一个临时文件名
				data: base64, //写入的文本或二进制数据
				encoding: 'base64', //写入当前文件的字符编码
				success: function(res) {
					uni.saveImageToPhotosAlbum({
						filePath: filePath,
						success: function(res) {
							that.showMsg('保存成功', 'success');
						}
					});
				},
				fail: function() {
					that.showMsg('保存失败');
				}
			});
			// #endif
		}
	}
};
</script>
