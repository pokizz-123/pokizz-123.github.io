const socket = io('https://webrtc1406.herokuapp.com/');

$('#div-chat').hide();

function openStream() { //mở stream video
    const config = { audio: true, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idTagVideo, stream) { //gán video stream vào thẻ video
    const video = document.getElementById(idTagVideo);
    video.srcObject = stream;
    video.play();
}

// openStream().then(stream => {
//     playStream("localStream", stream);
// });

var peer = new Peer();

peer.on('open', id => {
    $("#my-id").append(id);
    $('#btnSignUp').click(() => {
        const username = $('#txtUsername').val();
        socket.emit('NGUOI_DUNG_DANG_KI', { ten: username, peerID: id });
    })
})

socket.on('DANH_SACH_USER_ONLINE', arrUserInfo => {
    $('#div-chat').show();
    $('#div-dang-ki').hide();
    arrUserInfo.forEach(user => {
        const { ten, peerID } = user;
        $('#ulUser').append(`<li id="${peerID}">${ten}</li>`);
    })

    socket.on('CO_NGUOI_DUNG_MOI', user => {
        const { ten, peerID } = user;
        $('#ulUser').append(`<li id="${peerID}">${ten}</li>`);
    })
})

socket.on('NGUOI_DUNG_TON_TAI', () => alert('VUi lòng chọn tên khác !'));

socket.on('NGUOI_DUNG_NGAT_KET_NOI', peerID => {
    $(`#${peerID}`).remove();
})

$('#btnCall').click(() => {
    const id = $('#remoteID').val();
    openStream().then(stream => {
        playStream("localStream", stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => {
            playStream('remoteStream', remoteStream);
        })
    })
})

//answer
peer.on('call', call => {
    openStream().then(stream => {
        playStream("localStream", stream);
        call.answer(stream);
        call.on('stream', remoteStream => {
            playStream('remoteStream', remoteStream);
        })
    })
})

$('#ulUser').on('click', 'li', function() {
    const id = ($(this).attr('id'));

    openStream().then(stream => {
        playStream("localStream", stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => {
            playStream('remoteStream', remoteStream);
        })
    })
})