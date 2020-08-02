<template>
	<view class="grace-editor">
		<table class="gui-table" cellpadding="0" cellspacing="0">
			<colgroup>
				<col width="120">
				<col>
			</colgroup>
			<tbody>
				<tr>
					<td>文章标题</td>
					<td><textarea class="grace-editor-title" v-model="article.title" @input="titleInput" placeholder="# 请输入标题" auto-height /></td>
				</tr>
				<tr>
					<td>文章分类</td>
					<td>
						<picker @change="bindPickerChange" :value="classesIndex" :range="classes" style="padding:10px;">
							<text>{{article.cate}}</text><text style="margin-left:10px;" class="gui-icons icon-jt-down"></text>
						</picker>
					</td>
				</tr>
				<tr>
					<td>文章内容</td>
					<td>
						<!-- 内容区域 -->
						<!-- 选项类型选择 -->
						<view class="grace-editor-menus">
							<view class="grace-editor-icons gui-icons" data-type="txt" @tap="graceEditorAddItem">&#xe9e4;</view>
							<view class="grace-editor-icons gui-icons" data-type="center" @tap="graceEditorAddItem">&#xe621;</view>
							<view class="grace-editor-icons gui-icons" data-type="img" @tap="graceEditorAddItem">&#xe63d;</view>
							<view class="grace-editor-icons gui-icons" data-type="quote" @tap="graceEditorAddItem">&#xe620;</view>
							<view class="grace-editor-icons gui-icons" data-type="strong" @tap="graceEditorAddItem">&#xe640;</view>
							<view class="grace-editor-icons gui-icons" data-type="link" @tap="graceEditorAddItem">&#xe61e;</view>
							<view class="grace-editor-icons gui-icons" data-type="spline" @tap="graceEditorAddItem">&#xe61b;</view>
						</view>
						<view style="padding:20px; line-height:50px; background-color:#F8F8F8;" v-if="article.contents.length < 1">请点击上面的类型按钮添加文章内容 (:</view>
						<view v-for="(item, index) in article.contents" :key="index" class="grace-editor-items">
							<!-- 普通文本 -->
							<textarea class="grace-editor-txt" maxlength="-1" :data-index="index" v-if="item.type == 'txt'" 
							@input="graceEditorInput" :value="item.content" placeholder="# 请在此处输入文本内容" auto-height />
							<!-- 居中标题 -->
							<input type="text" class="grace-editor-center" maxlength="-1" :data-index="index" 
							@input="graceEditorInput" :value="item.content" placeholder="# 输入居中题目" v-else-if="item.type == 'center'" />
							<!-- 图片 -->
							<view class="grace-editor-img-wrap" v-else-if="item.type == 'img'">
								<image :src="item.content" class="grace-editor-img" :data-index="index" mode="widthFix" @tap="deleteItem"></image>
							</view>
							<!-- 引用 -->
							<textarea class="grace-editor-quote" maxlength="-1" :data-index="index" v-else-if="item.type == 'quote'" 
							@input="graceEditorInput" :value="item.content" placeholder="# 请在此处输入引用内容" auto-height />
							<!-- 加粗 -->
							<textarea class="grace-editor-strong" :data-index="index" maxlength="-1" v-else-if="item.type == 'strong'" 
							@input="graceEditorInput" :value="item.content" placeholder="# 请在此处输入加粗内容" auto-height />
							<!-- 链接 -->
							<input type="text" class="grace-editor-link" :data-index="index" v-else-if="item.type == 'link'" 
							@input="graceEditorInput" :value="item.content" placeholder="# 输入连接地址" />
							<!-- 分割 -->
							<text class="grace-editor-spline" :data-index="index" @tap="deleteItem" v-else-if="item.type == 'spline'">● ● ●</text>
						</view>
					</td>
				</tr>
				<tr>
					<td>文章标签</td>
					<td><textarea class="grace-editor-title" v-model="article.tags" @input="tagInput" placeholder="# 请在此处输入标签,多个使用逗号隔开" auto-height /></td>
				</tr>
			</tbody>
		</table>
	</view>
</template>
<script>
export default{
	data() {
		return {
			article : {title:'', tags:'', tags:'', contents:[], cate:'请选择'},
			classesIndex : 0,
			classes : ['']
		}
	},
	created:function(){
		// 获取文章分类
		uniCloud.callFunction({
			name:"grace_article_classes",
			data:{}
		}).then((res)=>{
			var res = res.result;
			this.classes = res;
		});
	},
	methods:{
		bindPickerChange : function (e) {
			this.classesIndex = e.target.value;
			this.article.cate = this.classes[this.classesIndex];
			this.returnArt();
		},
		titleInput : function(e){
			this.article.title = e.detail.value;
			this.returnArt();
		},
		tagInput : function(e){
			this.article.tags = e.detail.value;
			this.returnArt();
		},
		graceEditorAddItem : function(e){
			var type = e.currentTarget.dataset.type;
			if(type == 'img'){
				uni.chooseImage({
					success:(e)=>{
						var imgs = e.tempFilePaths;
						for(let i = 0; i < imgs.length; i++){
							this.article.contents.push({type:type,content:imgs[i]});
						}
						this.returnArt();
					}
				});
			}else{
				this.article.contents.push({type:type,content:''});
				this.returnArt();
			}
		},
		graceEditorInput : function(e){
			var index = e.currentTarget.dataset.index;
			var val   = e.detail.value;
			if(val == ''){
				this.article.contents.splice(index, 1);
			}else{
				this.article.contents[index].content = val;
			}
			this.returnArt();
		},
		deleteItem : function(e){
			var index = e.currentTarget.dataset.index;
			uni.showModal({
				title:"提示",
				content:"确定要删除项目吗?",
				success:(e)=>{
					if(e.confirm){this.article.contents.splice(index, 1); this.returnArt();}
				}
			})
		},
		returnArt : function(){
			this.$emit('change', this.article);
		},
		setError : function(index){
			this.article.contents[index].error = true;
			this.article.contents.splice(index, 1, this.article.contents[index]);
		},
		setDefault : function (article) {
			for(let i = 0; i < article.contents.length; i++){
				var item = article.contents[i]; 
				if(item.type == 'img'){
					item.uploaded = 'ok';
					article.contents.splice(i,1,item);
				}
			}
			this.article = article;
		}
	}
}
</script>
<style>
/* 编辑器 */
.grace-editor{padding:0;}
.grace-editor-title{padding:5px 0; width:100%; font-size:18px; font-weight:bold; line-height:60px; background:none; color:#555555;}
.grace-editor-menus{background-color:#F8F8F8; border-top:1px solid #F1F2F3; display:flex; flex-direction:row;}
.grace-editor-icons{height:40px; color:#666666; width:40px; line-height:40px; text-align:center; font-size:16px !important;}
.grace-editor-items{margin:5px 0; display:flex; flex-direction:row;}
.grace-editor-txt{background:none; border:none; font-size:14px; line-height:36px; margin:5rpx 0; width:100%;}
.grace-editor-center{background:none; text-align:center; border:none; font-size:15rpx; color:#333333; line-height:50px; border-bottom:1px solid #F5F6F8; font-weight:bold; width:50%; margin:0 auto;}
.grace-editor-img-wrap{width:500px; overflow:hidden;  margin:10px 0; position:relative; font-size:0;}
.grace-editor-img{width:100%;}
.grace-editor-img-error{position:absolute; left:0; top:0; background-color:rgba(0,0,0,0.5); display:flex; flex-direction:column; align-items:center; justify-content:center;}
.grace-editor-img-error-text{font-size:28rpx; margin:0 15rpx; color:#FFFFFF;}
.grace-editor-quote{border:none; margin:8px 0; border-radius:6px; color:#333333; background:#F8F8F8; line-height:38px; padding:10px 1%; font-size:14px; line-height:25px; width:98%;}
.grace-editor-strong{background:none; font-weight:bold; border:none; font-size:14px; line-height:36px; margin:5px 0;}
.grace-editor-link{background:none; border:none; font-size:14px; line-height:36px; margin:5rpx; color:#007AFF;}
.grace-editor-spline{line-height:30px; text-align:center; color:#8788A3; font-size:16px; opacity:0.6; width:100%;}
.gui-table td{padding:5px 10px;}
</style>