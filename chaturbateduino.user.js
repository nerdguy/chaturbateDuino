// ==UserScript==
// @name       Chaturbate
// @namespace  http://use.i.E.your.homepage/
// @version    0.2
// @description  enter something useful
// @match http://testbed.chaturbate.com/*
// @match http://chaturbate.com/*
// @copyright  2012+, Nerdguy
// ==/UserScript==

var main = function () {
    var settings = {
        API_ROOT: 'http://127.0.0.1:8000/v2/',
        PIN: 3,
        CURRENT: 0
    };
    var additional_callbacks = {
        on_room_message: function(nick, message) {},
        on_private_message: function (from_nick, message, tab_nick) {},
        notify_goalset: function (amount, current, hightipper, hightipper_amount, lasttipper, lasttipper_amount) {},
        notify_goalreached: function () {},
        notify_goalcancel: function () {},
        notify_tipalert: function(amount, from_username, to_username, message, history) {
            settings.CURRENT += parseInt(amount);
            if (settings.URL && settings.GOAL && settings.CURRENT !== undefined) {
                value = utils.scale(1, settings.GOAL, settings.CURRENT);
                data = {type: "digital", mode: "pwm", value: value};
                $.post(settings.URL, data);
            }
        },
        notify_tokenbalanceupdate: function(usernames, amounts) {}
    };
  
    var connectPort = function(port) {
        if (port) {
            $.ajax({
                type: 'PUT',
                url: settings.API_ROOT + 'boards/',
                data: {port: port},
                success: function(data) {
                    settings.BOARD = data['pk']
                    settings.URL = settings.API_ROOT + 'boards/'+ settings.BOARD + '/' + settings.PIN + '/';
                    $('#firmataPort').removeAttr('disabled');
                    goal = $('<p><label for="firmataGoal">Goal</label> <input type="integer" id="firmataGoal"></input></p>');
                    $('#firmataGoal', goal).change(function(e) {
                        val = $(this).val();
                        if (val !== undefined && val != '') {
                            settings.GOAL = parseInt($(this).val());
                        }
                    });
                    $('#firmata').append(goal);
                }
            });
        }
    };
 
    var setup = function() {
        var ui = $('<div id="firmata" style="position: absolute; z-index: 9999; top: 0; left: 0; padding: 1em; background: silver;"><h3>Firmata Control Panel</h3></div>');
        onToggle = $('<a id="fetchPorts">Fetch ports</a>');
        onToggle.click(function(e) {
            e.preventDefault();
            $(this).remove();
            $.getJSON(settings.API_ROOT + 'ports/', function(data) {
                settings.PORTS = data;
                selectPort = $('<p><select id="firmataPort"><option value="">Select port</option></select></p>');
                $(ui).append(selectPort);
                $(data).each(function() {
                    option = '<option value="' + this + '">' + this + '</option>';
                    $('#firmataPort', ui).append(option);
                });
                $('#firmataPort', ui).change(function(e) {
                    $(this).attr('disabled', '');
                    port = $(this).val();
                    if (settings.URL !== undefined) {
                        $.ajax({
                            url: settings.API_ROOT + 'boards/' + settings.BOARD + '/',
                            type: 'DELETE',
                            success: connectPort(port)
                        });
                    } else {
                        connectPort(port);
                    }
                });
                
            });
        });
        $(ui).append(onToggle);
        $('body').append(ui);
    };
    if (window.flash_handler !== undefined) {
        var original_callbacks = {};
        $.each(additional_callbacks, function(k, v) {
            original_callbacks[k] = flash_handler.message_inbound[k];
        });
        
        setup();
        $.each(additional_callbacks, function(k, v) {
            flash_handler.message_inbound[k] = function() {
                v.apply(this, arguments);
                return original_callbacks[k].apply(this, arguments);
            }
        });
    }
    
    var utils = {
        scale: function(max_target, max, value) {
            return (max_target * value)/max;
        }
    }
};
// Inject our main script
var script = document.createElement('script');
script.type = "text/javascript";
script.textContent = '(' + main.toString() + ')();';
document.body.appendChild(script);