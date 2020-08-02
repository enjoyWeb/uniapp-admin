<template>
	<view>
		<gui-page :currents="[1,'taobao']">
			<div slot="gui-body">
				<div class="gui-body-title">审核不通过原因</div>
				<div class="gui-body">
					<form @submit="formSubmit">
						<table class="gui-table gui-table-noborder" cellpadding="0" cellspacing="0">
							<tbody>
								<tr>
									<td width="120">具体原因</td>
									<td><textarea class="gui-textarea" name="reason" /></td>
								</tr>
								<tr>
									<td></td>
									<td>
										<button type="primary" form-type="submit" class="gui-button" :loading="btnLoading">提交</button>
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
			id : '',
			btnLoading : false
		}
	},
	onLoad:function(options){
		this.id = options.id;
	},
	methods:{
		formSubmit:function (e) {
			//定义表单规则
			var rule = [
				{name:"reason", checkType : "notnull",  errorMsg:"请填写具体原因"},
			];
			var formData = e.detail.value;
			var checkRes = graceChecker.check(formData, rule);
			if(!checkRes){
				uni.showToast({ title: graceChecker.error, icon: "none" });
				return ;
			}
			formData.id = this.id;
			formData.action = 'edit';
			formData.flag = 2;
			// 提交表单
			uni.showLoading({mask:true});
			this.btnLoading = true;
			uniCloud.callFunction({
				name:"grace_users",
				data: formData
			}).then((res)=>{
				uni.hideLoading();
				uni.showToast({
					title:'提交成功'
				});
				setTimeout(()=>{
					uni.redirectTo({url:'./taobao'});
				}, 1500);
			});
		}
	}
}
</script>
<style>
</style>