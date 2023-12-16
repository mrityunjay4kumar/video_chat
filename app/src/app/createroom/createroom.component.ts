import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Peer from 'peerjs';
import { io } from 'socket.io-client';
//import uuidv4 from 'u'
import {v4 as uuidv4} from 'uuid';
import { uuid } from 'uuidv4';
@Component({
  selector: 'app-createroom',
  templateUrl: './createroom.component.html',
  styleUrls: ['./createroom.component.css']
})
export class CreateroomComponent implements OnInit {

  @ViewChild('videoElement')
  videoElement!: ElementRef<HTMLVideoElement>;
  private socket: any;
  title = 'app';
 // roomid="";
   roomid = "1"
   message = '';
   peer: any
   chat: any;
   stream: any;
   userid = "";
  constructor(){
    this.peer = new Peer();
  }
  ngOnInit() {
   //; //uuidv4();
   this.peer.on('open', (id : any) => {
    console.log("id---->", id);
    this.userid = id;
   })


   this.peer.on('call', (_call: any) =>  {

    _call.answer(this.stream); // Answer the call with an A/V stream.
    _call.on('stream', (remoteStream: any) => {
      // Show stream in some video/canvas element.
      console.log("call",remoteStream)
    });
  })

    this.socket = io('http://localhost:3000');
    this.socket.on('room-created', (roomid: any) => {
      this.roomid = roomid["roomId"];
      console.log('room-created:', roomid);
      // Handle user connected event (e.g., add user to the UI)
  });
  this.socket.on('get-users', (users: any) => {
    console.log('get-users:', users);
    // Handle user connected event (e.g., add user to the UI)
});
  this.socket.on('get-message', (chat: any) => {
    this.chat = chat.meassage
    console.log('get-message', chat);
    // Handle user connected event (e.g., add user to the UI)
});

this.socket.on('joined-user', (userId: any) => {
console.log("joined-user")
  
  var call = this.peer.call(userId, this.stream);
  call.on('stream', (remoteStream: any) => {
    console.log("stream",remoteStream)
    // Show stream in some video/canvas element.
  }, (err: any) =>  {
  console.log('Failed to get local stream' ,err);
});





  // const call =  this.peer.call(userId, this.stream);
  // call.on('remoteStream', (remoteStream: any)=> {
  //   console.log("--->",userId, remoteStream)
  //  // call.answer(this.stream)
  // })
  // this.peer.on('call', (call: any)=> {
  //   call.answer(this.stream)
  //   console.log()
  //   call.on('remoteStream', (remoteStream: any)=> {
  //     console.log(call.peer, remoteStream)
  //    // call.answer(this.stream)
  //   })
  // })

//  console.log('get-message', chat);
  // Handle user connected event (e.g., add user to the UI)
//   if(this.peer){
//     navigator.mediaDevices.getUserMedia({ video: true , audio: true})
// .then((stream: MediaStream) => {
//   this.stream= stream;
//   this.videoElement.nativeElement.srcObject = stream;
//   const call =  this.peer.call(userId, this.stream);
//   call.on('remoteStream', (remoteStream: any)=> {
//     console.log(userId, remoteStream)
//    // call.answer(this.stream)
//   })
//   this.peer.on('call', (_call: any)=> {
//     _call.answer(this.stream)
//     _call.on('remoteStream', (remoteStream: any)=> {
//       console.log(_call.peer, remoteStream)
//      // call.answer(this.stream)
//     })
//   })
// })
// .catch((error: any) => {
//   console.error('Error accessing webcam:', error);
// });


  
// //     let conn = this.peer.connect(userId, this.chat);
// // // on open will be launch when you successfully connect to PeerServer
// //     conn.on('open', () =>{
// //       // here you have conn.id
// //       conn.send(this.chat);
// //     });

// //     this.peer.on('connection', function(conn: any) {
// //       conn.on('data', function(data: any){
// //         // Will print 'hi!'
// //         console.log("connection----->",data);
// //       });
// //     });
//   }
});

 
}


  oncreateRoom(){
  
    this.socket.emit('create-room', this.roomid);
   
 
  }

  onjoinRoom(){
  //  const userid = uuidv4();
   //this.peer = new Peer();
    this.socket.emit('join-room', {
    roomId: this.roomid, 
    userId: this.userid}
    );

    
      navigator.mediaDevices.getUserMedia({ video: true , audio: true})
.then((stream: MediaStream) => {
this.stream= stream;
this.videoElement.nativeElement.srcObject = stream;

})
.catch((error: any) => {
console.error('Error accessing webcam:', error);
});

  
//   this.socket.on('message', (chat: any) => {
//     console.log('onjoinRoom:', chat);
//     // Handle user connected event (e.g., add user to the UI)
// });
  }

  sendMessage(){
    this.socket.emit('add-message',
      this.roomid,
      this.message 
    ) ;
  //   this.socket.on('message', (chat: any) => {
  //     console.log('sendMessage:', chat);
  //     // Handle user connected event (e.g., add user to the UI)
  // });                                     
  }

}
