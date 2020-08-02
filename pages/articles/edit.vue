<template>
	<view>
		<gui-page :currents="[1,'articles']">
			<div slot="gui-body">
				<div class="gui-body-title gui-icons icon-title">文章管理 &gt; 添加文章</div>
				<div class="gui-body">
					<gui-editor @change="saveArticle" ref="guieditor"></gui-editor>
					<view style="padding:20px 0px;">
						<button type="primary" class="gui-button" style="float:right;" :loading="btnLoading" @tap="formSubmit">提交文章</button>
					</view>
				</div>
			</div>
		</gui-page>
	</view>
</template>
<script>
var graceDate = require("../../graceForUNICloud/graceDate.js");
export default {
	data() {
		return {
			btnLoading : false,
			article: {title:'', tags:'', tags:'', contents:[]}
		}
	},
	onLoad:function(options){
		this.id = options.id;
		// 加载公告数据做默认值
		uni.showLoading({mask:true});
		uniCloud.callFunction({
			name:"grace_article",
			data:{id:options.id, action:'get'}
		}).then((res)=>{
			console.log(res);
			uni.hideLoading();
			this.article = res.result.data[0];
			this.$refs.guieditor.setDefault(this.article);
		});
	},
	methods:{
		saveArticle : function (e) {
			console.log(e);
			this.article = e;
		},
		formSubmit:function(e){
			if(this.btnLoading){return false;}
			if(this.article.title.length < 1){ uni.showToast({ title:"请填写文章标题", icon:"none" }); return ; }
			if(this.article.contents.length < 1){ uni.showToast({ title:"请填写文章内容", icon:"none" }); return ; }
			// 完成图片上传
			this.btnLoading = true;
			uni.showLoading({title:"", mask:true});
			this.upLoadImg(0);
		},
		upLoadImg : function(step){
			if(!step){step = 0;}
			// 上传完毕
			if(step > this.article.contents.length - 1){this.submit(); return ;}
			// 是否为图片
			if(this.article.contents[step].type != 'img'){this.upLoadImg(step+1); return ;}
			// 图片是否已经上传或是默认值
			if( this.article.contents[step].uploaded){
				this.upLoadImg(step+1); return ;
			}
			uniCloud.uploadFile({
				filePath         : this.article.contents[step].content,
				cloudPath        :  graceDate.currentTime('str2')+".png",
				success          : (res)=>{
					this.article.contents[step].content =  res.fileID;
					this.upLoadImg(step+1);
				},
				complete         : () => {}
			});
		},
		submit : function(){
			this.article.action = 'edit';
			this.article.id  = this.article._id;
			console.log(this.article);
			delete this.article._id;
			uniCloud.callFunction({
				name:"grace_article",
				data:this.article
			}).then((res)=>{
				uni.hideLoading();
				uni.showToast({title:'编辑成功'});
				setTimeout(()=>{
					uni.redirectTo({url:'./articles'});
				}, 1500);
			});
		}
	}
}
</script>
<style>
</style>