<template>
	<view>
		<gui-page :currents="[0,'managers']">
			<div slot="gui-body">
				<div class="gui-body-title">添加管理员</div>
				<div class="gui-body">
					<div class="gui-tips">用户名唯一性后端完成校验 (:</div>
					<form @submit="formSubmit">
					<table class="gui-table gui-table-noborder" cellpadding="0" cellspacing="0" style="margin-top:20px;">
						<tbody>
							<tr>
								<td class="gui-text-center" width="150">用户名</td>
								<td><input type="text" name="username" class="gui-input" style="width:300px;" /></td>
							</tr>
							<tr>
								<td class="gui-text-center">登录密码</td>
								<td><input type="password" name="password" class="gui-input" style="width:300px;" /></td>
							</tr>
							<tr>
								<td class="gui-text-center">确认密码</td>
								<td><input type="password" name="pwdre" class="gui-input" style="width:300px;" /></td>
							</tr>
							<tr>
								<td class="gui-text-center">角色选择</td>
								<td>
									<picker @change="bindPickerChange" :value="roleindex" :range="roleArray">
										<text>{{roleArray[roleindex]}}</text><text style="margin-left:10px;" class="gui-icons icon-jt-down"></text>
									</picker>
								</td>
							</tr>
							<tr>
								<td></td>
								<td>
									<button type="primary" form-type="submit" class="gui-button" :loading="btnLoading">{{btnTxt}}</button>
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
var roleSed = 'no';
export default {
	data() {
		return {
			roleArray : [],
			roleindex : 0,
			roleDatas : [],
			btnTxt:"创建管理员",
			btnLoading : false
		}
	},
	onLoad:function(){
		// 加载权限
		uni.showLoading({});
		uniCloud.callFunction({
			name:"grace_role",
			data:{action:"get"}
		}).then((res)=>{
			uni.hideLoading();
			this.roleDatas = res.result.data;
			for(let i = 0; i < this.roleDatas.length; i++){
				this.roleArray.push(this.roleDatas[i].role_name);
			}
		});
	},
	methods:{
		formSubmit:function (e) {
			if(this.btnLoading){return ;}
			//定义表单规则
			var rule = [
				{name:"username", checkType : "string", checkRule:"5,",  errorMsg:"用户名至少5个字符"},
				{name:"password", checkType : "string", checkRule:"6,",  errorMsg:"密码至少6个字符"},
				{name:"pwdre", checkType : "samewith", checkRule:"password",  errorMsg:"两次密码输入不一致"}
			];
			var formData = e.detail.value;
			var checkRes = graceChecker.check(formData, rule);
			if(!checkRes){
				uni.showToast({ title: graceChecker.error, icon: "none" });
				return ;
			}
			var roleId = this.roleDatas[this.roleindex]._id;
			formData.role = roleId;
			delete formData.pwdre;
			formData.action = 'add';
			
			this.btnLoading = true;
			uni.showLoading({mask:true});
			uniCloud.callFunction({
				name:"grace_managers",
				data:formData
			}).then((res)=>{
				var res = res.result;
				if(res.status == 'ok'){
					this.btnTxt = "操作成功";
					uni.redirectTo({
						url:'./managers'
					});
				}else{
					this.btnLoading = false;
					uni.showToast({
						title:res.msg,
						icon:"none"
					});
				}
			});
		},
		bindPickerChange: function(e) {
			this.roleindex = e.target.value
		}
	}
}
</script>
<style>

</style>