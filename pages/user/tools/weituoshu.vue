<template>
	<view class="page pb-30">
		<scroll-view class="flex-top" style="height:45px;"><u-tabs :list="tableList" :current="index" @change="change"></u-tabs></scroll-view>
		<view class="form" :style="mt45">
			<u-form :model="form" ref="uForm">
				<block v-if="tableLabel == '商标注册'">
					<u-form-item label="商标名称:" required label-width="auto" prop="subject"><u-input v-model="form.subject" placeholder="请输入商标名称" /></u-form-item>
					<u-form-item label="申请人名称:" required label-width="auto" prop="applicantName">
						<u-input
							type="select"
							:select-open="applicantNameShow"
							v-model="form.applicantName"
							placeholder="请选择申请人名称,如无申请人请先添加"
							@click="applicantNameShow = true"
						></u-input>
					</u-form-item>
				</block>

				<block v-else-if="tableLabel == '商标转让'">
					<view class="u-m-t-10 u-m-b-10"><u-subsection :list="zrList" :current="zrindex" @change="zrchange" active-color="#ff9900"></u-subsection></view>
					<u-form-item label="商标申请号:" required label-width="auto" prop="subject"><u-input v-model="form.subject" placeholder="请输入商标申请号" /></u-form-item>
					<view class="u-font-25 u-type-info u-m-t-10">多个注册号之间用";"隔开</view>
					<block v-if="zrindex == 0">
						<u-form-item label="转让人 (申请人):" required label-width="auto" prop="assignorName">
							<u-input
								type="select"
								:select-open="assignorNameShow"
								v-model="form.assignorName"
								placeholder="请选择转让人 (申请人)名称,如无申请人请先添加"
								@click="assignorNameShow = true"
							></u-input>
						</u-form-item>
					</block>
					<block v-if="zrindex == 1">
						<u-form-item label="受让人 (申请人):" required label-width="auto" prop="assigneeName">
							<u-input
								type="select"
								:select-open="assigneeNameShow"
								v-model="form.assigneeName"
								placeholder="请选择受让人 (申请人)名称,如无申请人请先添加"
								@click="assigneeNameShow = true"
							></u-input>
						</u-form-item>
					</block>
				</block>
				<block v-else>
					<u-form-item label="商标申请号:" required label-width="auto" prop="subject"><u-input v-model="form.subject" placeholder="请输入商标申请号" /></u-form-item>
					<view class="u-font-25 u-type-info u-m-t-10">多个注册号之间用";"隔开</view>
					<u-form-item label="申请人名称:" required label-width="auto" prop="applicantName">
						<u-input
							type="select"
							:select-open="applicantNameShow"
							v-model="form.applicantName"
							placeholder="请选择申请人名称,如无申请人请先添加"
							@click="applicantNameShow = true"
						></u-input>
					</u-form-item>
				</block>
			</u-form>
			<view class="mt-30"><u-button type="primary" @click="create_wts">生成委托书</u-button></view>
			<view class="mt-30"><u-button :disabled="ok" type="success" @click="open_wts">查看委托书</u-button></view>
			<view class="u-font-25 u-m-t-20 u-type-info">使用方法:</view>
			<view class="u-font-25 u-m-t-10 u-type-info">1.点击生成委托书</view>
			<view class="u-font-25 u-m-t-10 u-type-info">2.点击查看委托书</view>
			<view class="u-font-25 u-m-t-10 u-type-info">3.点击右上角的“...”转发到微信即可保存打印</view>
			<u-select mode="single-column" :list="applicantNameList" v-model="applicantNameShow" @confirm="applicantNameCall"></u-select>
			<u-select mode="single-column" :list="assignorNameList" v-model="assignorNameShow" @confirm="assignorNameCall"></u-select>
			<u-select mode="single-column" :list="assigneeNameList" v-model="assigneeNameShow" @confirm="assigneeNameCall"></u-select>
		</view>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			ok: true,
			id: 0,
			type: 0,
			mt45: 'margin-top:45px;',
			index: 0,
			zrindex: 0,
			wts: '',
			tableLabel: '商标注册',
			tableName: 'registration',
			uid: app.globalData.uid,
			applicantNameShow: false,
			applicantNameId: 0,
			assignorNameShow: false,
			assignorNameId: 0,
			assigneeNameShow: false,
			assigneeNameId: 0,
			form: {
				subject: '',
				applicantName: '',
				assignorName: '',
				assigneeName: ''
			},
			rules: {
				subject: [
					{
						required: true,
						message: '请安提示输入相应格式内容',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				applicantName: [
					{
						required: true,
						message: '请选择申请人名称,如无申请人请先添加',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				assignorName: [
					{
						required: true,
						message: '请选择转让人 (申请人)名称,如无申请人请先添加',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				assigneeName: [
					{
						required: true,
						message: '请选择受让人 (申请人)名称,如无申请人请先添加',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				]
			},
			zrList: [{ name: '转让人' }, { name: '受让人' }],
			tableList: [
				{ label: '商标注册', value: 'registration', name: '商标注册' },
				{ label: '商标转让', value: 'transfer', name: '商标转让' },
				{ label: '商标续展', value: 'renewal', name: '商标续展' },
				{ label: '商标变更', value: 'change', name: '商标变更' },
				{ label: '商标更正', value: 'correction', name: '商标更正' },
				{ label: '商标注销', value: 'off', name: '商标注销' },
				{ label: '删除商品', value: 'delete', name: '删除商品' },
				{ label: '商标许可', value: 'license', name: '商标许可' },
				{ label: '终止商标许可', value: 'licenseoff', name: '终止商标许可' },
				{ label: '变更商标许可', value: 'licensechange', name: '变更商标许可' },
				{ label: '变更代理/接收地址', value: 'changeagent', name: '变更代理/接收地址' },
				{ label: '商标补证', value: 'remake', name: '商标补证' },
				{ label: '商标补发证明', value: 'replace', name: '商标补发证明' },
				{ label: '出具优先权', value: 'priority', name: '出具优先权' }
			],
			applicantNameList: [],
			assignorNameList: [],
			assigneeNameList: []
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
		that.get_sqr();
	},
	onShow() {
		this.uid = app.globalData.uid;
	},
	// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	methods: {
		change(e) {
			const that = this;
			uni.pageScrollTo({
				scrollTop: 0
			});
			if (e == 1) {
				that.type = that.zrindex + 1;
			} else {
				that.type = 0;
			}
			that.ok = true;
			that.wts = '';
			that.tableLabel = that.tableList[e].label;
			that.tableName = that.tableList[e].value;
			that.index = e;
			that.form.subject = '';
			that.form.applicantName = '';
			that.form.assignorName = '';
			that.form.assigneeName = '';
			that.applicantNameShow = false;
			that.assignorNameShow = false;
			that.assigneeNameShow = false;
		},
		zrchange(e) {
			const that = this;
			that.zrindex = e;
			that.type = e + 1;
			that.ok = true;
			that.wts = '';
			that.form.subject = '';
			that.form.subject = '';
			that.form.applicantName = '';
			that.form.assignorName = '';
			that.form.assigneeName = '';
			that.applicantNameShow = false;
			that.assignorNameShow = false;
			that.assigneeNameShow = false;
		},
		applicantNameCall(e) {
			this.form.applicantName = e[0].label;
			this.id = e[0].value;
		},
		assignorNameCall(e) {
			this.form.assignorName = e[0].label;
			this.id = e[0].value;
		},
		assigneeNameCall(e) {
			this.form.assigneeName = e[0].label;
			this.id = e[0].value;
		},
		get_sqr() {
			const that = this;
			that.http(
				app.globalData.ext.url2 + 'applicant/get_sqr?',
				{
					uid: app.globalData.uid
				},
				function(res) {
					that.applicantNameList = res.data.data;
					that.assignorNameList = res.data.data;
					that.assigneeNameList = res.data.data;
				},
				'/pages/user/tools/weituoshu',
				false
			);
		},
		create_wts() {
			const that = this;
			that.$refs.uForm.validate(valid => {
				if (valid) {
					that.http(
						app.globalData.ext.url2 + 'tools/document?',
						{
							id: that.id,
							uid: app.globalData.uid,
							type: that.type,
							tableName: that.tableName,
							subject: that.form.subject
						},
						function(res) {
							that.showMsg(res.data.message, res.data.status);
							that.wts = res.data.data;
							that.ok = false;
						},
						'/pages/user/tools/weituoshu',
						true,
						'生成中...',
						1,
						2
					);
				}
			});
		},
		open_wts() {
			const that = this;
			if (that.wts) {
				uni.downloadFile({
					url: that.wts,
					success: function(res) {						
						var filePath = res.tempFilePath;
						uni.openDocument({
							showMenu: true,
							filePath: filePath,
							success: function(res) {}
						});
					},
					fail: function(res) {
						that.showMsg('下载文档失败');
					}
				});
			}
		}
	}
};
</script>
