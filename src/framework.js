// function getUrlVars() {
    // var vars = {};
    // var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        // vars[key] = value;
    // });
    // return vars;
// }

// var contactSearchCallback;
// var setLang = getUrlVars()["lang"];

window.Framework = {
    config: {
        name:"ExampleGitHubAppHAHA",
        clientIds: {
            'mypurecloud.com': '',
            'mypurecloud.ie': '',
            'mypurecloud.com.au': '',
            'mypurecloud.jp': '',
            'mypurecloud.de': '',
			'usw2.pure.cloud': '1f479b8c-21bd-4115-807c-acb90bdeabea'
        },
		// getUserLanguage: function (callback) {
        // callback(setLang);
		// },
		customInteractionAttributes: ['LangSelect','RecordingLink','DNIS','InteractionID'],
        settings: {
            embedWebRTCByDefault: true,
            hideWebRTCPopUpOption: false,
            enableCallLogs: true,
            enableTransferContext: true,
            hideCallLogSubject: true,
            hideCallLogContact: false,
            hideCallLogRelation: false,
            searchTargets: ['people', 'queues', 'frameworkcontacts'],
		//	callControls: ["pickup", "transfer", "mute", "disconnect"],
            theme: {
                primary: '#d4cebd',
                text: '#123'
            }
        }
    },

    initialSetup: function () {
        window.PureCloud.subscribe([
            {
                type: 'Interaction', 
                callback: function (category, interaction) {
                    window.parent.postMessage(JSON.stringify({type:"interactionSubscription", data:{category:category, interaction:interaction}}) , "*");
                }  
            },
            {
                type: 'UserAction', 
                callback: function (category, data) {
                    window.parent.postMessage(JSON.stringify({type:"userActionSubscription", data:{category:category, data:data}}) , "*");
                }  
            },
            {
                type: 'Notification', 
                callback: function (category, data) {
                    window.parent.postMessage(JSON.stringify({type:"notificationSubscription", data:{category:category, data:data}}) , "*");
                }  
            }
        ]);

        window.addEventListener("message", function(event) {
            try {
                var message = JSON.parse(event.data);
                if(message){
                    if(message.type == "clickToDial"){
                        window.PureCloud.clickToDial(message.data);
                    } else if(message.type == "addAssociation"){
                        window.PureCloud.addAssociation(message.data);
                    }else if(message.type == "addAttribute"){
                        window.PureCloud.addCustomAttributes(message.data);
					
                    }else if(message.type == "addTransferContext"){
                        window.PureCloud.addTransferContext(message.data);
                    }else if(message.type == "sendContactSearch"){
                        if(contactSearchCallback) {
                            contactSearchCallback(message.data);
                        }
                    }else if(message.type == "updateUserStatus"){
                        window.PureCloud.User.updateStatus(message.data);
                    }else if(message.type == "updateInteractionState"){
                        window.PureCloud.Interaction.updateState(message.data);
                    }else if(message.type == "setView"){
                        window.PureCloud.User.setView(message.data);
                    }else if(message.type == "updateAudioConfiguration"){
                        window.PureCloud.User.Notification.setAudioConfiguration(message.data);
                    }else if(message.type == "sendCustomNotification"){
                        window.PureCloud.User.Notification.notifyUser(message.data);
                    }
                }
            } catch {
                //ignore if you can not parse the payload into JSON
            }
        });
    },
    screenPop: function (searchString, interaction) {
        window.parent.postMessage(JSON.stringify({type:"screenPop", data:{searchString:searchString, interactionId:interaction}}) , "*");
    },
    processCallLog: function (callLog, interaction, eventName, onSuccess, onFailure) {
        window.parent.postMessage(JSON.stringify({type:"processCallLog" , data:{callLog:callLog, interactionId:interaction, eventName:eventName}}) , "*");
        var success = true;
        if (success) {
            onSuccess({
                id: callLog.id || Date.now()
            });
        } else {
            onFailure();
        }
    },
    openCallLog: function(callLog, interaction){
        window.parent.postMessage(JSON.stringify({type:"openCallLog" , data:{callLog:callLog, interaction:interaction}}) , "*");
    },
    contactSearch: function(searchString, onSuccess, onFailure) {
        contactSearchCallback = onSuccess;
        window.parent.postMessage(JSON.stringify({type:"contactSearch" , data:{searchString:searchString}}) , "*");
    }
};




