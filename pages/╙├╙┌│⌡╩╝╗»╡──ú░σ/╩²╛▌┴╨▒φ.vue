<template>
	<view>
		<gui-page :currents="[0,'--']">
			<div slot="gui-body">
				<div class="gui-body-title gui-icons icon-title">管理 &gt; 列表<text @tap="add">+ 添加</text></div>
				<div class="gui-body">
					<div class="gui-tips"> (:</div>
					<table class="gui-table" cellpadding="0" cellspacing="0" style="margin-top:20px;">
						<thead>
							<tr>
								<td>-</td>
								<td>-</td>
								<td>操作</td>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item, index) in datas" :key="index">
								<td>{{item.*}}</td>
								<td>{{item.*}}</td>
								<td>
									<text class="gui-do-btns gui-icons icon-edit" @tap="gotoEdit(item._id);">编辑</text>
									<text class="gui-do-btns gui-icons icon-remove" @tap="deleteData(item._id)">删除</text>
								</td>
							</tr>
						</tbody>
						<div>
							<gui-pager v-if="total > 1" :total="total" :everpagenumber="everpagenumber" :currentPage="currentPage" @pageChange="pageChange"></gui-pager>
						</div>
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
			currentPage : 1,
			total : 0,
			everpagenumber : 2,
			datas:[],
		}
	},
	methods:{
		// 跳转到添加页
		add : function () {
			uni.redirectTo({ url:"./add" });
		},
		gotoEdit : function(id){
			uni.navigateTo({ url:'./edit?id='+id });
		},
		getData : function(){
			/*
			uni.showLoading({});
			uniCloud.callFunction({
				name:"grace_managers",
				data:{action:"get"}
			}).then((res)=>{
				uni.hideLoading();
				console.log(res);
				this.datas = res.result.data;
			});
			*/
		},
		// 删除数据
		deleteData : function(id){
			uni.showModal({
				title:"确认要删除数据吗?",
				success: (e) => {
					if (!e.confirm){return ;}
					/*
					uni.showLoading({mask:true});
					uniCloud.callFunction({
						name:"grace_notice",
						data:{id:id, action:'delete'}
					}).then((res)=>{
						console.log(res);
						uni.hideLoading();
						if(res.result.status == 'ok'){
							uni.showToast({
								title:"数据已经删除"
							});
							this.getData();
						}
					});
					*/
				}
			})
		},
	},
	onShow:function(){
		this.getData();
	}
}
</script>
<style>

</style>