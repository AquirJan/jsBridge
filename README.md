# jsBridge
javascript app bridge

公开function
```sh
window.jsBridge.detectPlatform()
````
#### return 'iOS', 'Android', or 'unknown'
```sh
window.jsBridge.version
```
#### return jsBridge version
```sh
window.jsBridge.sjapp()
```
#### return is sjapp or not (是否为盛杰app)

```sh
window.jsBridge.getUA()
```
#### return userAgent
```sh
window.jsBridge.callHandler({
	event:'openMotionShakeHandler',
	params:{
		'open':'1'
	},
	callback:function(rpdata){
		
	}
});
```
#### call app events
```sh
window.jsBridge.registerHandler({
	event:'motionShakeHandler',
	callback:function(_rpdata){
			console.log(_rpdata)
	}
});
```
#### register event use for app
