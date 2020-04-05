<template>
	<div>
		<beautiful-chat
		  :participants="participants"
		  :titleImageUrl="titleImageUrl"
		  :onMessageWasSent="onMessageWasSent"
		  :messageList="messageList"
		  :newMessagesCount="newMessagesCount"
		  :isOpen="isChatOpen"
		  :close="closeChat"
		  :icons="icons"
		  :open="openChat"
		  :showEmoji="true"
		  :showFile="true"
		  :showTypingIndicator="showTypingIndicator"
		  :colors="colors"
		  :alwaysScrollToBottom="alwaysScrollToBottom"
		  :messageStyling="messageStyling"
		  @onType="handleOnType"
		  @edit="editMessage" />
	</div>
</template>
<script>

import "@babel/polyfill"
import Ws from '@adonisjs/websocket-client'
const ws = Ws('ws://localhost:3333')
import CloseIcon from 'vue-beautiful-chat/src/assets/close-icon.png'
import OpenIcon from 'vue-beautiful-chat/src/assets/logo-no-bg.svg'
import FileIcon from 'vue-beautiful-chat/src/assets/file.svg'
import CloseIconSvg from 'vue-beautiful-chat/src/assets/close.svg'
export default {
    name: 'app',
    data() {
        return {
        	token: null,
        	chat: null,
            icons: {
                open: {
                    img: OpenIcon, name: 'default',
                },
                close: {
                    img: CloseIcon, name: 'default',
                },
                file: {
                    img: FileIcon, name: 'default',
                },
                closeSvg: {
                    img: CloseIconSvg, name: 'default',
                },
            },
            me:{},
            participants: [], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
            titleImageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
            messageList: [], // the list of the messages to show, can be paginated and adjusted dynamically
            newMessagesCount: 0,
            isChatOpen: true, // to determine whether the chat window should be open or closed
            showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
            colors: {
                header: {
                    bg: '#2185D0', text: '#ffffff'
                },
                launcher: {
                    bg: '#4e8cff'
                },
                messageList: {
                    bg: '#ffffff'
                },
                sentMessage: {
                    bg: '#2185D0', text: '#ffffff'
                },
                receivedMessage: {
                    bg: '#eaeaea', text: '#222222'
                },
                userInput: {
                    bg: '#f4f7f9', text: '#565867'
                }
            }, // specifies the color scheme for the component
            alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
            messageStyling: true // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
        }
    },
    created () {
    	this.token = localStorage.getItem('tweetr-token');
        this.initializeChat()
        this.fetchParticipants()
        this.fetchYourself()
        this.$bus.$on('LogoutEvent',this.handleCloseConnect)
    },
    methods: {
    	fetchParticipants () {
    		const token = this.token
    		let that = this
    		axios.get(`users/all`, {
	            headers: {
	              Authorization: `Bearer ${token}`
	            }
          	}).then(response => {
          		response.data.data.forEach(function(item){
					that.participants.push(
			            {
		                	id: item.id, name: item.name, imageUrl: item.avatar, is_online: item.status
		            	}
		            )
				});
          		
          	})
    	},
    	fetchYourself () {
    		const token = this.token
    		let that = this
    		axios.get(`account/me`, {
	            headers: {
	              Authorization: `Bearer ${token}`
	            }
          	}).then(response => {
          		that.me = {
            		id: response.data.data.id, name: response.data.data.name, imageUrl: response.data.data.avatar
        		}
          	})
    	},
        handleCloseConnect () {
            let chat = this.chat
            chat.emit('logout:user')
            ws.close()
        },
        initializeChat () {
            ws.withJwtToken(this.token).connect()
            this.chat = ws.subscribe('chat')
            let chat = this.chat 
            chat.on('ready',() => {
                chat.emit('new:user')
            })
            chat.on('new:user', (user) => {
                this.findParticipants(user,true)
            })
            chat.on('type:chat', (event) => {
                this.receiMessage(event)
            })
            chat.on('logout:user', (user) => {
                this.findParticipants(user,false)
            })
        },
        onMessageWasSent (message) {
        	message.id = this.me.id
        	message.name = this.me.name
    		let chat = this.chat
            // called when the user sends a message
            this.messageList = [ ...this.messageList,message]
            chat.emit('type:chat', {
			  	message
			})
        },
        receiMessage : function(msg){
        	let that = this
        	this.messageList.push({
				type: msg.message.type,
                author: msg.message.id,
                id: msg.message.id,
                data: msg.message.type == 'emoji' ? { emoji : msg.message.data.emoji } : { text : msg.message.data.text }
            })
			
        },
        openChat () {
            // called when the user clicks on the fab button to open the chat
            this.isChatOpen = true 
            this.newMessagesCount = 0
        },
        closeChat () {
            // called when the user clicks on the botton to close the chat
            this.isChatOpen=false
        },
        handleScrollToTop () {
            // called when the user scrolls message list to top
            // leverage pagination for loading another page of messages
        },
        handleOnType () {
            console.log('Emit typing event')
        },
        editMessage(message) {
            const m = this.messageList.find(m=>m.id===message.id);
            m.isEdited=true;
            m.data.text=message.data.text;
        },
        findParticipants (user,status) {
            let that = this
            this.participants.forEach(function(value,i){
                if (value.id == user.id) {
                    that.$set(that.participants[i],'is_online',status)
                }
            })
        }
    }
}
</script>