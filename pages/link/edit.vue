<template>
	<view>
		<gui-page :currents="[1,'link']">
			<div slot="gui-body">
				<div class="gui-body-title">编辑链接</div>
				<div class="gui-body">
					<form @submit="formSubmit">
						<table class="gui-table gui-table-noborder" cellpadding="0" cellspacing="0">
							<tbody>
								<tr>
									<td width="120">淘宝链接</td>
									<td><textarea class="gui-textarea" maxlength="-1" :value="link" name="link" /></td>
								</tr>
								<tr>
									<td>刷手</td>
									<td>
										<text>{{telephone}}</text>
									</td>
								</tr>
								<tr>
									<td></td>
									<td>
										<button type="primary" form-type="submit" class="gui-button" :loading="btnLoading">{{btntext}}</button>
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
			link: '',
			telephone: '',
			btntext : '编辑链接',
			btnLoading : false
		}
	},
	onLoad:function(options){
		this.id = options.id
		this.telephone = options.telephone
		this.link = options.link
	},
	methods:{
		formSubmit:function (e) {
			// 通过按钮文本防止重复提交
			if(this.btnLoading){return ;}
			//定义表单规则
			var rule = [
				{name:"link", checkType : "notnull", errorMsg:"请填写淘宝链接"}
			];
			var formData = e.detail.value;
			var checkRes = graceChecker.check(formData, rule);
			if(!checkRes){
				uni.showToast({ title: graceChecker.error, icon: "none" });
				return ;
			}
			formData.action = 'edit';
			this.btnLoading = true;
			// 提交表单
			uni.showLoading({mask:true});
			uniCloud.callFunction({
				name:"grace_links",
				data:{
					...formData,
					id: this.id,
					telephone: this.telephone
				}
			}).then((res)=>{
				uni.hideLoading();
				uni.showToast({title:'编辑成功'});
				setTimeout(()=>{
					uni.redirectTo({url:'./link'});
				}, 1500);
			});
		},
		getUserData : function () {
			uni.showLoading({});
			uniCloud.callFunction({
				name:"grace_users",
				data:{ action : 'getAllActive' }
			}).then((res)=>{
				uni.hideLoading();
				console.log(res);
				this.userArray = res.result.data;
			});
		},
		bindPickerChange: function(e) {
			this.userindex = e.target.value
		}
	}
}
</script>
<style>

</style>