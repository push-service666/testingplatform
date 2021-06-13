if ('serviceWorker' in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js")
            .then((reg) => {
                if (Notification.permission === "granted") {
                    console.log("access granted")
                    $("#form").show();
                    getSubscription(reg);
                } else if (Notification.permission === "blocked") {
                    $("#NoSupport").show();
                } else {
                    $("#GiveAccess").show();
                    $("#PromptForAccessBtn").click(() => requestNotificationAccess(reg));
                }
            });
    });
} else {
    $("#NoSupport").show();
}

function requestNotificationAccess(reg) {
    Notification.requestPermission(function (status) {
        $("#GiveAccess").hide();
        if (status == "granted") {
            $("#form").show();
            getSubscription(reg);
        } else {
            $("#NoSupport").show();
        }
    });
}

function getSubscription(reg) {
    reg.pushManager.getSubscription().then(function (sub) {
        if (sub === null) {
            reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: "BEIpruePHNY1IpLSwx4bQI-DyzzynkbkFzGBogXXmvhhIlErPshOyY2HurugSh-SINnoEnX_YX9O1OzqWrwsFVI"
            }).then(function (sub) {
                fillSubscribeFields(sub);
            }).catch(function (e) {
                console.error("Unable to subscribe to push", e);
            });
        } else {
            fillSubscribeFields(sub);
        }
    });
}

function fillSubscribeFields(sub) {
    $("#endpoint").val(sub.endpoint);
    $("#p256dh").val(arrayBufferToBase64(sub.getKey("p256dh")));
    $("#auth").val(arrayBufferToBase64(sub.getKey("auth")));
}

function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}



//////////

$(document).ready(function () {

    $("#form").submit(function (e) {
        e.preventDefault();
        var form = $(this);
        var data = form.serializeArray();
        $.ajax({
            url: "https://push-service-api.herokuapp.com//subscriber",
            dataType: 'json',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(getFormData(data)),
            success: function (data) {
                console.log("DATA POSTED SUCCESSFULLY" + data);
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    });
});

//utility function
function getFormData(data) {
    var unindexed_array = data;
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}