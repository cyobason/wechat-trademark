<template>
	<view class="page pb-30">
		<view class="form">
			<u-form :model="form" ref="uForm">
				<!-- 商标注册 -->
				<u-form-item required label-width="auto" label="申请人:" prop="applicantName">
					<u-input type="select" :select-open="applicantNameShow" v-model="form.applicantName" placeholder="请选择申请人" @click="applicantNameShow = true"></u-input>
				</u-form-item>
				<u-form-item label="商标名称:" required label-width="auto" prop="subject">
					<u-input v-model="form.subject" :disabled="ok" placeholder="请输入商标名称" />
				</u-form-item>
				<u-form-item label="商标选类:" required label-width="auto" prop="goods">
					<u-input maxlength="0" v-model="form.goods" type="textarea" :disabled="noedit" placeholder="请粘贴商标选类" />
				</u-form-item>
				<u-form-item label="委 托 书:" required label-width="auto" prop="document">
					<u-upload
						:limitType="['jpg']"
						:file-list="documentList"
						:action="uploadPath"
						@on-uploaded="onUpload"
						max-count="1"
						name="document"
						ref="document"
						:show-progress="hide"
						:deletable="orderid ? false : true"
					></u-upload>
				</u-form-item>
				<view class="u-font-25 u-type-info u-m-t-10">注：委托书请上传JPG文件</view>
				<u-form-item label="商标图样:" required label-width="auto" prop="logo">
					<u-upload
						:limitType="['jpg']"
						:file-list="logoList"
						:action="uploadPath"
						@on-uploaded="onUpload"
						max-count="1"
						name="logo"
						ref="logo"
						:show-progress="hide"
						:deletable="orderid ? false : true"
					></u-upload>
				</u-form-item>
				<view class="u-font-25 u-type-info u-m-t-10">注：商标图样请上传400像素 x 400像素白底黑字的JPG文件</view>
				<u-form-item label="着色图样:" label-width="auto" prop="logoColor">
					<u-upload
						:limitType="['jpg']"
						:file-list="logoColorList"
						:action="uploadPath"
						@on-uploaded="onUpload"
						max-count="1"
						name="logoColor"
						ref="logoColor"
						:show-progress="hide"
						:deletable="orderid ? false : true"
					></u-upload>
				</u-form-item>
				<view class="u-font-25 u-type-info u-m-t-10">注：着色图样请上传400像素 x 400像素白底彩色的JPG文件</view>
				<u-form-item label="商标说明:" label-width="auto" prop="explanation">
					<u-input type="textarea" maxlength="0" v-model="form.explanation" :disabled="ok" placeholder="请输入商标图样的设计说明" />
				</u-form-item>
				<view class="u-type-error u-text-right u-m-t-30" style="font-weight: 600;">合计：{{ price }}元</view>
			</u-form>
			<view class="mt-30"><u-button :disabled="saveBtn" type="primary" @click="save">保存</u-button></view>
			<view class="mt-30" v-if="payBtn"><u-button v-if="id && orderid == 0" type="success" @click="showPay = true">支付</u-button></view>
			<view class="mt-30" v-if="delBtn"><u-button type="error" @click="delOrder">删除订单</u-button></view>
			<view class="mt-30"><u-button plain @click="gotoPage('order')">查看订单</u-button></view>
			<u-select mode="single-column" :list="applicantNameList" v-model="applicantNameShow" @confirm="applicantNameCall"></u-select>
		</view>
		<u-popup v-model="showPay" mode="bottom" length="40%" border-radius="10" :closeable="true">
			<view class="price_box">
				<view class="price_title">确认付款</view>
				<view class="price_price">￥{{ price }}</view>
				<view class="price_content u-type-info-disabled">{{ form.subject }} ({{ fid }}类)</view>
				<view class="price_btn"><u-button type="success" @click="wxpay">确认支付</u-button></view>
			</view>
		</u-popup>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			//删除按钮
			delBtn: false,
			//订单ID(有ID代表已支付成功)
			orderid: 0,
			//支付按钮
			payBtn: false,
			//是否显示支付弹窗
			showPay: false,
			//保存按钮是否可按
			saveBtn: true,
			//必须上传图片数
			picNum: 0,
			//订单分类
			type: '商标注册',
			//用户id
			uid: app.globalData.uid,
			id: '',
			fid: '',
			//是否可以编辑
			noedit: true,
			ok: false,
			hide: true,
			priceID: 1,
			price_cost: '0.00',
			price: '0.00',
			priceList: [],
			applicantNameShow: false,
			uploadPath: app.globalData.ext.url2 + 'applicant/upload',
			submitStatus: 0,
			documentList: [],
			logoList: [],
			logoColorList: [],
			applicantNameList: [],
			applicantName: '',
			form: {
				applicantName: '',
				subject: '',
				goods: '',
				document: '',
				logo: '',
				logoColor: '',
				explanation: ''
			},
			rules: {
				applicantName: [
					{
						required: true,
						message: '请选择申请人',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				subject: [
					{
						required: true,
						message: '请输入商标名称',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				goods: [
					{
						required: true,
						message: '请粘贴商标选类',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				document: [
					{
						required: true,
						message: '请上传委托书',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				logo: [
					{
						required: true,
						message: '请上传商标图样',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				]
			}
		};
	},
	onLoad(e) {
		const that = this;
		if (typeof e.id == undefined || typeof e.id == 'undefined') {
			uni.setNavigationBarTitle({
				title: '新增订单'
			});
		} else {
			uni.setNavigationBarTitle({
				title: '编辑订单'
			});
			that.id = e.id;
		}
		if (typeof e.fid != undefined || typeof e.fid != 'undefined') {
			that.fid = e.fid;
		}
		//不显示分享按钮
		uni.hideShareMenu();
	},
	onShow() {
		const that = this;
		that.uid = app.globalData.uid;
		if (!app.globalData.uid) {
			that.clearCache();
			that.gotoPage('home');
		}		
		that.get_od(that.id);
		that.get_sqr();
		that.get_price();
		//读取购物车已选数量
		that.getcartTotal();
	},
	// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	watch: {
		picNum(e) {
			if (e == 2) {
				this.saveBtn = false;
				this.payBtn = true;
			}
		}
	},
	methods: {
		//格式化选类
		formate_data(fid) {
			const that = this;
			let rs = '';
			let xl = [];
			for (var i in app.globalData.cartList[fid].item) {
				for (var ii in app.globalData.cartList[fid].item[i]) {
					xl.push(fid + '`' + i + '`' + app.globalData.cartList[fid].item[i][ii].id + '`' + app.globalData.cartList[fid].item[i][ii].name + ';');
				}
			}
			that.fid = fid;
			that.form.goods = xl.join('\n');
		},
		//获取订单
		get_od(id) {
			const that = this;
			if (id) {
				that.http(
					app.globalData.ext.url2 + 'order/get_od?',
					{
						uid: app.globalData.uid,
						id: id
					},
					function(res) {
						that.form = {
							applicantName: res.data.data.comName,
							subject: res.data.data.subject,
							goods: res.data.data.goods,
							document: res.data.data.document,
							logo: res.data.data.logo,
							logoColor: res.data.data.logoColor,
							explanation: res.data.data.explanation
						};
						that.price = res.data.data.price_price;
						that.applicantName = res.data.data.applicantName;
						that.documentList = [{ url: app.globalData.ext.domain + res.data.data.document }];
						that.logoList = [{ url: app.globalData.ext.domain + res.data.data.logo }];
						that.logoColorList = [{ url: app.globalData.ext.domain + res.data.data.logoColor }];
						that.hide = false;
						that.orderid = res.data.data.price_id;
						that.fid = res.data.data.cate;
						that.payBtn = res.data.data.price_id == 0 ? true : false;
						that.delBtn = res.data.data.price_id == 0 ? true : false;
						that.saveBtn = res.data.data.price_id == 0 && that.id ? false : true;
					},
					'/pages/order/form/index?id=' + id
				);
			}
		},
		//获取价格
		get_price() {
			const that = this;
			that.http(
				app.globalData.ext.url2 + 'order/get_price?',
				{
					type: that.type,
					uid: app.globalData.uid
				},
				function(res) {
					that.priceList = res.data.data;
					that.priceID = res.data.data.id;
					that.price_cost = res.data.data.cost;
					//计算价格
					let num = app.globalData.cartList[that.fid].total;
					if (num <= 10) {
						that.price = that.priceList.price;
						that.price_cost = that.priceList.cost;
					} else {
						let lastNum = num - 10;
						that.price = (lastNum * Number(that.priceList.ePrice) + Number(that.priceList.price)).toString() + '.00';
						that.price_cost = (lastNum * Number(that.priceList.eCost) + Number(that.priceList.cost)).toString() + '.00';
					}
					//格式化选类
					that.formate_data(that.fid);
				},
				'/pages/order/form/index'
			);
		},
		//获取申请人
		get_sqr() {
			const that = this;
			that.http(
				app.globalData.ext.url2 + 'applicant/get_sqr?',
				{
					uid: app.globalData.uid
				},
				function(res) {
					that.applicantNameList = res.data.data;
				},
				'/pages/order/form/index'
			);
		},
		//下拉选择申请人
		applicantNameCall(e) {
			this.form.applicantName = '';
			this.form.applicantName = e[0].label;
			this.applicantName = e[0].value;
		},
		//上传图片
		onUpload(e) {
			const that = this;
			if (e[0].error == false && e[0].progress == 100) {
				if (e[0].response.status == 'success') {
					that.hide = false;
					that.picNum += 1;
					that.form[e[0].response.data.name] = e[0].response.data.url;
				}
			}
		},
		//保存订单
		save(e) {
			const that = this;
			that.$refs.uForm.validate(valid => {
				if (valid) {
					that.http(
						app.globalData.ext.url2 + 'order/set_sbzc?',
						{
							id: that.id,
							cate: that.fid,
							uid: app.globalData.uid,
							applicantName: that.applicantName,
							subject: that.form.subject,
							goods: that.form.goods,
							document: that.form.document,
							logo: that.form.logo,
							logoColor: that.form.logoColor,
							explanation: that.form.explanation,
							price: that.priceID,
							price_price: that.price,
							price_cost: that.price_cost
						},
						function(res) {
							that.showMsg('保存成功', 'success');
							that.saveBtn = true;
							that.payBtn = true;
							that.delBtn = true;
							that.id = res.data.data.id;
						},
						'/pages/order/index/index'
					);
				}
			});
		},
		//微信支付拉起
		wxpay() {
			const that = this;
			if (app.globalData.uid && app.globalData.openid) {
				that.http(
					app.globalData.ext.url2 + 'order/wxpay?',
					{
						openid: app.globalData.openid,
						id: that.id,
						uid: app.globalData.uid,
						price: that.price,
						subject: that.form.subject,
						type: that.type
					},
					function(res) {
						let rs = res.data.data;
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: rs.timeStamp,
							nonceStr: rs.nonceStr,
							package: rs.package,
							signType: 'MD5',
							paySign: rs.paySign,
							success: function(res) {
								that.showPay = false;
								that.payBtn = false;
								that.orderid = 1;
								setTimeout(function() {
									uni.reLaunch({
										url: '/pages/order/index/index'
									});
								}, 800);
								that.showMsg('支付成功', 'success');
							},
							fail: function(err) {
								that.showPay = false;
								if (err.errMsg.indexOf('fail cancel') !== -1) {
									that.showMsg('用户取消支付');
								} else {
									that.showMsg('支付失败');
								}
							}
						});
					},
					'/pages/order/form/index?id=' + that.id
				);
			}
		},
		//删除订单
		delOrder() {
			const that = this;
			if (that.id) {
				uni.showModal({
					title: '提示',
					content: '是否删除此订单?',
					success: function(res) {
						if (res.confirm) {
							that.http(
								app.globalData.ext.url2 + 'order/del_od?',
								{
									id: that.id,
									uid: that.uid
								},
								function(res) {
									setTimeout(function() {
										uni.reLaunch({
											url: '/pages/order/index/index'
										});
									}, 800);
									that.showMsg('删除成功', 'success');
								},
								'/pages/order/index/index'
							);
						}
					}
				});
			} else {
				that.showMsg('请先保存订单');
			}
		}
	}
};
</script>
