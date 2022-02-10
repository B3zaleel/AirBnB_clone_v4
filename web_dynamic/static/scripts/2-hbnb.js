'use strict';
$(() => {
  let amenitiesSelected = [];
  const amenitiesHeaderSelector = '.amenities > h4';
  const checkboxSelector =
    '.amenities > .popover > ul > li > input[type="checkbox"]';
  const checkboxItemSelector =
    '.amenities > .popover > ul > li';
  const BASE_URL = 'http://0.0.0.0:5001/api/v1';

  $(checkboxItemSelector).on('mousedown', ev => {
    const inputElements = ev.target.getElementsByTagName('input');

    if (inputElements) {
      inputElements.item(0).click();
    }
  });

  $(checkboxSelector).change(ev => {
    const amenityId = ev.target.getAttribute('data-id');
    const amenityName = ev.target.getAttribute('data-name');

    if (ev.target.checked) {
      if (!amenitiesSelected.find(obj => obj.id === amenityId)) {
        amenitiesSelected.push({
          id: amenityId,
          name: amenityName
        });
      }
    } else {
      amenitiesSelected = amenitiesSelected.filter(
        obj => obj.id !== amenityId && obj.name !== amenityName
      );
    }
    const htmlContent = amenitiesSelected.map(obj => obj.name).join(', ');
    $(amenitiesHeaderSelector).html(
      amenitiesSelected.length > 0 ? htmlContent : '&nbsp;'
    );
  });

  $.get(`${BASE_URL}/status`, (data, status) => {
    if (status === 'success' && data.status === 'OK') {
      if (!$('div#api_status').hasClass('available'))
        $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
});
