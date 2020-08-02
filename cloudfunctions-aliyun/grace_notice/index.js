'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {
	const collection = db.collection('grace_notices');
	// 增
	if(event.action == "add"){
		delete event.action;
		var res = await collection.add(event);
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
		var res = await collection.doc(event.id).update(event);
		return res;
	}
	// 查 - 列表
	else if(event.action == "getList"){
		// 获取公告总数
		var total =  await collection.where({_id : dbCmd.neq('')}).count();
		// 获取公告列表
		var start = (event.page - 1) * event.everpagenumber;
		var res = await collection.orderBy('date','desc').skip(start).limit(event.everpagenumber).get();
		return [total, res];
	}
	// 查 - 单条
	else if(event.action == "get"){
		const res = await collection.doc(event.id).get();
		return res;
	}
}