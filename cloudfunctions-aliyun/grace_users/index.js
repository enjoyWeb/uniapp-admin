'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
exports.main = async (event, context) => {
	const collection = db.collection('grace_users');
	// 增
	if(event.action == "add"){
		// 判断是否已经有存在该手机号的用户
		var res = await collection.where({telephone : dbCmd.eq(event.telephone)}).get();
		console.log(res)
		if (res.affectedDocs > 0) {
			if (res.data[0] && res.data[0].flag === 2) { // 重新提交审核
				await collection.doc(res.data[0].id).remove();
				delete event.action;
				const code = event.telephone.substring(event.telephone.length - 4) + (new Date()).getTime();
				const createtime = getCurrentTime()
				var res = await collection.add({ ...event, code, createtime });
				return {status: 'error', msg: '重新注册认证提交成功，请耐心等待...'}
			} else {
				return {status: 'error', msg: '已存在该账号，请使用手机号码直接登录'}
			}
		} else {
			delete event.action;
			const code = event.telephone.substring(event.telephone.length - 4) + (new Date()).getTime();
			const createtime = getCurrentTime()
			var res = await collection.add({ ...event, code, createtime });
			return res;
		}
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
		var res = await collection.doc(event.id).update({ ...event, updatetime});
		return res;
	}
	// 查 - 列表
	else if(event.action == "getList"){
		// 获取公告总数
		var total =  await collection.where({_id : dbCmd.neq('')}).count();
		// 获取公告列表
		var start = (event.page - 1) * event.everpagenumber;
		var res = await collection.orderBy('telephone','desc').skip(start).limit(event.everpagenumber).get();
		return [total, res];
	}
	// 查 - 所有数据
	else if(event.action == "getAllActive"){
		const res = await collection.where({flag: 1}).get();
		return res;
	}
	// 查 - 单条
	else if(event.action == "get"){
		const res = await collection.where({code: dbCmd.eq(event.code)}).get();
		return res;
	}
	// 登录 - 获取用户信息
	else if(event.action == "login"){
		const res = await collection.where({telephone: dbCmd.eq(event.telephone), password: dbCmd.eq(event.password)}).get();
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