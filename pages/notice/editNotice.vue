<template>
	<view>
		<gui-page :currents="[1,'notice']">
			<div slot="gui-body">
				<div class="gui-body-title">编辑公告</div>
				<div class="gui-body">
					<form @submit="formSubmit">
						<table class="gui-table gui-table-noborder" cellpadding="0" cellspacing="0">
							<tbody>
								<tr>
									<td width="120">公告内容</td>
									<td><textarea class="gui-textarea" maxlength="-1" :value="notice.content" name="content" /></td>
								</tr>
								<tr>
									<td>发布时间</td>
									<td><input class="gui-input" :value="notice.date" name="date" /></td>
								</tr>
								<tr>
									<td></td>
									<td>
										<button type="primary" form-type="submit" class="gui-button" :loading="btnLoading">编辑公告</button>
									</td>
								</tr>
							</tbody>
						</table>
					</form>
				</div>
			</div>
		</gui-page>
	</view>
</template>
<script>
var graceChecker = require("../../graceForUNICloud/graceChecker.js");
export default {
	data() {
		return {
			notice : {},
			id : '',
			btnLoading : false
		}
	},
	onLoad:function(options){
		this.id = options.id;
		// 加载公告数据做默认值
		uni.showLoading({mask:true});
		uniCloud.callFunction({
			name:"grace_notice",
			data:{id:options.id, action:'get'}
		}).then((res)=>{
			uni.hideLoading();
			this.notice = res.result.data[0];
		});
	},
	methods:{
		formSubmit:function (e) {
			//定义表单规则
			var rule = [
				{name:"content", checkType : "string", checkRule:"5,",  errorMsg:"公告至少6个字符"},
				{name:"date", checkType : "string", checkRule:"6,",  errorMsg:"请正确填写发布日期"}
			];
			var formData = e.detail.value;
			var checkRes = graceChecker.check(formData, rule);
			if(!checkRes){
				uni.showToast({ title: graceChecker.error, icon: "none" });
				return ;
			}
			formData.id = this.id;
			formData.action = 'edit';
			// 提交表单
			uni.showLoading({mask:true});
			this.btnLoading = true;
			uniCloud.callFunction({
				name:"grace_notice",
				data:formData
			}).then((res)=>{
				uni.hideLoading();
				uni.showToast({
					title:'数据修改成功'
				});
				uni.navigateBack({});
			});
		}
	}
}
</script>
<style>
</style>