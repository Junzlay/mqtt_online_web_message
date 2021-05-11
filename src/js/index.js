$(document).ready(function () {
    document.onkeydown = function (e) {
        // return (event.ctrlKey && event.shiftKey && event.keyCode == 73||event.keyCode == 123||e.ctrlKey && (e.keyCode === 67 || e.keyCode === 85 || e.keyCode === 117))?false:true 
    }
    $("#error_message").hide()
    var connect = false;
    var clickConnect = 0;
    window.EmojiPicker.init()
    $('#unsubscribe').prop('disabled', true);
    $client = mqtt.connect('wss://mqtt.eclipseprojects.io:443/mqtt')

    $client.on('message', function (topic, payload) {
        if (topic != $('#topic').val()) {
            if (topic.indexOf('/')) {
                topic = topic.substr(topic.indexOf("/") + 1)
            }
            $(".chat-logs").append("<div class='chat-msg user'><span class='msg-avatar'><img class='rounded-circle' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgzwcTAQIHtNpvDnxvtOOrd3nDh1z17HKvEQ&usqp=CAU'></span><div class='cm-msg-text wrap'>" + payload + "<p class='small' style='font-size: 9.5px;height: 12px;margin: 0;'>" + dateFormat(new Date(), "h:MM TT") + "  |  " + topic + "</p></div></div>")
            $(".chat-logs").animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);

        } else {
            if (topic.indexOf('/')) {
                topic = topic.substr(topic.indexOf("/") + 1)
            }
            $(".chat-logs").append("<div class='chat-msg self '><span class='msg-avatar'><img class='rounded-circle'  src='https://wallpaperaccess.com/full/4595683.jpg'></span><div class='cm-msg-text wrap'>" + payload + "<p class='small' style='font-size: 9.5px;height: 12px;margin: 0;'>" + dateFormat(new Date(), "h:MM TT") + "  |  " + topic + "</p></div></div>")
            $(".chat-logs").animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
        }

    })

    $(".connect").click(function () {
        clickConnect += 1;

        if (!connect) {
            if (clickConnect > 1) {
                toastr.info("Try refreshing the page and quickly hit connect again after the reload")
            }
            $(this).html("Connecting...").addClass($(".connect").hasClass("btn-danger") ? $(".connect").addClass("btn-info").removeClass("btn-danger") : $(".connect").addClass("btn-info"))


            $client.on('connect', function () {
                toastr.success("You are now connected!")
                $(".connect").html("Disconnect Now").addClass($(".connect").hasClass("btn-info") ? $(".connect").addClass("btn-success").removeClass("btn-info") : $(".connect").addClass("btn-danger"))
                clickConnect = 0;
                connect = true
            })
        } else {
            $(this).html("Disconnecting").removeClass("btn-success").addClass("btn-warning")
            $(this).html("Connect Now").removeClass("btn-warning").addClass("btn-danger")
            toastr.info("You are now Disconnected")
            client = "";
            connect = false
        }
        if (clickConnect <= 1) {
            setTimeout(function () {
                if ($('.connect').text().trim() == "Connecting...") {
                    toastr.info("Try refreshing the page and quickly hit connect again after the reload")
                }
            }, 3000);
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
            toastr.warning("Please connect first")
        }

    })

    $('#subscribe').click(function () {
        if (connect) {

            if ($('#subtopic').val() != "") {
                if ($('#subtopic').val().indexOf('/')) {
                    $topic_sub = $('#subtopic').val().substr(0, $('#subtopic').val().indexOf('/'));
                    $(".topic-title").text("Room: " + $topic_sub)
                }
                $('#unsubscribe').prop('disabled', false);
                $client.subscribe($('#subtopic').val())
                $("#sub_message tbody").prepend("<tr id='" + $topic_sub + "'><td>" + $('#subtopic').val() + "</td><td>" + dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT") + "</td></tr>")
            }
            return false
        } else {
            toastr.warning("Please connect first")
            return false
        }


    })
    //     $('#unsubscribe').click(function() {

    //         $($('#subtopic').val()).remove();
    //         $client.unsubscribe($('#subtopic').val())
    //         return false
    // })

    const emojis = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "☺️", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "😘", "😗", "😙", "😚", "😋", "😜", "😝", "😛", "🤑", "🤗", "🤓", "😎", "🤡", "🤠", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "😤", "😠", "😡", "😶", "😐", "😑", "😯", "😦", "😧", "😮", "😲", "😵", "😳", "😱", "😨", "😰", "😢", "😥", "🤤", "😭", "😓", "😪", "😴", "🙄", "🤔", "🤥", "😬", "🤐", "🤢", "🤧", "😷", "🤒", "🤕"]
    var random;
    var randomTemp;
    $('.rotate-emoji').mouseover(function () {
        random = Math.floor(Math.random() * emojis.length) + 1
        if (random == randomTemp) {
            random = Math.floor(Math.random() * emojis.length) + 1
        }
        randomTemp = random;
        setTimeout(function () {
            $('.rotate-emoji').html(emojis[random]);
        }, 100);

    })

})

