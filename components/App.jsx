import React, {Component} from 'react';
import ChannelSection from './channels/ChannelSection.jsx';
import UserSection from './users/UserSection.jsx';
import MessageSection from './messages/MessageSection.jsx';

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      channels: [],
      users: [],
      messages: [],
      activeChannel: {},
      connected: false
    };
  }

  componentDidMount(){
    let ws = this.ws = new WebSocket('ws://echo.websocket.org')
    ws.onmessage = this.message.bind(this);
    ws.onopen = this.open.bind(this);
    ws.onclose = this.close.bind(this);
  }

  message(e){
    const event = JSON.parse(e.data);
    if(event.name === 'channel add'){
      this.newChannel(event.data);
    }
  }

  open(){
    this.setState({connected: true});
  }

  close(){
    this.setState({connected: false});
  }

  onMessageAdd(message){
     let {messages} = this.state;
     messages.push(message);
     this.setState({messages});
   }
   onRemoveUser(removeUser){
     let {users} = this.state;
     users = users.filter(user => {
       return user.id !== removeUser.id;
     });
     this.setState({users});
   }
   onAddUser(user){
     let {users} = this.state;
     users.push(user);
     this.setState({users});
   }
   onEditUser(editUser){
     let {users} = this.state;
     users = users.map(user => {
       if(editUser.id === user.id){
         return editUser;
       }
       return user;
     });
     this.setState({users});
   }

  newChannel(channel){
    let {channels} = this.state;
    channels.push(channel);
    this.setState({channels});
  }
  addChannel(name) {
    let {channels} = this.state;
    // TO DO: SEND TO SERVER
    let msg = {
      name: 'channel add',
      data: {
        id: channels.length,
        name
      }
    }
    this.ws.send(JSON.stringify(msg))
  }

  setChannel(activeChannel){
    this.setState({activeChannel});
    //TO DO: GET CHANNELS MESSAGES
  }

  setUserName(name){
    let {users} = this.state;
    users.push({id: users.length, name});
    this.setState({users});
    //TO DO : SEND TO SERVER
  }

  addMessage(body){
    let {messages, users} = this.state;
      let createdAt = new Date;
      let author = users.length > 0 ? users[0].name : 'anonymous';
      messages.push({id: messages.length, body, createdAt, author});
      this.setstate({messages});
      //TO DO: SEND TO SERVER
  }

  render() {
    return (
      <div className='app'>
        <div className='nav'>
          <ChannelSection
            {...this.state}
            addChannel={this.addChannel.bind(this)}
            setChannel={this.setChannel.bind(this)}
          />
          <UserSection
            {...this.state}
            setUserName={this.setUserName.bind(this)}
          />
        </div>
        <MessageSection
          {...this.state}
          addMessage={this.addMessage.bind(this)}
        />
      </div>


    )
  }
}

export default App
