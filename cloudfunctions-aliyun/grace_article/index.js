'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {
	const collection = db.collection('grace_articles');
	// 增
	if(event.action == "add"){
		delete event.action;
		event.date = getCurrentDate();
		var res = await collection.add(event);
		return {status : 'ok', msg: 'ok', res:res};
	}
	// 删
	else if(event.action == "delete"){
		var idType = typeof(event.id);
		if(idType == "string"){event.id = [event.id];}
		for(let i = 0; i < event.id.length; i++){
			await collection.doc(event.id[i]).remove();
		}
		return {status:'ok', msg: 'ok'};
	}
	// 改
	else if(event.action == "edit"){
		delete event.action;
		var res = await collection.doc(event.id).update(event);
		return res;
	}
	// 查 - 列表
	else if(event.action == "getList"){
		// 获取总数
		var total =  await collection.where({_id : dbCmd.neq('')}).count();
		// 获取列表
		var start = (event.page - 1) * event.everpagenumber;
		var res = await collection.orderBy('date','desc').skip(start).limit(event.everpagenumber).get();
		return [total, res];
	}
	// 查 - 单条
	else if(event.action == "get"){
		const res = await collection.doc(event.id).get();
		return res;
	}
	// 前端查询， 配合条件 分类 + 分页
	else if(event.action == "getListForApp"){
		// 条件检查
		if(!event.page){event.page = 1;}
		if(!event.cate){return 'empty';}
		// 获取列表
		var start = (event.page - 1) * 6;
		var res = await collection.where({cate : dbCmd.eq(event.cate)}).orderBy('date','desc').skip(start).limit(6).get();
		res.page = event.page;
		return res;
	}
}
function getCurrentDate(){
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