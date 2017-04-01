var soda = require('soda-js');

// Establish data.marincounty.org as source
var consumer = new soda.Consumer('data.marincounty.org');

// Attempt to query for 20 rows
consumer.query()
    // Choose SWITRS as DB
    .withDataset('3k92-tyja')
    .limit(5)
    .where({ 'City': 'SAN RAFAEL' })
    .where({ 'Case ID': 4565648 })
    .getRows()
        .on('success', function(rows) { console.log(rows); })
        .on('error', function(error) { console.log(error); });

var emq = function() {
    consumer.query()
        .withDataset('7bzr-ymkc')
        .select('time_vehicle_was_dispatched')
        .getRows()
            .on('success', function(rows) { console.log(rows); })
            .on('error', function(error) { console.log(error); });
};