# dpd-mandrill

## Installation:

```
npm install https://github.com/mcollis/dpd-mandrill.git --save
```

## Prerequisitios
Mandrill account that can send mail - 
  -login to mandrill and create a template and API key at the very least.

## Setup:
first create a new mandrill resource and configure it with your account info - API Key, and default template name required.

then create a post event and add some javascript (required)
```
if (!internal) cancel(); // only get hit from internal requests
```

## Usage:

### Sending from serverside resource

1. Create a *sendmail resource*

```
let message = ctx.body;

// { from: 'examplesender@gmail.com',
//   to: 'examplerecipiant@gmail.com',
//   cc: '',
//   bcc: '',
//   subject: 'subject',
//   body:'body' }

// must use a mandrill template
// HTML template is  *|HTML|*
// text template is *|TEXT|*

message.to = [
	{email: message.to}
]

message.text = message.body
message.html = message.body.replace("\n", "<br />");

message.global_merge_vars = [ 
	{ 
		name: "text",
		content:  message.text
	},
	{ 
		name: "html",
		content:  message.html
	},
];

// console.log("sending message: ", message)
$addCallback();
dpd.mandrill.post(message, function(results, err){ 
	console.log("results: ", results)
	if(results && results[0].status  === "sent"){
		ctx.done(null, {message: "sent", status: 200} )
	} else {
		console.log("err: ", err)
		cancel("couldnt send email", 500)
	}

	$finishCallback();
})
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


### a react method

``` 
this.state = {
      emailMessage: {
        from: FROM,
        to: TO,
        cc: "",
        bcc: "",
        subject: SUBJECT,
        body: BODY
      }
```

```

  handleSendMail = event => {
    event.preventDefault();
    console.log("email message", this.state.emailMessage)

    dpd.sendmail.post(this.state.emailMessage, (response, err)=>{
      if(response.message == "sent"){
        this.setSuccessMessage("Email sent!")
      } else {
        this.setErrorMessage("Couldn't send email ", err || response.message)
      }

    })
  }

```
