$(document).ready(function () {
    document.onkeydown = function(e) {
        return (event.ctrlKey && event.shiftKey && event.keyCode == 73||event.keyCode == 123||e.ctrlKey && (e.keyCode === 67 || e.keyCode === 85 || e.keyCode === 117))?false:true 
}
    $("#error_message").hide()
    var connect = false;

    window.EmojiPicker.init()

    $client = mqtt.connect('wss://mqtt.eclipseprojects.io:443/mqtt')

    $client.on('message', function (topic, payload) {
      if (topic != $('#topic').val()) {
            if(topic.indexOf('/')){
                topic = topic.substr(topic.indexOf("/") + 1)
            }
            $(".chat-logs").append("<div class='chat-msg user'><span class='msg-avatar'><img class='rounded-circle' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgzwcTAQIHtNpvDnxvtOOrd3nDh1z17HKvEQ&usqp=CAU'></span><div class='cm-msg-text wrap'>" + payload + "<p class='small' style='font-size: 9.5px;height: 12px;margin: 0;'>" + dateFormat(new Date(), "h:MM TT") + "  |  " + topic + "</p></div></div>")
            $(".chat-logs").animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);

        } else {
            if(topic.indexOf('/')){
                topic = topic.substr(topic.indexOf("/") + 1)
            }
            $(".chat-logs").append("<div class='chat-msg self '><span class='msg-avatar'><img class='rounded-circle'  src='https://wallpaperaccess.com/full/4595683.jpg'></span><div class='cm-msg-text wrap'>" + payload + "<p class='small' style='font-size: 9.5px;height: 12px;margin: 0;'>" + dateFormat(new Date(), "h:MM TT") + "  |  " + topic + "</p></div></div>")
            $(".chat-logs").animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
        }

    })

    $(".connect").click(function () {
        if (!connect) {
            $(this).html("Connecting...").addClass($(".connect").hasClass("btn-danger") ? $(".connect").addClass("btn-info").removeClass("btn-danger") : $(".connect").addClass("btn-info"))
            $client.on('connect', function () {
                $(".connect").html("Connected").addClass($(".connect").hasClass("btn-info") ? $(".connect").addClass("btn-success").removeClass("btn-info") : $(".connect").addClass("btn-danger"))
                connect = true
            })
        } else {
            $(this).html("Disconnecting").removeClass("btn-success").addClass("btn-warning")
            $(this).html("Connect Now").removeClass("btn-warning").addClass("btn-danger")
            client = "";
            connect = false
        }


    })

    $(".emoji").click(function (f) {
        $(document).bind('keydown', 'ctrl+t', f);

        return false
    })

    $('#chat-submit').click(function () {
        if ($("#chat-input") != "") {
            $client.publish($('#topic').val(), $('#chat-input').val())
        }
        $('#chat-input').val("")
        return false
    })

    $('#publish').click(function () {
        if (connect) {
            if ($('#topic').val() != "" && $('#payload').val() != "") {
                $client.publish($('#topic').val(), $('#payload').val())
                $("#pub_message tbody").prepend("<tr><td>" + $('#topic').val() + "</td><td>" + $('#payload').val() + "</td><td>" + dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT") + "</td></tr>")

            }
            return false
        } else {
            $("#error_message").html("You are not connected").show().fadeOut(2000)
        }

    })

    $('#subscribe').click(function () {
        if (connect) {
            
            if ($('#subtopic').val() != "") {
                 if($('#subtopic').val().indexOf('/')){
                    $topic_sub= $('#subtopic').val().substr(0, $('#subtopic').val().indexOf('/')); 
                    $(".topic-title").text($topic_sub)
                }
                $client.subscribe($('#subtopic').val())
                $("#sub_message tbody").prepend("<tr><td>" + $('#subtopic').val() + "</td><td>" + dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT") + "</td></tr>")
            }
            return false
        } else {
            $("#error_message").html("You are not connected").show().fadeOut(2000)
            return false
        }


    })
    // $('#clear').click(function() {
    //     $('# tbody').fadeOut("slow")
    // })


})

