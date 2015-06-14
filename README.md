# dpd-mandrill

## Installation:

```
npm install https://github.com/mcollis/dpd-mandrill.git --save
```

## Prerequisitios
Mandrill account that can send mail - 
  -login to mandrill and create a template and API key at the very least.

## Setup:
first create a new resource and configure it with your account info - API Key, and default template name required.

then create a post event and add some javascript (required)
```
return true;
```

## Usage:

### Sending with dpd.js
```
var toObj = {
	to:[
			{
				email:"YOU@EMAIL.com",
				name:"lalal"
			},
			{
				email:"Me@EMAIL.com",
				name:"dada"
			}
		]

}
 dpd.mandrill.post(
 	toObj)
 	.then(function(results){ 
 		console.log("results: ", results) 
 	})
 	.fail(function(results){ 
 		console.log("err: ", err) 
 	});
```

### results:  
```
[
{ 
	Object_id: "8c582eeb4b8647fc9b0b09504eabd94c",
	email: "you@email.com",
	reject_reason: null,
	status: "sent"
},
{ 
	Object_id: "8c582eeb4b8647fc9b0b09504eabd94c",
	email: "me@email.com",
	reject_reason: null,
	status: "sent"
},
]
