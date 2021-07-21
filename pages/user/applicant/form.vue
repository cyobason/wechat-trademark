<template>
	<view class="page pb-30">
		<scroll-view v-if="id == 0" class="flex-top" style="height:45px;"><u-tabs :list="types" :current="index" @change="change"></u-tabs></scroll-view>
		<view class="form" :style="mt45">
			<u-form :model="form" ref="uForm">
				<u-form-item label="申请人名称:" required label-width="auto" prop="subject"><u-input v-model="form.subject" :disabled="ok" /></u-form-item>
				<u-form-item label="申请人地址:" required label-width="auto" prop="address"><u-input v-model="form.address" :disabled="ok" /></u-form-item>
				<!-- 大陆企业 -->
				<block v-if="index == 0">
					<u-form-item label="企业信用代码:" required label-width="auto" prop="companyNo"><u-input v-model="form.companyNo" :disabled="ok" /></u-form-item>
					<u-form-item label="营业执照:" required label-width="auto" prop="companyFile">
						<u-upload
							:file-list="companyFileList"
							:action="uploadPath"
							@on-uploaded="onUpload"
							max-count="1"
							name="companyFile"
							ref="companyFile"
							:show-progress="hide"
							:deletable="ok == true ? false : true"
						></u-upload>
					</u-form-item>
				</block>
				<!-- 大陆个人 -->
				<block v-if="index == 1">
					<u-form-item required label-width="auto" label="证件类型:" prop="idType">
						<u-input type="select" :select-open="idTypeShow" v-model="form.idType" placeholder="请选择证件类型" @click="idTypeShow = true" :disabled="ok"></u-input>
					</u-form-item>
					<u-form-item label="证件号码:" required label-width="auto" prop="passportNo"><u-input v-model="form.passportNo" :disabled="ok" /></u-form-item>
					<u-form-item label="证件正反面:" required label-width="auto" prop="idFile">
						<u-upload
							:file-list="idFileList"
							:action="uploadPath"
							@on-uploaded="onUpload"
							max-count="1"
							name="idFile"
							ref="idFile"
							:show-progress="hide"
							:deletable="ok == true ? false : true"
						></u-upload>
					</u-form-item>
					<u-form-item label="企业信用代码:" required label-width="auto" prop="companyNo"><u-input v-model="form.companyNo" :disabled="ok" /></u-form-item>
					<u-form-item label="营业执照:" required label-width="auto" prop="companyFile">
						<u-upload
							:file-list="companyFileList"
							:action="uploadPath"
							@on-uploaded="onUpload"
							max-count="1"
							name="companyFile"
							ref="companyFile"
							:show-progress="hide"
							:deletable="ok == true ? false : true"
						></u-upload>
					</u-form-item>
				</block>
				<!-- 港澳台企业 -->
				<block v-if="index == 2">
					<u-form-item label="营业执照:" required label-width="auto" prop="companyFile">
						<u-upload
							:file-list="companyFileList"
							:action="uploadPath"
							@on-uploaded="onUpload"
							max-count="1"
							name="companyFile"
							ref="companyFile"
							:show-progress="hide"
							:deletable="ok == true ? false : true"
						></u-upload>
					</u-form-item>
					<u-form-item label="联系人地址:" required label-width="auto" prop="linkAddress"><u-input v-model="form.linkAddress" :disabled="ok" /></u-form-item>
				</block>
				<!-- 港澳台个人 -->
				<block v-if="index == 3">
					<u-form-item required label-width="auto" label="证件类型:" prop="idType">
						<u-input type="select" :select-open="idTypeShow" v-model="form.idType" placeholder="请选择证件类型" @click="idTypeShow = true" :disabled="ok"></u-input>
					</u-form-item>
					<u-form-item label="证件号码:" required label-width="auto" prop="passportNo"><u-input v-model="form.passportNo" :disabled="ok" /></u-form-item>
					<u-form-item label="证件正反面:" required label-width="auto" prop="idFile">
						<u-upload
							:file-list="idFileList"
							:action="uploadPath"
							@on-uploaded="onUpload"
							max-count="1"
							name="idFile"
							ref="idFile"
							:show-progress="hide"
							:deletable="ok == true ? false : true"
						></u-upload>
					</u-form-item>
					<u-form-item label="联系人地址:" required label-width="auto" prop="linkAddress"><u-input v-model="form.linkAddress" :disabled="ok" /></u-form-item>
				</block>
				<!-- 国外企业 -->
				<block v-if="index == 4">
					<u-form-item required label-width="auto" label="国家或地区:" prop="region">
						<u-input type="select" :select-open="regionShow" v-model="form.region" placeholder="请选择国家或地区" @click="regionShow = true" :disabled="ok"></u-input>
					</u-form-item>
					<u-form-item label="营业执照:" required label-width="auto" prop="companyFile">
						<u-upload
							:file-list="companyFileList"
							:action="uploadPath"
							@on-uploaded="onUpload"
							max-count="1"
							name="companyFile"
							ref="companyFile"
							:show-progress="hide"
							:deletable="ok == true ? false : true"
						></u-upload>
					</u-form-item>
					<u-form-item label="申请人名称(英文):" required label-width="auto" prop="nameForOther"><u-input v-model="form.nameForOther" :disabled="ok" /></u-form-item>
					<u-form-item label="申请人地址(英文):" required label-width="auto" prop="addressForOther">
						<u-input v-model="form.addressForOther" :disabled="ok" />
					</u-form-item>
					<u-form-item label="营业执照(外文):" required label-width="auto" prop="companyFileForOther">
						<u-upload
							:file-list="companyFileForOtherList"
							:action="uploadPath"
							@on-uploaded="onUpload"
							max-count="1"
							name="companyFileForOther"
							ref="companyFileForOther"
							:show-progress="hide"
							:deletable="ok == true ? false : true"
						></u-upload>
					</u-form-item>
					<u-form-item label="联系人地址:" required label-width="auto" prop="linkAddress"><u-input v-model="form.linkAddress" :disabled="ok" /></u-form-item>
				</block>
				<!-- 国外个人 -->
				<block v-if="index == 5">
					<u-form-item required label-width="auto" label="证件类型:" prop="idType">
						<u-input type="select" :select-open="idTypeShow" v-model="form.idType" placeholder="请选择证件类型" @click="idTypeShow = true" :disabled="ok"></u-input>
					</u-form-item>
					<u-form-item label="证件号码:" required label-width="auto" prop="passportNo"><u-input v-model="form.passportNo" :disabled="ok" /></u-form-item>
					<u-form-item label="证件正反面:" required label-width="auto" prop="idFile">
						<u-upload
							:file-list="idFileList"
							:action="uploadPath"
							@on-uploaded="onUpload"
							max-count="1"
							name="idFile"
							ref="idFile"
							:show-progress="hide"
							:deletable="ok == true ? false : true"
						></u-upload>
					</u-form-item>
					<u-form-item label="申请人名称(英文):" required label-width="auto" prop="nameForOther"><u-input v-model="form.nameForOther" :disabled="ok" /></u-form-item>
					<u-form-item label="申请人地址(英文):" required label-width="auto" prop="addressForOther">
						<u-input v-model="form.addressForOther" :disabled="ok" />
					</u-form-item>
					<u-form-item label="证件正反面(外文):" required label-width="auto" prop="idFileForOther">
						<u-upload
							:file-list="idFileForOtherList"
							:action="uploadPath"
							@on-uploaded="onUpload"
							max-count="1"
							name="idFileForOther"
							ref="idFileForOther"
							:show-progress="hide"
							:deletable="ok == true ? false : true"
						></u-upload>
					</u-form-item>
					<u-form-item label="联系人地址:" required label-width="auto" prop="linkAddress"><u-input v-model="form.linkAddress" :disabled="ok" /></u-form-item>
				</block>
				<u-form-item label="联系人:" required label-width="auto" prop="linkName"><u-input v-model="form.linkName" :disabled="ok" /></u-form-item>
				<u-form-item label="联系电话:" required label-width="auto" prop="linkPhone"><u-input v-model="form.linkPhone" :disabled="ok" /></u-form-item>
				<u-form-item label="邮编:" required label-width="auto" prop="linkZip"><u-input v-model="form.linkZip" :disabled="ok" /></u-form-item>
			</u-form>
			<view class="mt-30"><u-button v-if="id == 0 || submitStatus == 0" type="primary" @click="set_sqr">保存</u-button></view>
			<u-select mode="single-column" :list="idTypeList" v-model="idTypeShow" @confirm="idTypeShowCall"></u-select>
			<u-select mode="single-column" :list="regionList" v-model="regionShow" @confirm="regionShowCall"></u-select>
		</view>
	</view>
