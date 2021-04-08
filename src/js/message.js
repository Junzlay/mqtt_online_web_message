function toggle() {
    var messageContainer = document.querySelector('.fab-message');
    var toggleButton = messageContainer.querySelector('.fab-message__button a');
    var messageToggle = document.getElementById('fab-message-toggle');
    messageContainer.classList.toggle('is-open');
    toggleButton.classList.toggle('toggle-icon');                    
  }
  $(document).ready(function() {
   $("#chat-circle").click(function() {
     $(".send").focus();
    $("#chat-circle").toggle('scale');
    $(".chat-box").toggle('scale');
  })
  
  $(".chat-box-toggle").click(function() {
    $("#chat-circle").toggle('scale');
    $(".chat-box").toggle('scale');
  })

})