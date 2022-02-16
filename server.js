const redis = require('redis')

/*
    docker pull redis
    docker run -p 6379:6379 --name ps-redis -d redis
*/

const HOST = '127.0.0.1'
const PORT = 6379

const publish = async (channel, message) => {
	const publisher = redis.createClient({
		host: HOST,
		port: PORT,
	})

	publisher.on('connect', () => {
		console.log('Publisher: Connected')
	})
	publisher.on('ready', () => {
		console.log('Publisher: Ready')
	})
	publisher.on('end', () => {
		console.log('Publisher: End')
	})
	publisher.on('error', (err) => {
		console.log('Publisher: Error:', err)
	})
	publisher.on('reconnecting', () => {
		console.log('Publisher: Reconnecting')
	})

	await publisher.connect()

	await publisher.publish(channel, message)
}

const subscribe = async (channel) => {
	const client = redis.createClient({
		host: HOST,
		port: PORT,
	})

	client.on('connect', () => {
		console.log('Client: Connected')
	})
	client.on('ready', () => {
		console.log('Client: Ready')
	})
	client.on('end', () => {
		console.log('Client: End')
	})
	client.on('error', (err) => {
		console.log('Client: Error:', err)
	})
	client.on('reconnecting', () => {
		console.log('Client: Reconnecting')
	})

	await client.connect()

	await client.subscribe(channel, (message) => {
		console.log(channel, 'Channel:', message)
	})
}

const main = async () => {
	const channel = 'Notifications'
	const message = `hello 
world`

	await subscribe(channel)
	await publish(channel, message)
}

main()
