<template>
	<view>
		<gui-page :currents="[1,'**']">
			<div slot="gui-body">
				<div class="gui-body-title gui-icons icon-title">**管理 &gt; 添加**</div>
				<div class="gui-body">
					<div class="gui-tips"> (:</div>
					<form @submit="formSubmit">
					<table class="gui-table gui-table-noborder" cellpadding="0" cellspacing="0">
						<tbody>
							<tr>
								<td class="gui-text-center" width="150">单行文本</td>
								<td><input type="text" name="inut1" class="gui-input" /></td>
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
export default {
	data() {
		return {
			btnLoading : false
		}
	},
	methods:{
		formSubmit:function(e){
			console.log(e);
			// 表单验证请参考公告添加页面
			// 接收表单数据
			var formData = e.detail.value;
			// 如果某些表单元素是保持咋某个变量内的，可以用下面的方式将其补充到 formData
			// formData.XXX = XXX;
			// 自己完成表单提交后的交互工作
		}
	}
}
</script>
<style>

</style>