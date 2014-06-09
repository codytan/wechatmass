chrome.webRequest.onBeforeSendHeaders.addListener(
		  function(details) {
			
		    for (var i = 0; i < details.requestHeaders.length; ++i) {
		    	
		    	console.log(details.requestHeaders[i]);
	
		      if (details.requestHeaders[i].name === 'xf') {
		    	  
		    	  var fromReferer = details.requestHeaders[i].value;
		    	  
		    	  for (var i = 0; i < details.requestHeaders.length; ++i) {
		    		  
				      if (details.requestHeaders[i].name === 'Referer') {
				    	  
				    	  details.requestHeaders[i].value = fromReferer;
				    	  break;
				      }
		    	  }
		    	  
		        break;
		      }
		
		    }
		    
		    var new_headers = [];
		    for (var i = 0; i < details.requestHeaders.length; ++i) {
		    	if (details.requestHeaders[i].name == 'xf') continue;
		    	
		    	new_headers.push(details.requestHeaders[i]);
		    }
		    
		    return {requestHeaders: new_headers};
		  },
		  {urls: ["https://mp.weixin.qq.com/cgi-bin/singlesend*"]},
		  ["blocking", "requestHeaders"]
);