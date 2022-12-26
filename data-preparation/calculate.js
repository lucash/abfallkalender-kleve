#!/usr/bin/env node

const fs = require('fs');

const calculateCalendarForRegion = (region, dates) => {
    let collectedDates = {};
    for (let date of dates) {
        let regionBinsForDate = getRegionBinsForDate(region, date);
        if (regionBinsForDate) {
            collectedDates[date.datum] = regionBinsForDate;
        }
    }

    writeJsonToFile(collectedDates, '../webapp/data/' + region.identifier + '.json');
}

const getRegionBinsForDate = (region, date) => {
    let regionBinsForDate = [];
    for (let i = 0; i < 6; i++) {
        if (date[i] === region.others) {
            regionBinsForDate.push('Altglas');
        } else if (date[i] === region.yellow + 'YELLOW') {
            regionBinsForDate.push('Gelbe Tonne');
        } else if (date[i] === region.bins + 'BROWN') {
            regionBinsForDate.push('Braune Tonne');
        } else if (date[i] === region.bins + 'GREEN') {
            regionBinsForDate.push('Grüne Tonne');
        } else if (date[i] === region.bins + 'GREY') {
            regionBinsForDate.push('Graue Tonne');
        } else if (date[i] === region.yellow + 'PINK') {
            regionBinsForDate.push('Wertstoffe');
        }
    }

    if (regionBinsForDate.length > 0) {
        return regionBinsForDate;
    }
}

const regionIdentifierFromStreet = (street) => {
    return street.yellow + street.bins + street.others;
}

const extractRegionsFromStreets = (streets) => {
    let regions = {};
    for (let street of streets) {
        let identifier = regionIdentifierFromStreet(street);
        regions[identifier] = {
            identifier: identifier,
            yellow: street.yellow,
            bins: street.bins,
            others: street.others
        }
    }

    return regions;
}

const mapStreetsToRegions = (streets) => {
    let streetMap = {};

    for (let street of streets) {
        streetMap[street.street] = regionIdentifierFromStreet(street);
    }

    return streetMap;
}

const writeJsonToFile = (json, filename) => {
    let jsonAsString = JSON.stringify(json);

    fs.writeFileSync(filename, jsonAsString);
}

const run = () => {
    let dates = require('./abfuhrtermine.json');
    let streets = require('./abfuhrbezirke.json');

    let regions = extractRegionsFromStreets(streets);

    for (let region of Object.values(regions)) {
        calculateCalendarForRegion(region, dates);
    }

    let streetToRegionMap = mapStreetsToRegions(streets);

    writeJsonToFile(streetToRegionMap, '../webapp/data/streetToRegionMap.json')
}

run();