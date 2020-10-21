

const express = require('express')
const app = express()
const port = 8888

app.use(express.static('public'))

server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
app.get('/', (req, res) => {
  res.sendFile('/home/thang/20201/project3/demmoproejct3/server/index.html');
});

const io = require('socket.io')(server);

const arrUserInfo = [];

io.on('connection', socket => {
    socket.on('NGUOI_DUNG_DANG_KY', user => {
        const isExist = arrUserInfo.some(e => e.ten === user.ten);
        socket.peerId = user.peerId;
        if (isExist) return socket.emit('DANG_KY_THAT_BAT');
        arrUserInfo.push(user);
        socket.emit('DANH_SACH_ONLINE', arrUserInfo);
        socket.broadcast.emit('CO_NGUOI_DUNG_MOI', user);
    });

    socket.on('disconnect', () => {
        const index = arrUserInfo.findIndex(user => user.peerId === socket.peerId);
        arrUserInfo.splice(index, 1);
        io.emit('AI_DO_NGAT_KET_NOI', socket.peerId);
    });
});