</template>

<script>
const app = getApp();
export default {
	data() {
		return {
			mt45: 'margin-top:45px;',
			ok: false,
			hide: true,
			winH: app.globalData.winH,
			id: 0,
			uid: app.globalData.uid,
			uploadPath: app.globalData.ext.url2 + 'applicant/upload',
			regionShow: false,
			idTypeShow: false,
			companyFileList: [],
			companyFileForOtherList: [],
			idFileList: [],
			idFileForOtherList: [],
			submitStatus: 0,
			form: {
				subject: '',
				address: '',
				companyNo: '',
				companyFile: '',
				linkName: '',
				linkPhone: '',
				linkZip: '',
				linkAddress: '',
				nameForOther: '',
				idType: '',
				passportNo: '',
				idFile: '',
				idFileForOther: '',
				companyFileForOther: '',
				region: '',
				addressForOther: '',
				nameType: '中国大陆企业'
			},
			rules: {
				subject: [
					{
						required: true,
						message: '请输入申请人名称',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				nameForOther: [
					{
						required: true,
						message: '请输入申请人名称(英文)',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				address: [
					{
						required: true,
						message: '请输入申请人地址',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				addressForOther: [
					{
						required: true,
						message: '请输入申请人地址(英文)',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				companyNo: [
					{
						required: true,
						message: '请输入企业信用代码',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				companyFile: [
					{
						required: true,
						message: '请上传营业执照',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				companyFileForOther: [
					{
						required: true,
						message: '请上传营业执照(外文)',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				linkName: [
					{
						required: true,
						message: '请输入联系人',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				linkPhone: [
					{
						required: true,
						message: '请输入联系电话',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				linkZip: [
					{
						required: true,
						message: '请输入邮编',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				idType: [
					{
						required: true,
						message: '请选择证件类型',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				passportNo: [
					{
						required: true,
						message: '请输入证件号码',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				idFile: [
					{
						required: true,
						message: '请上传证件正反面',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				idFileForOther: [
					{
						required: true,
						message: '请上传证件正反面(外文)',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				linkAddress: [
					{
						required: true,
						message: '请输入联系人地址',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				region: [
					{
						required: true,
						message: '请选择国家或地区',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				]
			},
			types: [
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
			idTypeList: [{ label: '身份证', value: '身份证' }, { label: '护照', value: '护照' }],
			regionList: [
				{ label: 'ASNY  爱沙尼亚共和国', value: 'ASNY  爱沙尼亚共和国' },
				{ label: 'ALQ  阿拉伯联合酋长国', value: 'ALQ  阿拉伯联合酋长国' },
				{ label: 'AEJLY  阿尔及利亚民主人民共和国', value: 'AEJLY  阿尔及利亚民主人民共和国' },
				{ label: 'AM  阿曼苏丹国', value: 'AM  阿曼苏丹国' },
				{ label: 'ALB  阿鲁巴', value: 'ALB  阿鲁巴' },
				{ label: 'ASEBYLBMZGHG  埃塞俄比亚联邦民主共和国', value: 'ASEBYLBMZGHG  埃塞俄比亚联邦民主共和国' },
				{ label: 'AFHYSLGHG  阿富汗伊斯兰共和国', value: 'AFHYSLGHG  阿富汗伊斯兰共和国' },
				{ label: 'AGLGHG  安哥拉共和国', value: 'AGLGHG  安哥拉共和国' },
				{ label: 'ADEGG  安道尔公国', value: 'ADEGG  安道尔公国' },
				{ label: 'AEBNY  阿尔巴尼亚共和国', value: 'AEBNY  阿尔巴尼亚共和国' },
				{ label: 'ASBJ  阿塞拜疆共和国', value: 'ASBJ  阿塞拜疆共和国' },
				{ label: 'ATGHBBD  安提瓜和巴布达', value: 'ATGHBBD  安提瓜和巴布达' },
				{ label: 'AGL  安圭拉', value: 'AGL  安圭拉' },
				{ label: 'AGT  阿根廷共和国', value: 'AGT  阿根廷共和国' },
				{ label: 'ADLY  澳大利亚联邦', value: 'ADLY  澳大利亚联邦' },
				{ label: 'ADL  奥地利共和国', value: 'ADL  奥地利共和国' },
				{ label: 'AJ  阿拉伯埃及共和国', value: 'AJ  阿拉伯埃及共和国' },
				{ label: 'AEL  爱尔兰', value: 'AEL  爱尔兰' },
				{ label: 'BSNYHSGWY  波斯尼亚和黑塞哥维那', value: 'BSNYHSGWY  波斯尼亚和黑塞哥维那' },
				{ label: 'BD  冰岛共和国', value: 'BD  冰岛共和国' },
				{ label: 'BLZ  伯利兹', value: 'BLZ  伯利兹' },
				{ label: 'BELS  白俄罗斯共和国', value: 'BELS  白俄罗斯共和国' },
				{ label: 'BLS  比利时王国', value: 'BLS  比利时王国' },
				{ label: 'BDLG  波多黎各自治邦', value: 'BDLG  波多黎各自治邦' },
				{ label: 'BJST  巴基斯坦伊斯兰共和国', value: 'BJST  巴基斯坦伊斯兰共和国' },
				{ label: 'BBYXJNYDLG  巴布亚新几内亚独立国', value: 'BBYXJNYDLG  巴布亚新几内亚独立国' },
				{ label: 'BLS  贝里斯', value: 'BLS  贝里斯' },
				{ label: 'BCWNGHG  博茨瓦纳共和国', value: 'BCWNGHG  博茨瓦纳共和国' },
				{ label: 'BNGHG  贝宁共和国', value: 'BNGHG  贝宁共和国' },
				{ label: 'BJNFS  布基纳法索', value: 'BJNFS  布基纳法索' },
				{ label: 'BNED  博内尔岛,圣尤斯特歇斯和萨巴群岛', value: 'BNED  博内尔岛,圣尤斯特歇斯和萨巴群岛' },
				{ label: 'BLDGHG  布隆迪共和国', value: 'BLDGHG  布隆迪共和国' },
				{ label: 'BMLYNQD  北马里亚纳群岛', value: 'BMLYNQD  北马里亚纳群岛' },
				{ label: 'BWD  布维岛', value: 'BWD  布维岛' },
				{ label: 'BOZLJG  北欧专利机构', value: 'BOZLJG  北欧专利机构' },
				{ label: 'BDWG  不丹王国', value: 'BDWG  不丹王国' },
				{ label: 'BLGGHG  巴拉圭共和国', value: 'BLGGHG  巴拉圭共和国' },
				{ label: 'BHM  巴哈马国', value: 'BHM  巴哈马国' },
				{ label: 'BL  巴林王国', value: 'BL  巴林王国' },
				{ label: 'BBDS  巴巴多斯', value: 'BBDS  巴巴多斯' },
				{ label: 'BHL  比荷卢知识产权局', value: 'BHL  比荷卢知识产权局' },
				{ label: 'BMD  百慕大', value: 'BMD  百慕大' },
				{ label: 'BX  巴西联邦共和国', value: 'BX  巴西联邦共和国' },
				{ label: 'BJLY  保加利亚共和国', value: 'BJLY  保加利亚共和国' },
				{ label: 'BNM  巴拿马共和国', value: 'BNM  巴拿马共和国' },
				{ label: 'BL  波兰共和国', value: 'BL  波兰共和国' },
				{ label: 'BLSTG  巴勒斯坦国', value: 'BLSTG  巴勒斯坦国' },
				{ label: 'CDJNYGHG  赤道几内亚共和国', value: 'CDJNYGHG  赤道几内亚共和国' },
				{ label: 'CXMZZYRMGHG  朝鲜民主主义人民共和国', value: 'CXMZZYRMGHG  朝鲜民主主义人民共和国' },
				{ label: 'DMNJGHG  多米尼加共和国', value: 'DMNJGHG  多米尼加共和国' },
				{ label: 'DD  东德', value: 'DD  东德' },
				{ label: 'DMZBLWYG  多民族玻利维亚国', value: 'DMZBLWYG  多民族玻利维亚国' },
				{ label: 'DGGHG  多哥共和国', value: 'DGGHG  多哥共和国' },
				{ label: 'DDWMZGHG  东帝汶民主共和国', value: 'DDWMZGHG  东帝汶民主共和国' },
				{ label: 'DMNKG  多米尼克国', value: 'DMNKG  多米尼克国' },
				{ label: 'DLT  独立国家联合体', value: 'DLT  独立国家联合体' },
				{ label: 'DM  丹麦王国', value: 'DM  丹麦王国' },
				{ label: 'DG  德意志联邦共和国', value: 'DG  德意志联邦共和国' },
				{ label: 'DYZLB  德意志联邦', value: 'DYZLB  德意志联邦' },
				{ label: 'DDSTGHG  鞑靼斯坦共和国', value: 'DDSTGHG  鞑靼斯坦共和国' },
				{ label: 'ELS  俄罗斯联邦', value: 'ELS  俄罗斯联邦' },
				{ label: 'ELSLB  俄罗斯联邦', value: 'ELSLB  俄罗斯联邦' },
				{ label: 'EGDE  厄瓜多尔共和国', value: 'EGDE  厄瓜多尔共和国' },
				{ label: 'ELTLYG  厄立特里亚国', value: 'ELTLYG  厄立特里亚国' },
				{ label: 'FDGCG  梵蒂冈城国', value: 'FDGCG  梵蒂冈城国' },
				{ label: 'FSBLNXY  法属波利尼西亚', value: 'FSBLNXY  法属波利尼西亚' },
				{ label: 'FJGHG  斐济共和国', value: 'FJGHG  斐济共和国' },
				{ label: 'FDJGHG  佛得角共和国', value: 'FDJGHG  佛得角共和国' },
				{ label: 'FGGHG  刚果共和国', value: 'FGGHG  刚果共和国' },
				{ label: 'FLQD  法罗群岛', value: 'FLQD  法罗群岛' },
				{ label: 'FZDQZSCQZZ  非洲地区知识产权组织', value: 'FZDQZSCQZZ  非洲地区知识产权组织' },
				{ label: 'FZZSCQZZ  非洲知识产权组织', value: 'FZZSCQZZ  非洲知识产权组织' },
				{ label: 'FL  芬兰共和国', value: 'FL  芬兰共和国' },
				{ label: 'FG  法兰西共和国', value: 'FG  法兰西共和国' },
				{ label: 'FLB  菲律宾共和国', value: 'FLB  菲律宾共和国' },
				{ label: 'GYN  圭亚那共和国', value: 'GYN  圭亚那共和国' },
				{ label: 'GLND  格林纳达', value: 'GLND  格林纳达' },
				{ label: 'GGMZGHG  刚果民主共和国', value: 'GGMZGHG  刚果民主共和国' },
				{ label: 'GBYGHG  冈比亚共和国', value: 'GBYGHG  冈比亚共和国' },
				{ label: 'GLLD  格陵兰岛', value: 'GLLD  格陵兰岛' },
				{ label: 'GLJY  格鲁吉亚', value: 'GLJY  格鲁吉亚' },
				{ label: 'GSDLJGHG  哥斯达黎加共和国', value: 'GSDLJGHG  哥斯达黎加共和国' },
				{ label: 'GLBY  哥伦比亚共和国', value: 'GLBY  哥伦比亚共和国' },
				{ label: 'GB  古巴共和国', value: 'GB  古巴共和国' },
				{ label: 'HG  大韩民国', value: 'HG  大韩民国' },
				{ label: 'HSKST  哈萨克斯坦共和国', value: 'HSKST  哈萨克斯坦共和国' },
				{ label: 'HS  黑山', value: 'HS  黑山' },
				{ label: 'HSJLBDQ  荷属加勒比地区', value: 'HSJLBDQ  荷属加勒比地区' },
				{ label: 'HDGHG  海地共和国', value: 'HDGHG  海地共和国' },
				{ label: 'HWALBGJHZWYHZLJ  海湾阿拉伯国家合作委员会专利局', value: 'HWALBGJHZWYHZLJ  海湾阿拉伯国家合作委员会专利局' },
				{ label: 'HSADLSQD  荷属安的列斯群岛', value: 'HSADLSQD  荷属安的列斯群岛' },
				{ label: 'HL  荷兰王国', value: 'HL  荷兰王国' },
				{ label: 'HDLSGHG  洪都拉斯共和国', value: 'HDLSGHG  洪都拉斯共和国' },
				{ label: 'JPZ  柬埔寨王国', value: 'JPZ  柬埔寨王国' },
				{ label: 'JKGHG  捷克共和国', value: 'JKGHG  捷克共和国' },
				{ label: 'JBBW  津巴布韦共和国', value: 'JBBW  津巴布韦共和国' },
				{ label: 'JKSLFK  捷克斯洛伐克', value: 'JKSLFK  捷克斯洛伐克' },
				{ label: 'JKHSLFK  捷克和斯洛伐克', value: 'JKHSLFK  捷克和斯洛伐克' },
				{ label: 'JMQD  加曼群岛', value: 'JMQD  加曼群岛' },
				{ label: 'JBTGHG  吉布提共和国', value: 'JBTGHG  吉布提共和国' },
				{ label: 'JNGHG  加纳共和国', value: 'JNGHG  加纳共和国' },
				{ label: 'JNYGHG  几内亚共和国', value: 'JNYGHG  几内亚共和国' },
				{ label: 'JNYBSGHG  几内亚比绍共和国', value: 'JNYBSGHG  几内亚比绍共和国' },
				{ label: 'JPGHG  加蓬共和国', value: 'JPGHG  加蓬共和国' },
				{ label: 'JLBS  基里巴斯', value: 'JLBS  基里巴斯' },
				{ label: 'JEJSST  吉尔吉斯共和国', value: 'JEJSST  吉尔吉斯共和国' },
				{ label: 'JND  加拿大', value: 'JND  加拿大' },
				{ label: 'JK  捷克共和国', value: 'JK  捷克共和国' },
				{ label: 'KKQD  库克群岛', value: 'KKQD  库克群岛' },
				{ label: 'KLDY  克罗地亚共和国', value: 'KLDY  克罗地亚共和国' },
				{ label: 'KM  开曼', value: 'KM  开曼' },
				{ label: 'KLDY  克罗地亚共和国', value: 'KLDY  克罗地亚共和国' },
				{ label: 'KLSD  库拉索岛', value: 'KLSD  库拉索岛' },
				{ label: 'KLSD  库拉索岛', value: 'KLSD  库拉索岛' },
				{ label: 'KMLLM  科摩罗联盟', value: 'KMLLM  科摩罗联盟' },
				{ label: 'KNY  肯尼亚共和国', value: 'KNY  肯尼亚共和国' },
				{ label: 'KWT  科威特国', value: 'KWT  科威特国' },
				{ label: 'KMLGHG  喀麦隆共和国', value: 'KMLGHG  喀麦隆共和国' },
				{ label: 'KTEG  卡塔尔国', value: 'KTEG  卡塔尔国' },
				{ label: 'KTDWGHG  科特迪瓦共和国', value: 'KTDWGHG  科特迪瓦共和国' },
				{ label: 'LTWY  拉脱维亚共和国', value: 'LTWY  拉脱维亚共和国' },
				{ label: 'LTW  立陶宛共和国', value: 'LTW  立陶宛共和国' },
				{ label: 'LMNY  罗马尼亚', value: 'LMNY  罗马尼亚' },
				{ label: 'LSB  卢森堡大公国', value: 'LSB  卢森堡大公国' },
				{ label: 'LBN  黎巴嫩共和国', value: 'LBN  黎巴嫩共和国' },
				{ label: 'LIYG  利比亚国', value: 'LIYG  利比亚国' },
				{ label: 'LWDGHG  卢旺达共和国', value: 'LWDGHG  卢旺达共和国' },
				{ label: 'LWRMMZGHG  老挝人民民主共和国', value: 'LWRMMZGHG  老挝人民民主共和国' },
				{ label: 'LTWY  拉脱维亚共和国', value: 'LTWY  拉脱维亚共和国' },
				{ label: 'LST  莱索托王国', value: 'LST  莱索托王国' },
				{ label: 'LBLY  利比里亚共和国', value: 'LBLY  利比里亚共和国' },
				{ label: 'LZDSD  列支敦士登公国', value: 'LZDSD  列支敦士登公国' },
				{ label: 'LBDG  联邦德国', value: 'LBDG  联邦德国' },
				{ label: 'MD  缅甸联邦共和国', value: 'MD  缅甸联邦共和国' },
				{ label: 'MEDW  摩尔多瓦共和国', value: 'MEDW  摩尔多瓦共和国' },
				{ label: 'MET  马耳他共和国', value: 'MET  马耳他共和国' },
				{ label: 'MG  美利坚合众国', value: 'MG  美利坚合众国' },
				{ label: 'MLG  摩洛哥', value: 'MLG  摩洛哥' },
				{ label: 'MQD  马其顿共和国', value: 'MQD  马其顿共和国' },
				{ label: 'MLQS  毛里求斯共和国', value: 'MLQS  毛里求斯共和国' },
				{ label: 'MED  英属马恩岛', value: 'MED  英属马恩岛' },
				{ label: 'MSEQDGHG  马绍尔群岛共和国', value: 'MSEQDGHG  马绍尔群岛共和国' },
				{ label: 'MSWEJQD  美属维尔京群岛', value: 'MSWEJQD  美属维尔京群岛' },
				{ label: 'MJLRMGHG  孟加拉人民共和国', value: 'MJLRMGHG  孟加拉人民共和国' },
				{ label: 'MKLNXYLB  密克罗尼西亚联邦', value: 'MKLNXYLB  密克罗尼西亚联邦' },
				{ label: 'MLTNYYSLGHG  毛里塔尼亚伊斯兰共和国', value: 'MLTNYYSLGHG  毛里塔尼亚伊斯兰共和国' },
				{ label: 'MLWGHG  马拉维共和国', value: 'MLWGHG  马拉维共和国' },
				{ label: 'MEWNSQD  马尔维纳斯群岛', value: 'MEWNSQD  马尔维纳斯群岛' },
				{ label: 'MTSLT  蒙特塞拉特', value: 'MTSLT  蒙特塞拉特' },
				{ label: 'MEDWGHG  摩尔多瓦共和国', value: 'MEDWGHG  摩尔多瓦共和国' },
				{ label: 'MSBK  莫桑比克共和国', value: 'MSBK  莫桑比克共和国' },
				{ label: 'MDJSJGHG  马达加斯加共和国', value: 'MDJSJGHG  马达加斯加共和国' },
				{ label: 'MLXY  马来西亚', value: 'MLXY  马来西亚' },
				{ label: 'MXG  墨西哥合众国', value: 'MXG  墨西哥合众国' },
				{ label: 'MNG  摩纳哥公国', value: 'MNG  摩纳哥公国' },
				{ label: 'MG  蒙古国', value: 'MG  蒙古国' },
				{ label: 'ML  秘鲁共和国', value: 'ML  秘鲁共和国' },
				{ label: 'MZDG  民主德国', value: 'MZDG  民主德国' },
				{ label: 'MLGHG  马里共和国', value: 'MLGHG  马里共和国' },
				{ label: 'MD  曼岛', value: 'MD  曼岛' },
				{ label: 'NJZYDYNSWQQD  南乔治亚岛与南桑威奇群岛', value: 'NJZYDYNSWQQD  南乔治亚岛与南桑威奇群岛' },
				{ label: 'NA  纽埃', value: 'NA  纽埃' },
				{ label: 'NJLGGHG  尼加拉瓜共和国', value: 'NJLGGHG  尼加拉瓜共和国' },
				{ label: 'NF  南非共和国', value: 'NF  南非共和国' },
				{ label: 'NWSD  尼维斯岛', value: 'NWSD  尼维斯岛' },
				{ label: 'NBELBMZGHG  尼泊尔联邦民主共和国', value: 'NBELBMZGHG  尼泊尔联邦民主共和国' },
				{ label: 'NREGHG  尼日尔共和国', value: 'NREGHG  尼日尔共和国' },
				{ label: 'NSDGHG  南苏丹共和国', value: 'NSDGHG  南苏丹共和国' },
				{ label: 'NRLY  尼日利亚联邦共和国', value: 'NRLY  尼日利亚联邦共和国' },
				{ label: 'NCX  南朝鲜', value: 'NCX  南朝鲜' },
				{ label: 'NSLF  南斯拉夫', value: 'NSLF  南斯拉夫' },
				{ label: 'NMBYGHG  纳米比亚共和国', value: 'NMBYGHG  纳米比亚共和国' },
				{ label: 'NLGHG  瑙鲁共和国', value: 'NLGHG  瑙鲁共和国' },
				{ label: 'NW  挪威王国', value: 'NW  挪威王国' },
				{ label: 'OGTNBSCSBYTHGLJ  欧盟内部市场协调局', value: 'OGTNBSCSBYTHGLJ  欧盟内部市场协调局' },
				{ label: 'OM  欧洲专利局', value: 'OM  欧洲专利局' },
				{ label: 'OZLM  欧洲联盟', value: 'OZLM  欧洲联盟' },
				{ label: 'OGT  欧共体', value: 'OGT  欧共体' },
				{ label: 'OYZLZZ  欧亚专利组织', value: 'OYZLZZ  欧亚专利组织' },
				{ label: 'OZSB  欧洲商标', value: 'OZSB  欧洲商标' },
				{ label: 'PL  帕劳共和国', value: 'PL  帕劳共和国' },
				{ label: 'PTY  葡萄牙共和国', value: 'PTY  葡萄牙共和国' },
				{ label: 'PSMDLD  葡属马德拉岛', value: 'PSMDLD  葡属马德拉岛' },
				{ label: 'QNSLFMQDGHG  前南斯拉夫马其顿共和国', value: 'QNSLFMQDGHG  前南斯拉夫马其顿共和国' },
				{ label: 'RD  瑞典', value: 'RD  瑞典' },
				{ label: 'RS  瑞士联邦', value: 'RS  瑞士联邦' },
				{ label: 'RB  日本国', value: 'RB  日本国' },
				{ label: 'RD  人岛', value: 'RD  人岛' },
				{ label: 'SSEGHG  塞舌尔共和国', value: 'SSEGHG  塞舌尔共和国' },
				{ label: 'SEWYHHSGHG  塞尔维亚和黑山共和国', value: 'SEWYHHSGHG  塞尔维亚和黑山共和国' },
				{ label: 'SLNGHG  苏里南共和国', value: 'SLNGHG  苏里南共和国' },
				{ label: 'SJCHNWSLB  圣基茨和尼维斯联邦', value: 'SJCHNWSLB  圣基茨和尼维斯联邦' },
				{ label: 'SGL  苏格兰', value: 'SGL  苏格兰' },
				{ label: 'SNJE  塞内加尔共和国', value: 'SNJE  塞内加尔共和国' },
				{ label: 'SPLS  塞浦路斯共和国', value: 'SPLS  塞浦路斯共和国' },
				{ label: 'SMLN  圣马力诺共和国', value: 'SMLN  圣马力诺共和国' },
				{ label: 'SLLK  斯里兰卡民主社会主义共和国', value: 'SLLK  斯里兰卡民主社会主义共和国' },
				{ label: 'SPLS  塞浦路斯共和国', value: 'SPLS  塞浦路斯共和国' },
				{ label: 'SL  苏维埃社会主义共和国联盟', value: 'SL  苏维埃社会主义共和国联盟' },
				{ label: 'SLWNY  斯洛文尼亚共和国', value: 'SLWNY  斯洛文尼亚共和国' },
				{ label: 'SLFK  斯洛伐克共和国', value: 'SLFK  斯洛伐克共和国' },
				{ label: 'SD  苏丹共和国', value: 'SD  苏丹共和国' },
				{ label: 'SMLN  圣马利诺共和国', value: 'SMLN  圣马利诺共和国' },
				{ label: 'STALB  沙特阿拉伯王国', value: 'STALB  沙特阿拉伯王国' },
				{ label: 'SMYDLG  萨摩亚独立国', value: 'SMYDLG  萨摩亚独立国' },
				{ label: 'SWSL  斯威士兰王国', value: 'SWSL  斯威士兰王国' },
				{ label: 'SLLA  塞拉利昂共和国', value: 'SLLA  塞拉利昂共和国' },
				{ label: 'SJZSCQZZ  世界知识产权组织国际局', value: 'SJZSCQZZ  世界知识产权组织国际局' },
				{ label: 'SJZSCQZZGJJ  世界知识产权组织国际局', value: 'SJZSCQZZGJJ  世界知识产权组织国际局' },
				{ label: 'SHLN  圣赫勒拿、阿森松与特里斯坦达库尼亚', value: 'SHLN  圣赫勒拿、阿森松与特里斯坦达库尼亚' },
				{ label: 'SMLLBGHG  索马里联邦共和国', value: 'SMLLBGHG  索马里联邦共和国' },
				{ label: 'SLMQD  所罗门群岛', value: 'SLMQD  所罗门群岛' },
				{ label: 'SJCHNWSLB  圣基茨和尼维斯联邦', value: 'SJCHNWSLB  圣基茨和尼维斯联邦' },
				{ label: 'SLXY  圣卢西亚', value: 'SLXY  圣卢西亚' },
				{ label: 'SBQD  萨巴群岛', value: 'SBQD  萨巴群岛' },
				{ label: 'SYSTXS  圣尤斯特歇斯', value: 'SYSTXS  圣尤斯特歇斯' },
				{ label: 'SMDD  荷属圣马丁岛', value: 'SMDD  荷属圣马丁岛' },
				{ label: 'SDMHPLXBMZGHG  圣多美和普林西比民主共和国', value: 'SDMHPLXBMZGHG  圣多美和普林西比民主共和国' },
				{ label: 'SEWDGHG  萨尔瓦多共和国', value: 'SEWDGHG  萨尔瓦多共和国' },
				{ label: 'SEWYGHG  塞尔维亚共和国', value: 'SEWYGHG  塞尔维亚共和国' },
				{ label: 'SWSTHGLNDS  圣文森特和格林纳丁斯', value: 'SWSTHGLNDS  圣文森特和格林纳丁斯' },
				{ label: 'TLNDHDBGGHG  特立尼达和多巴哥共和国', value: 'TLNDHDBGGHG  特立尼达和多巴哥共和国' },
				{ label: 'TSNYLHGHG  坦桑尼亚联合共和国', value: 'TSNYLHGHG  坦桑尼亚联合共和国' },
				{ label: 'TRDFGHG  马尔代夫共和国', value: 'TRDFGHG  马尔代夫共和国' },
				{ label: 'TWL  图瓦卢', value: 'TWL  图瓦卢' },
				{ label: 'TKMST  土库曼斯坦', value: 'TKMST  土库曼斯坦' },
				{ label: 'TKSHKKSQD  特克斯和凯科斯群岛', value: 'TKSHKKSQD  特克斯和凯科斯群岛' },
				{ label: 'TEKSHKKSQD  图尔卡斯和凯科斯群岛', value: 'TEKSHKKSQD  图尔卡斯和凯科斯群岛' },
				{ label: 'TJKST  塔吉克斯坦共和国', value: 'TJKST  塔吉克斯坦共和国' },
				{ label: 'TG  泰国', value: 'TG  泰国' },
				{ label: 'TNS  突尼斯共和国', value: 'TNS  突尼斯共和国' },
				{ label: 'TEQ  土耳其共和国', value: 'TEQ  土耳其共和国' },
				{ label: 'TEE  土尔耳', value: 'TEE  土尔耳' },
				{ label: 'TJWG  汤加王国', value: 'TJWG  汤加王国' },
				{ label: 'WGDGHG  乌干达共和国', value: 'WGDGHG  乌干达共和国' },
				{ label: 'WNRLBLWEGHG  委内瑞拉玻利瓦尔共和国', value: 'WNRLBLWEGHG  委内瑞拉玻利瓦尔共和国' },
				{ label: 'WL  文莱达鲁萨兰国', value: 'WL  文莱达鲁萨兰国' },
				{ label: 'WZBKST  乌兹别克斯坦共和国', value: 'WZBKST  乌兹别克斯坦共和国' },
				{ label: 'WNATGHG  瓦努阿图共和国', value: 'WNATGHG  瓦努阿图共和国' },
				{ label: 'WKL  乌克兰', value: 'WKL  乌克兰' },
				{ label: 'WLG  乌拉圭东岸共和国', value: 'WLG  乌拉圭东岸共和国' },
				{ label: 'WDMLGHG  危地马拉共和国', value: 'WDMLGHG  危地马拉共和国' },
				{ label: 'XYL  匈牙利', value: 'XYL  匈牙利' },
				{ label: 'XL  希腊共和国', value: 'XL  希腊共和国' },
				{ label: 'XBY  西班牙王国', value: 'XBY  西班牙王国' },
				{ label: 'XD  西德', value: 'XD  西德' },
				{ label: 'XXL  新西兰', value: 'XXL  新西兰' },
				{ label: 'XSHL  西撒哈拉', value: 'XSHL  西撒哈拉' },
				{ label: 'XLY  阿拉伯叙利亚共和国', value: 'XLY  阿拉伯叙利亚共和国' },
				{ label: 'XJP  新加坡共和国', value: 'XJP  新加坡共和国' },
				{ label: 'XSMY  萨摩亚独立国', value: 'XSMY  萨摩亚独立国' },
				{ label: 'YMNY  亚美尼亚共和国', value: 'YMNY  亚美尼亚共和国' },
				{ label: 'YL  伊朗伊斯兰共和国', value: 'YL  伊朗伊斯兰共和国' },
				{ label: 'YSGXD  英属根西岛', value: 'YSGXD  英属根西岛' },
				{ label: 'YSGMQD  英属盖曼群岛', value: 'YSGMQD  英属盖曼群岛' },
				{ label: 'YLKGHG  伊拉克共和国', value: 'YLKGHG  伊拉克共和国' },
				{ label: 'YSNYQD  英属纽英群岛', value: 'YSNYQD  英属纽英群岛' },
				{ label: 'YSZBLT  英属直布罗陀', value: 'YSZBLT  英属直布罗陀' },
				{ label: 'YDL  意大利共和国', value: 'YDL  意大利共和国' },
				{ label: 'YD  印度共和国', value: 'YD  印度共和国' },
				{ label: 'YSWEJQD  英属维尔京群岛', value: 'YSWEJQD  英属维尔京群岛' },
				{ label: 'YSWJNYQD  英属弗吉尼亚自治领', value: 'YSWJNYQD  英属弗吉尼亚自治领' },
				{ label: 'YSAKL  英属安奎拉', value: 'YSAKL  英属安奎拉' },
				{ label: 'YSCNQD  英属处女群岛', value: 'YSCNQD  英属处女群岛' },
				{ label: 'YSGEXD  英属根西岛', value: 'YSGEXD  英属根西岛' },
				{ label: 'YSSNQD  英属维尔京群岛', value: 'YSSNQD  英属维尔京群岛' },
				{ label: 'YMGHG  也门共和国', value: 'YMGHG  也门共和国' },
				{ label: 'YD  约旦哈希姆王国', value: 'YD  约旦哈希姆王国' },
				{ label: 'YSKMQD  开曼群岛', value: 'YSKMQD  开曼群岛' },
				{ label: 'YSXYDQD  英属西印度群岛', value: 'YSXYDQD  英属西印度群岛' },
				{ label: 'YG  英国', value: 'YG  英国' },
				{ label: 'YN  越南社会主义共和国', value: 'YN  越南社会主义共和国' },
				{ label: 'YMJ  牙买加', value: 'YMJ  牙买加' },
				{ label: 'YN  印度尼西亚共和国', value: 'YN  印度尼西亚共和国' },
				{ label: 'YSL  以色列国', value: 'YSL  以色列国' },
				{ label: 'YJLHXQD  海峡群岛', value: 'YJLHXQD  海峡群岛' },
				{ label: 'ZBYGHG  赞比亚共和国', value: 'ZBYGHG  赞比亚共和国' },
				{ label: 'ZFGHG  中非共和国', value: 'ZFGHG  中非共和国' },
				{ label: 'ZBLT  直布罗陀', value: 'ZBLT  直布罗陀' },
				{ label: 'ZXD  泽西岛', value: 'ZXD  泽西岛' },
				{ label: 'ZDGHG  乍得共和国', value: 'ZDGHG  乍得共和国' },
				{ label: 'ZGTW  中国台湾', value: 'ZGTW  中国台湾' },
				{ label: 'ZL  智利共和国', value: 'ZL  智利共和国' }
			],
			index: 0
		};
	},
	onLoad(e) {
		const that = this;
		//不显示分享按钮
		uni.hideShareMenu();
		if (!app.globalData.uid) {
			that.clearCache();
			that.gotoPage('user');
		}
		that.index = e.index - 1 < 0 ? 0 : e.index - 1;
		that.form.nameType = that.types[that.index].subject;
		uni.setNavigationBarTitle({
			title: e.id == 0 ? '新增申请人信息' : '编辑申请人信息'
		});
		if (e.id > 0) {
			that.id = e.id;
			that.get_sqr(e.id);
			that.mt45 = '';
		}		
	},
	// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	onShow() {
		this.uid = app.globalData.uid;		
	},
	methods: {
		change(e) {
			const that = this;
			uni.pageScrollTo({
				scrollTop: 0
			});
			that.index = e;
			that.companyFileList = [];
			that.companyFileForOtherList = [];
			that.idFileList = [];
			that.idFileForOtherList = [];
			that.form = {
				subject: '',
				address: '',
				companyNo: '',
				companyFile: '',
				linkName: '',
				linkPhone: '',
				linkZip: '',
				linkAddress: '',
				nameForOther: '',
				idType: '',
				passportNo: '',
				idFile: '',
				idFileForOther: '',
				companyFileForOther: '',
				region: '',
				addressForOther: '',
				nameType: that.types[e].subject
			};
		},
		get_sqr(id) {
			const that = this;
			that.http(
				app.globalData.ext.url2 + 'applicant/get_sqr?',
				{
					uid: app.globalData.uid,
					id: id,
					types: that.types[that.index].subject
				},
				function(res) {
					that.companyFileList = [{ url: app.globalData.ext.domain + res.data.data.companyFile }];
					that.companyFileForOtherList = [{ url: app.globalData.ext.domain + res.data.data.companyFileForOther }];
					that.idFileList = [{ url: app.globalData.ext.domain + res.data.data.idFile }];
					that.idFileForOtherList = [{ url: app.globalData.ext.domain + res.data.data.idFileForOther }];
					that.submitStatus = res.data.data.submitStatus;
					that.ok = res.data.data.submitStatus == 1 ? true : false;
					that.hide = false;
					that.form = res.data.data;
				},
				'/pages/user/applicant/form'
			);
		},
		set_sqr(e) {
			const that = this;
			that.$refs.uForm.validate(valid => {
				if (valid) {
					//验证通过
					that.http(
						app.globalData.ext.url2 + 'applicant/set_sqr?',
						{
							id: that.id,
							uid: app.globalData.uid,
							form: that.form
						},
						function(res) {
							that.showMsg(res.data.message, res.data.status);
							setTimeout(function() {
								uni.redirectTo({
									url: '/pages/user/applicant/index'
								});
							}, 1900);
						},
						'/pages/user/applicant/form',
						true,
						'操作中...'
					);
				}
			});
		},
		onUpload(e) {
			const that = this;
			if (e[0].error == false && e[0].progress == 100) {
				if (e[0].response.status == 'success') {
					that.hide = false;
					that.form[e[0].response.data.name] = e[0].response.data.url;
				}
			}
		},
		idTypeShowCall(e) {
			this.form.idType = '';
			this.form.idType = e[0].value;
		},
		regionShowCall(e) {
			this.form.region = '';
			this.form.region = e[0].value;
		}
	}
};
</script>
