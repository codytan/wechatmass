var dTool = {
	app_name: "",
	curr_url: "",
	token_id: "",
	fakes: [],
	select_num: 0,
	send_num: 0,
	send_time_id: null,
	login_status: 0,
	send_text: '',

	sendContent: function(){
		
		if (dTool.login_status != 1) {
			alert("登录异常，请刷新页面重试！");
			return false;
		}
		
		dTool.send_text = $("#text_msg").val();
		if (dTool.send_text.length <= 0) {
			alert("请填写发送内容！");
			return false;
		}
		
		dTool.send_num = 0;
		dTool.getFakes();
		
		if(dTool.select_num <= 0) {
			alert("请选择需要发送的用户！");
			return false;
		}
		
		dTool.displayProcess();
		
		dTool.send_time_id = window.setInterval("dTool.sendMsg()", 2000);
			
	},
	
	sendMsg: function() {
		var fakeid = dTool.fakes[dTool.send_num];
		
		if (dTool.send_num >= dTool.select_num) {
			alert('发送完成，共发送 ' + dTool.send_num + ' 个用户!');
			window.clearInterval(dTool.send_time_id);
			$("#text_btn").attr("disabled", false);
			return false;
		}
		
		$.ajaxSetup({
		    'beforeSend': function(xhr) {xhr.setRequestHeader("xf", "https://mp.weixin.qq.com/cgi-bin/singlesendpage?t=message/send&action=index&tofakeid=" + fakeid + "&token=" + dTool.token_id + "&lang=zh_CN");
		    }});
		
	
	   $.post("https://mp.weixin.qq.com/cgi-bin/singlesend?t=ajax-response&lang=zh_CN", { type: "1", content: dTool.send_text, error: false, token: dTool.token_id, tofakeid: fakeid, ajax: 1, imgcode: "" },
			   function(data){
			     //alert("Data Loaded: " + data);
			     dTool.send_num++;
			     $("#send_num").text(dTool.send_num);
	   });	
	},
	
	displayProcess: function() {
		$("#send_process").html("<span id='send_num'>0</span> / <span id='total_num'>" + dTool.select_num + "</span>");
		
		$("#text_btn").attr("disabled", true);
	},
	
	login: function() {
		if (!dTool.app_name) {
			alert("帐号异常，请联系技术支持！");
			return false;
		}

	   $.get("http://115.29.168.135/wechat/api.php", { mt: 'login', app_name: dTool.app_name },
			   function(data){

		   var resp_info = jQuery.parseJSON(data);

			  if (resp_info.errno > 0) {
				  alert("帐号异常，请联系技术支持！");
				  return false;
			  }
			  
			  dTool.login_status = 1;
			  dTool.displayTextMsg();
			  return true;
	   });
	},
	
	displayBtn: function() {
		
		$("#allGroup").after(' 显示：<select id="pagechange"><option value="10">10</option><option value="50">50</option><option value="100">100</option><option value="200">200</option><option value="500">500</option></select>个用户  &nbsp;&nbsp;<input id="testsend" type="button" value="群发" /> <div id="msgdialog" style="display:none;"> <p>select user num: <span id="send_num"></span> / <span id="select_num"></span></p> <p><textarea id="sendcontent"></textarea></p> </div>');
	
		$(".main_bd").before('<div class="main_bd"><div id="wechat_cont"></div><div class="clr"></div></div>');
	},
	listenBtn: function() {
		$("#testsend").click(function (){
			dTool.login();
		});	
		
		$("#pagechange").change(function (){
			
			var pagesize = this.value;
			var new_url = dTool.curr_url.replace(/pagesize=([^&]+)/, 'pagesize=' + pagesize);
			window.location.replace(new_url);
		});
	},
	
	getFakes: function() {
		dTool.fakes = [];
		
		$('input[class="frm_checkbox js_select"]:checked').each(function(){
			var fakeid = this.value;
			dTool.fakes.push(fakeid);
		});		
		dTool.select_num = dTool.fakes.length;
	},
	
	displayTextMsg: function() {
		
		$("#wechat_cont").html('<p>消息内容：<textarea id="text_msg" cols="100" rows="8" /></p> <input type="button" id="text_btn" style="margin-top:10px;padding:0 6px;" value="批量发送" /><div id="send_process" style="font-size:30px;"></div>');
		
		$("#text_btn").click(function (){
			dTool.sendContent();
		});
	},
	
	init: function() {
		dTool.app_name = $(".nickname").text();
		
		dTool.curr_url = $(location).attr('href');
		dTool.token_id = dTool.curr_url.match(/token=([^&]+)/)[1];
	}		
};

$(document).ready(function() {
	dTool.init();
	dTool.displayBtn();
	dTool.listenBtn();
});


