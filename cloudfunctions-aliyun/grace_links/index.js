'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {
	const collection = db.collection('grace_links');
	// 增
	if(event.action == "add"){
		delete event.action;
		const createtime = getCurrentTime()
		var res = await collection.add({...event, createtime, flag: 0});
		return {status : 'ok', msg: 'ok'};
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
		const updatetime = getCurrentTime()
		var res = await collection.doc(event.id).update({...event, updatetime});
		return res;
	}
	// 查 - 列表
	else if(event.action == "getList"){
		// 获取淘宝链接总数
		var total =  await collection.where({_id : dbCmd.neq('')}).count();
		// 获取淘宝链接列表
		var start = (event.page - 1) * event.everpagenumber;
		var res = await collection.orderBy('createtime','desc').skip(start).limit(event.everpagenumber).get();
		return [total, res];
	}
	// 查 - 某用户所有数据
	else if(event.action == "getUserAll"){
		const res = await collection.where({code: event.code}).get();
		return res;
	}
	// 查 - 单条
	else if(event.action == "get"){
		const res = await collection.doc(event.id).get();
		return res;
	}
}
function getCurrentTime(){
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
	return y + '-' + m + '-' + d + ' '+ h +':' + minute + ':' + second;
}