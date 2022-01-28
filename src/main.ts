import newman from 'newman'; // require newman in your project

// call newman.run to pass `options` object and wait for callback
newman.run({
    collection: require('./collections/postman_echo.postman_collection.json'),
    reporters: 'junit',
}, function (err) {
	if (err) { throw err; }
    console.log('Collection run complete!');
});
