const amqp = require('amqplib');
const { getAdmins } = require('./mongo').users

const url = process.env.RABBITMQ_URL || ''
const exchange = 'admins'
const timeout = 5
let connection = null
let channel = null
const init = async () => {

    connection = null
    channel = null

    try{
        connection = await amqp.connect(url)
        channel = await connection.createChannel()
        channel.assertExchange(exchange, 'fanout', { durable: false })

        const {queue} = channel.assertQueue('', { durable: false, exclusive: true })

        channel.bindQueue(queue, exchange, '');

        channel.consume(queue, onMessageReceived, { noAck: true })

    }
    catch(err) {
        console.warn('Error connecting to rabbitmq service, retriyng in %s seconds', timeout)
        setTimeout(init, timeout * 1000)
    }
}

const onMessageReceived = (msg) => {

  try{
    let {type} = JSON.parse(msg.content);
    switch (type){
  
      case "admin:request-list":
        sendAdminList();
        break;
      case "admin:list":
      case "admin:updated":
        break;
      default:
          console.log("Received unknown message")
          break;
        
    }

  }catch(err){
    console.log(err);
  }
  

}

const sendAdminList = async () => {

  const type = "admin:list";
  const data = await getAdmins()

  sendMessage(type, data);

}

const sendMessage = async (type, data) => {
    
    if(!channel) return

    const message = JSON.stringify({type, data})

    try {
        channel.publish(exchange, '', Buffer.from(message))
        console.log("Message Sent")
    }
    catch(err) {
        console.warn('Error sending message to rabbitmq, reconnecting...')
        init()
    }
}

module.exports = {
    init
}

