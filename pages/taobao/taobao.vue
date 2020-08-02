<template>
	<view>
		<gui-page :currents="[1,'taobao']">
			<div slot="gui-body">
				<div class="gui-body-title">
					刷手管理
					<text @tap="getData">刷新</text>
				<!-- <text @tap="addNotice">+ 发布任务</text> -->
				</div>
				<div class="gui-body">
					<div class="gui-tips">查看和审核刷手</div>
					<table class="gui-table" cellpadding="0" cellspacing="0" style="margin-top:20px;">
						<thead>
							<tr>
								<td width="60" align="center" @tap="seleclAll" style="cursor:pointer;">{{checkAllBtnTxt}}</td>
								<td>手机号码</td>
								<td>接单编号</td>
								<td>淘宝号</td>
								<td>银行卡号</td>
								<td>审核状态</td>
								<td>登录密码</td>
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
								<td>{{item.code}}</td>
								<td>{{item.taobao}}</td>
								<td>{{item.bankcard}}</td>
								<td><text :class="item.flag | filterClass">{{item.flag | filterStatus}}</text></td>
								<td>{{item.password}}</td>
								<td>
									<text v-if="!item.flag" class="gui-do-btns gui-icons" @tap="success(item._id);">审核通过</text>
									<text v-if="!item.flag" class="gui-do-btns gui-icons" @tap="gotoEdit(item._id);">审核不通过</text>
									<!-- <text class="gui-do-btns gui-icons icon-edit" @tap="gotoEdit(item._id);">编辑</text> -->
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
		filterClass(val) {
			if (val === 1) {
				return 'green'
			} else if (val === 2) {
				return 'red'
			} else {
				return 'yellow'
			}
		},
		filterStatus(val) {
			if (val === 1) {
				return '审核通过'
			} else if (val === 2) {
				return '审核不通过'
			} else {
				return '待审核'
			}
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
				name:"grace_users",
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
		// 审核通过
		success : function(id){
			uniCloud.callFunction({
				name:"grace_users",
				data:{
					action: 'edit',
					id,
					flag: 1
				}
			}).then((res)=>{
				uni.hideLoading();
				uni.showToast({
					title:'操作成功'
				});
				this.getData();
			});
		},
		// 编辑数据
		gotoEdit : function(id){
			uni.navigateTo({
				url:'./edit?id='+id
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
						name:"grace_users",
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
						name:"grace_users",
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
.yellow {
	color: #ebb336;
}
.red {
	color: red;
}
.green {
	color: green;
}
</style>