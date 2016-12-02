/* shengjie js bridge handler */
/* version 1.0.0 */
/* create at 2-5-2016 */
/* modify at 4-28-2016 */


;(function(_jsbHandler) {
	'use strict';
	_jsbHandler.detectPlatform = function(){
		var userAgent = navigator.userAgent || navigator.vendor || window.opera;
		if(/iPad|iPhone|iPod/.test(userAgent)){
			return 'iOS';
		}else if( /Android/.test(userAgent) ){
			return 'Android';
		}else{
			return 'unknown';
		}
	};
	
	_jsbHandler.version = '1.0.0'
	
	_jsbHandler.sjapp = function(){
		var userAgent = _jsbHandler.getUA();
		var uaReg = new RegExp('ljsmartcity|sjapp','g');
		var result = uaReg.test(userAgent);
		return result;
	}
	
	_jsbHandler.getUA = function(){
		var userAgent = navigator.userAgent || navigator.vendor || window.opera;
		return userAgent;
	};
	
	_jsbHandler.callHandler = function(_obj){
		_obj= _obj || {};
		_jsbHandler.params = _obj.params || {};
		_obj.event = _obj.event || 'null';
// 		console.log(_jsbHandler.sjapp());
		if(!_obj || _obj.event === 'null' || !_jsbHandler.sjapp()){
			return;
		}
		if(_jsbHandler.detectPlatform() == "iOS"){
			window.setupWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler(_obj.event, _obj.params, function responseCallback(rpdata) {
					_obj.callback ? _obj.callback(rpdata) : null;
				});
			});
		}else if(_jsbHandler.detectPlatform() == "Android" ){
			if (window.WebViewJavascriptBridge) {
				window.WebViewJavascriptBridge.callHandler(_obj.event, _obj.params, function(rpdata) {
					_obj.callback ? _obj.callback(rpdata) : null;
				});
			}
			document.addEventListener(
                    'WebViewJavascriptBridgeReady',
                    function() {
                    	window.WebViewJavascriptBridge.callHandler(_obj.event, _obj.params, function(rpdata) {
							_obj.callback ? _obj.callback(rpdata) : null;
						});
            		},
                false
            );
			
		}
		
	};
	
	_jsbHandler.domReady = function ( fn ) {

		// Sanity check
		if ( typeof fn !== 'function' ) return;

		// If document is already loaded, run method
		if (document.readyState === 'interactive' || document.readyState === 'complete') {
			fn();
		}
		// Otherwise, wait until document is loaded
		// The document has finished loading and the document has been parsed but sub-resources such as images, stylesheets and frames are still loading. The state indicates that the DOMContentLoaded event has been fired.
		document.addEventListener( 'DOMContentLoaded', fn, false );

		// Alternative: The document and all sub-resources have finished loading. The state indicates that the load event has been fired.
		// document.addEventListener( 'complete', fn, false );

	};
	
	_jsbHandler.registerHandler = function(_obj){
		_obj= _obj || {};
		_obj.event = _obj.event || 'null';
		_obj.myobj = _obj.myobj || {};
		_obj.rpcbcont = _obj.rpcbcont || 'response data content';
// 		console.log(_jsbHandler.sjapp());
		if(!_obj || _obj.event === 'null' || !_jsbHandler.sjapp()){
			return;
		}
		if(_jsbHandler.detectPlatform() == "iOS"){
			window.setupWebViewJavascriptBridge(function(bridge) {
				bridge.registerHandler(_obj.event, function(data, rpcallback){
					_obj.callback ? _obj.callback(data, _obj.myobj) : null;
					rpcallback(_obj.rpcbcont);
				});
			});
		}else if(_jsbHandler.detectPlatform() == "Android" ){
			// if (!window.WebViewJavascriptBridge) {
// 				return;
// 			}
// 			window.WebViewJavascriptBridge.registerHandler(_obj.event, function(rpdata, rpcallback){
// 				_obj.callback ? _obj.callback(rpdata, _obj.myobj) : null;
// 				_obj.rpcallback = rpcallback;
// 			});
			if (window.WebViewJavascriptBridge) {
                window.WebViewJavascriptBridge.registerHandler(_obj.event, function(data, rpcallback){
					_obj.callback ? _obj.callback(data, _obj.myobj) : null;
					rpcallback(_obj.rpcbcont);
				});
            } else {
                document.addEventListener(
                    'WebViewJavascriptBridgeReady'
                    , function() {
                       window.WebViewJavascriptBridge.registerHandler(_obj.event, function(data, rpcallback){
							_obj.callback ? _obj.callback(data, _obj.myobj) : null;
							rpcallback(_obj.rpcbcont);
						});
                    },
                    false
                );
            }
			
		}
	};
	
	_jsbHandler.init = function(){
		if(!_jsbHandler.sjapp()){
			return;
		}
		if(_jsbHandler.detectPlatform() == "iOS"){
			_jsbHandler.domReady(function(){
				console.log('jsb ios');
				window.setupWebViewJavascriptBridge = function(callback) {
					if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
					if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
					window.WVJBCallbacks = [callback];
					var WVJBIframe = document.createElement('iframe');
					WVJBIframe.style.display = 'none';
					WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
					document.documentElement.appendChild(WVJBIframe);
					setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
				}
			});
// 			window.addEventListener("load",function(){
				
				
// 			},false);
		}else if(_jsbHandler.detectPlatform() == "Android" ){
			_jsbHandler.domReady(function(){
				console.log('jsb android');
				if (window.WebViewJavascriptBridge) {
					window.WebViewJavascriptBridge.init(function(message, responseCallback) {
						responseCallback();
					});
				} else {
					document.addEventListener(
						'WebViewJavascriptBridgeReady'
						, function() {
							 window.WebViewJavascriptBridge.init(function(message, responseCallback) {
								responseCallback();
							});
						},
						false
					);
				}
			});
			
		}
	};
	_jsbHandler.init();
	
	return _jsbHandler;
})(window.jsBridge || (window.jsBridge = {}));
