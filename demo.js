var endpoint, activeConversation, previewMedia;

window.accessToken = "TWILIO ACCESS TOKEN";

endpoint = new Twilio.Endpoint(accessToken);
endpoint.listen().then(
  endpointConnected,
  function(error) {
    console.log(error.message);
  }
);

function endpointConnected() {
  endpoint.on('invite', function(invite) {
    invite.accept().then(conversationStarted);
  });

  document.getElementById('button-invite').onclick = function() {
    var inviteTo = document.getElementById('invite-to').value;

    if (activeConversation) {
      activeConversation.invite(inviteTo);
    } else {
      var options = {};
      if (previewMedia) {
        options.localMedia = previewMedia;
      }
      endpoint.createConversation(inviteTo, options).then(
        conversationStarted,
        function(error) {
          console.log('unable to create convo', error);
        }
      );
    }
  }
}

function conversationStarted(conversation) {
  activeConversation = conversation;
  if (!previewMedia) {
    conversation.localMedia.attach('#local-media');
  }
  conversation.on('participantConnected', function(participant) {
    participant.media.attach('#remote-media');
  });
}


document.getElementById('button-preview').onclick = function() {
  if (!previewMedia) {
    previewMedia = new Twilio.LocalMedia();
    Twilio.getUserMedia().then(
      function(mediaStream) {
        previewMedia.addStream(mediaStream);
        previewMedia.attach('#local-media');
      },
      function(error) {
        console.log('unable to access mic and camera', error);
      }
    );
  }
}
