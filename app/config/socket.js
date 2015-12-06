var Message = require('../models/message');
var configAuth = require('./auth.js');

module.exports = function(io, Twitter) {

   io.on('connection', function(socket) {

      // ***** On New Socket Connection *****

      Message.find({}, { _id: false, sender: true, body: true }, function(err, messages) {
        if (err) throw err;

        io.emit('chat history', {messages: messages});

     }).lean();


      // ***** New Message Event *****

      socket.on('new message', function(message) { // user sent a message in the chat

         console.log('New message from ' + message.sender + ": " + message.body);

         // Create a message object
         var newMessage = new Message();

         // Set all of the user data that we need
         newMessage.sender = message.sender;
         newMessage.body = message.body;

         // Save the message in the db
         newMessage.save(function(err, msg) {

            if (err) throw err;

            console.log("Message to Emit:" + msg);
            // Now send the message to everyone that is connected
            io.emit('message created', {sender: msg.sender, body: msg.body});

         });

      });

   });


};
