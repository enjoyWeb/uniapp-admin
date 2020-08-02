<template>
	<view>
		<gui-page :currents="[0, 'index']">
			<div slot="gui-body">
				<div class="gui-body-title gui-icons icon-title">系统首页</div>
				<div class="gui-body">
					<table class="gui-table" cellpadding="0" cellspacing="0">
						<colgroup>
							<col width="150">
							<col>
						</colgroup>
						<thead>
							<tr>
								<td>相关配置</td>
								<td>详细信息</td>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>系统版本</td>
								<td>Admin 1.0.0</td>
							</tr>
							<tr>
								<td>系统用途</td>
								<td>系统管理后台</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</gui-page>
	</view>
</template>
<script>
export default {
	data() {
		return {
			
		}
	}
}
</script>
<style>

</style>