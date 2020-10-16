'use strict';

const apiKey = 'cQhAEqoVa5bvZEW1R2bw1hFVruVYNbAMBuc6Uku9';

const searchActivities = 'https://developer.nps.gov/api/v1/activities';

const searchParks = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${params[key]}`);
    return queryItems.join('&');
}

function displayResults(responseJson) {
    console.log(responseJson);
    $('#results-list').empty();
    for (let i = 0; i < responseJson.data.length; i++) {
        $('#results-list').append(
            `<li>
            <h3>${responseJson.data[i].fullName}</h3>
            <p>${responseJson.data[i].description}</p>
            <p><a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></p>
            <p><strong>Address:</strong></p>
            <p>${responseJson.data[i].addresses[0].line1}</p>
            <p>${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode}, ${responseJson.data[i].addresses[0].postalCode}</p>
        </li>`
        );
    };
    $('#results').removeClass('hidden');
};
function getParkInfo(stateCodeRequest, limit = 10) {
    console.log(stateCodeRequest);
    const params = {
        api_key: apiKey,
        stateCode: stateCodeRequest,
        limit
    };
    const queryString = formatQueryParams(params);
    const url = searchParks + '?' + queryString;
    console.log(url);
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message');
        });
}
function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        let searchTerm = $('#js-search-term').val();
        searchTerm = searchTerm.replace(/\s+/g, '');
        const limit = $('#js-max-results').val();
        getParkInfo(searchTerm, limit);
    });
}
$(watchForm);