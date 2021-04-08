$(document).ready(function() {
$("#error_message").hide()
var connect=false;

    $client = mqtt.connect('wss://test.mosquitto.org:8081/mqtt')

    $client.on('message', function(topic,payload) {
        if(topic!=$('#topic').val()){
            $(".chat-logs").append("<div class='chat-msg user'><span class='msg-avatar'><img src='https://i.pinimg.com/474x/10/91/94/1091948c6b80b65b9eef8c163f0ae42a.jpg'></span><div class='cm-msg-text wrap'>"+payload+"<p class='small' style='font-size: 9.5px;height: 12px;margin: 0;'>"+dateFormat(new Date(), "h:MM TT")+" | "+topic+"</p></div></div>")
            $(".chat-logs").animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);    
            
        }else{
            $(".chat-logs").append("<div class='chat-msg self '><span class='msg-avatar'><img src='https://wallpaperaccess.com/full/4595683.jpg'></span><div class='cm-msg-text wrap'>"+payload+"<p class='small' style='font-size: 9.5px;height: 12px;margin: 0;'>"+dateFormat(new Date(), "h:MM TT")+" | "+topic+"</p></div></div>")
             $(".chat-logs").animate({ scrollTop: $(".chat-logs")[0].scrollHeight}, 1000);    
        
        }
        
    })
   
    $(".connect").click(function(){
        if(!connect){
            $(this).html("Connecting...").addClass($(".connect").hasClass("btn-danger")?$(".connect").addClass("btn-info").removeClass("btn-danger"):$(".connect").addClass("btn-info"))
            $client.on('connect', function() {
                $(".connect").html("Connected").addClass($(".connect").hasClass("btn-info")?$(".connect").addClass("btn-success").removeClass("btn-info"):$(".connect").addClass("btn-danger"))
                connect=true
            })
        }else{
                $(this).html("Disconnecting").removeClass("btn-success").addClass("btn-warning")
                $(this).html("Connect Now").removeClass("btn-warning").addClass("btn-danger")
            client="";
            connect=false
        }
       

    })
    $('#chat-submit').click(function() {
        if($("#chat-input")!=""){
            $client.publish($('#topic').val(), $('#chat-input').val())
        }
        $('#chat-input').val("")
        return false
    })

        $('#publish').click(function() {
            if(connect){
                if($('#topic').val()!="" &&  $('#payload').val()!=""){
                    $client.publish($('#topic').val(), $('#payload').val())
                    $("#pub_message tbody").prepend("<tr><td>" + $('#topic').val() + "</td><td>" + $('#payload').val() + "</td><td>" + dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT") + "</td></tr>")
                 
                }
                return false
            }else{
                $("#error_message").html("You are not connected").show().fadeOut(2000)
            }
           
        })

        $('#subscribe').click(function() {
            if(connect){
                
                if ($('#subtopic').val() != "") {
                    $client.subscribe($('#subtopic').val())
                    $("#sub_message tbody").prepend("<tr><td>" + $('#subtopic').val() + "</td><td>" +  dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT") + "</td></tr>")
                } 
                return false
            }else{
                $("#error_message").html("You are not connected").show().fadeOut(2000)
                return false
            }
           
           
        })
        // $('#clear').click(function() {
        //     $('# tbody').fadeOut("slow")
        // })
   
   
})

 