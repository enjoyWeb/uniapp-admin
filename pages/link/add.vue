<template>
	<view>
		<gui-page :currents="[1,'link']">
			<div slot="gui-body">
				<div class="gui-body-title">添加链接</div>
				<div class="gui-body">
					<form @submit="formSubmit">
						<table class="gui-table gui-table-noborder" cellpadding="0" cellspacing="0">
							<tbody>
								<tr>
									<td width="120">淘宝链接</td>
									<td><textarea class="gui-textarea" maxlength="-1" value="" name="link" /></td>
								</tr>
								<tr>
									<td>指定刷手</td>
									<td>
										<picker @change="bindPickerChange" :value="userindex" range-key="telephone" :range="userArray">
											<text>{{userArray[userindex] && userArray[userindex].telephone}}</text>
											<text style="margin-left:10px;" class="gui-icons icon-jt-down"></text>
										</picker>
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
var graceDate = require("../../graceForUNICloud/graceDate.js");
export default {
	data() {
		return {
			notice : {},
			id : '',
			btntext : '发布链接',
			btnLoading : false,
			userArray : [],
			userindex : 0
		}
	},
	onLoad:function(options){
		var currentDateTime = graceDate.currentTime('str2');
		this.date = currentDateTime;
		this.getUserData()
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
			const telephone = this.userArray[this.userindex].telephone
			if(!checkRes){
				uni.showToast({ title: graceChecker.error, icon: "none" });
				return ;
			} else if (!telephone) {
				uni.showToast({ title: '请指定刷手', icon: "none" });
				return ;
			}
			formData.action = 'add';
			formData.code = this.userArray[this.userindex].code
			this.btnLoading = true;
			// 提交表单
			uni.showLoading({mask:true});
			uniCloud.callFunction({
				name:"grace_links",
				data:{
					...formData,
					telephone
				}
			}).then((res)=>{
				uni.hideLoading();
				uni.showToast({title:'发布成功'});
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