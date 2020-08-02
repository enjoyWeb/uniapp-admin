<template>
	<view>
		<gui-page :currents="[1,'articles']">
			<div slot="gui-body">
				<div class="gui-body-title gui-icons icon-title">文章管理 &gt; 添加文章</div>
				<div class="gui-body">
					<gui-editor @change="saveArticle"></gui-editor>
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
	methods:{
		saveArticle : function (e) {
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
			this.article.action = 'add';
			this.article.date   = this.getCurrentDate();
			uniCloud.callFunction({
				name:"grace_article",
				data:this.article
			}).then((res)=>{
				uni.hideLoading();
				uni.showToast({title:'添加成功'});
				setTimeout(()=>{
					uni.redirectTo({url:'./articles'});
				}, 1500);
			});
		},
		getCurrentDate :function(){
			var date = new Date();
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			m = m < 10 ? ('0' + m) : m;
			var d = date.getDate();
			d = d < 10 ? ('0' + d) : d;
			var h = date.getHours();
			h = h < 10 ? ('0' + h) : h;
			var minute = date.getMinutes();
			var second = date.getSeconds();
			minute = minute < 10 ? ('0' + minute) : minute;
			second = second < 10 ? ('0' + second) : second;
			return y + '' + m + '' + d + ''+ h +'' + minute + '' + second;
		}
	}
}
</script>
<style>
</style>