<template>
	<view>
		<gui-page :currents="[1,'link']">
			<div slot="gui-body">
				<div class="gui-body-title">
					链接管理
					<text @tap="addNotice">+ 发布链接</text>
					<text @tap="getData">刷新</text>
				</div>
				<div class="gui-body">
					<div class="gui-tips">刷手已完成的淘宝链接，需要将该链接下架。发布淘宝链接需指定刷手。</div>
					<table class="gui-table" cellpadding="0" cellspacing="0" style="margin-top:20px;">
						<thead>
							<tr>
								<td width="60" align="center" @tap="seleclAll" style="cursor:pointer;">{{checkAllBtnTxt}}</td>
								<td>刷手</td>
								<td>淘宝链接</td>
								<td>发布时间</td>
								<td>状态</td>
								<td><text class="gui-icons icon-remove" @tap="removeMore" style="cursor:pointer; color:#3688FF;">批量删除</text></td>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item, index) in datas" :key="index">
								<td align="center">
									<view class="justify-center">
										<gui-checker :checked="checkedIds[index].checkstatus" :disabled="checkedIds[index].disabled" @change="changeStatus" :parameter="[index]"></gui-checker>
									</view>
								</td>
								<td>{{item.telephone}}</td>
								<td>{{item.link}}</td>
								<td>{{item.createtime}}</td>
								<td><text :class="item.flag ? 'red' : 'green'">{{item.flag | filterStatus}}</text></td>
								<td>
									<text v-if="!item.flag" class="gui-do-btns gui-icons icon-remove" @tap="downlink(item._id);">下架</text>
									<text class="gui-do-btns gui-icons icon-edit" @tap="gotoEdit(item);">编辑</text>
									<text v-if="item.flag" class="gui-do-btns gui-icons icon-remove" @tap="deleteData(item._id)">删除</text>
								</td>
							</tr>
						</tbody>
					</table>
					<div>
						<gui-pager v-if="total > 1" :total="total" :everpagenumber="everpagenumber" :currentPage="currentPage" @pageChange="pageChange"></gui-pager>
					</div>
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
			everpagenumber : 10,
			datas:[],
			// 记录选中的id 格式 {数据id : 选中状态}
			checkedIds : [],
			// 全选文本
			checkAllBtnTxt : '全选'
		}
	},
	onShow:function(){
		this.getData();
	},
	filters: {
		filterStatus(val) {
			return val ? '已下架' : '已上架'
		}
	},
	methods:{
		// 跳转到添加页
		addNotice : function () {
			uni.redirectTo({
				url:"./add"
			})
		},
		// 页码切换事件
		pageChange:function (e) {
			this.currentPage = e;
			this.getData();
		},
		// 数据列表加载
		getData : function () {
			uni.showLoading({});
			uniCloud.callFunction({
				name:"grace_links",
				data:{page:this.currentPage, everpagenumber : this.everpagenumber, action : 'getList'}
			}).then((res)=>{
				uni.hideLoading();
				console.log(res);
				this.total = res.result[0].total;
				this.datas = res.result[1].data;
				// 初始化选择状态
				var checkedIds = [];
				this.datas.forEach((item,index)=>{
					checkedIds.push({index:index, checkstatus:false, disabled: !item.flag})
				});
				this.checkedIds = checkedIds;
			});
		},
		// 编辑数据
		gotoEdit : function(data){
			uni.navigateTo({
				url:'./edit?id='+data._id+'&telephone='+data.telephone+'&link='+data.link
			});
		},
		// 删除数据
		deleteData : function(id){
			uni.showModal({
				title:"确认要删除数据吗?",
				success: (e) => {
					if (!e.confirm){return ;}
					uni.showLoading({mask:true});
					uniCloud.callFunction({
						name:"grace_links",
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
				}
			})
		},
		downlink : function(id) {
			uniCloud.callFunction({
				name:"grace_links",
				data:{id, flag: 1, action:'edit'}
			}).then((res)=>{
				console.log(res);
				uni.hideLoading();
				if(res.success){
					uni.showToast({
						title:"链接已下架"
					});
					this.getData();
				}
			});
		},
		// 选择按钮事件
		changeStatus : function (e) {
			this.checkedIds.splice(e[1][0],1,{index:e[1][0], checkstatus:e[0]});
			// 检查是否已经全选
			var checkedAll = true;
			for(let i = 0; i < this.checkedIds.length; i++){
				if(!this.checkedIds[i].checkstatus){checkedAll = false; break;}
			}
			this.checkAllBtnTxt = checkedAll ? '反选' : '全选';
		},
		// 全选及反选处理
		seleclAll : function(){
			if(this.checkAllBtnTxt == '全选'){
				this.checkedIds.forEach((item,index)=>{
					this.changeStatus([true,[index]]);
				});
				this.checkAllBtnTxt = "反选"
			}else{
				this.checkedIds.forEach((item,index)=>{
					this.changeStatus([false,[index]]);
				});
				this.checkAllBtnTxt = "全选"
			}
		},
		// 批量删除
		removeMore : function () {
			var needRemoveIds = [];
			for(let i = 0; i < this.checkedIds.length; i++){
				if(this.checkedIds[i].checkstatus){
					needRemoveIds.push(this.datas[this.checkedIds[i].index]._id);
				}
			}
			if(needRemoveIds.length < 1){
				uni.showToast({
					title:"您没有选择任何数据",
					icon:"none"
				});
				return ;
			}
			uni.showModal({
				title:"确认要删除数据吗?",
				success: (e) => {
					if (!e.confirm){return ;}
					uni.showLoading({mask:true});
					uniCloud.callFunction({
						name:"grace_links",
						data:{id:needRemoveIds,action:'delete'}
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
				}
			})
		}
	}
}
</script>
<style>
.red {
	color: red;
}
.green {
	color: green;
}
</style>