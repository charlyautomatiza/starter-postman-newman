import * as newman from 'newman'; // require newman in your project

// List of reports
const reports = ['junit', 'cli', 'progress', 'json', 'htmlextra'];

// call newman.run to pass `options` object and wait for callback
newman.run({
    collection: require('./collections/postman_echo.postman_collection.json'),
    reporters: reports,
    reporter: {
        htmlextra: { export: './newman/report.html' },
        junit: { export: './newman/results.xml' },
    },
}, function (err: Error | null) {
	if (err) { throw err; }
    console.log('Collection run complete!');
});
