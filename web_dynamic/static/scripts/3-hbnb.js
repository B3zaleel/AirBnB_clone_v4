'use strict';
$(() => {
  let amenitiesSelected = [];
  const amenitiesHeaderSelector = '.amenities > h4';
  const checkboxSelector =
    '.amenities > .popover > ul > li > input[type="checkbox"]';
  const checkboxItemSelector =
    '.amenities > .popover > ul > li';
  const BASE_URL = 'http://0.0.0.0:5001/api/v1';

  const createPlace = place => {
    if (place) {
      const article = document.createElement('article');

      const titleBox = document.createElement('div');
      titleBox.className = 'title_box';
      const titleHTML = `<h2>${place.name}</h2>`;
      const priceByNightHTML = '<div class="price_by_night">'
        + `$${place.price_by_night}`
        + '</div>';
      titleBox.insertAdjacentHTML('beforeend', titleHTML);
      titleBox.insertAdjacentHTML('beforeend', priceByNightHTML);

      const informationBox = document.createElement('div');
      informationBox.className = 'information';
      const maxGuestHTML = '<div class="max_guest">'
        + `${place.max_guest}`
        + ` Guest${place.max_guest != 1 ? 's' : ''}`
        + '</div>';
      const numberRoomsHTML = '<div class="number_rooms">'
        + `${place.number_rooms}`
        + ` Bedroom${place.number_rooms != 1 ? 's' : ''}`
        + '</div>';
      const numberBathroomsHTML = '<div class="max_guest">'
        + `${place.number_bathrooms}`
        + ` Bathroom${place.number_bathrooms != 1 ? 's' : ''}`
        + '</div>';
      informationBox.insertAdjacentHTML('beforeend', maxGuestHTML);
      informationBox.insertAdjacentHTML('beforeend', numberRoomsHTML);
      informationBox.insertAdjacentHTML('beforeend', numberBathroomsHTML);

      const userBox = document.createElement('div');
      userBox.className = 'user';
      if (place.user) {
        const userHTML = `<b>Owner:</b>`
          + ` ${place.user.first_name} ${place.user.last_name}`;
        userBox.insertAdjacentHTML('beforeend', userHTML);
      }

      const descriptionBox = document.createElement('div');
      descriptionBox.className = 'description';
      descriptionBox.innerHTML = place.description;

      article.insertAdjacentElement('beforeend', titleBox);
      article.insertAdjacentElement('beforeend', informationBox);
      article.insertAdjacentElement('beforeend', userBox);
      article.insertAdjacentElement('beforeend', descriptionBox);
      return article;
    } else {
      return null;
    }
  };

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

  $.ajax({
    url: `${BASE_URL}/places_search`,
    type: 'POST',
    data: JSON.stringify({}),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: data => {
      for (let i = 0; i < data.length; i++) {
        $('section.places').append(createPlace(data[i]));
      }
    }
  });
});
