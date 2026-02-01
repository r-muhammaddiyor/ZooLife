import {
  elCardContainer,
  elCardTemplate,
  elSkeletonTemplate,
  elSkeletonContainer,
  elExitBtn,
  elTostContainer,
  elSuccessTost,
  elEditModal,
  elEditForm,
  elEditSubmitBtn,
} from './html-elements.js';

let editId = null;

if (isLogin()) {
  elExitBtn.classList.remove('hidden');
  const elLogin = document.getElementById('login');
  elLogin.classList.add('hidden');
} else {
  elExitBtn.classList.add('hidden');
  const elAdd = document.getElementById('addBtn');
  elAdd.classList.add('hidden');
}
loader(true);
// aos

AOS.init({
  duration: 800,
  once: true,
});

fetch('https://json-api.uz/api/project/game-over/animals/')
  .then((res) => res.json())
  .then((res) => {
    console.log(res);

    ui(res.data);
  })
  .catch(() => {
    document.querySelector('#errorBox').classList.remove('hidden');
    document.querySelector('#errorBox').classList.add('flex');
  })
  .finally(() => {
    loader(false);
    // if (!isLogin()) {
    //   setTimeout(() => {
    //     alert("Bu sitedan to'liq foydalanish uchun iltimos ro'yhatdan o'ting!");
    //   }, 2000);
    // }
  });

// ui

console.log(elCardTemplate);

function ui(data) {
  data.forEach((element) => {
    const clone = elCardTemplate.cloneNode(true).content;

    const cardName = clone.querySelector('.js-name');
    const cardCategory = clone.querySelector('.js-category');
    const cardSpeed = clone.querySelector('.js-speed');
    const cardYear = clone.querySelector('.js-year');
    const cardColor = clone.querySelector('.js-color');
    const cardHabitat = clone.querySelector('.js-habitat');

    cardName.innerText = element.name ? element.name : 'No data';
    cardCategory.innerText = element.category ? element.category : 'No data';
    cardSpeed.innerText = element.speed ? element.speed : 'No data';
    cardYear.innerText = element.year ? element.year : 'No data';
    cardColor.innerText = element.color ? element.color : 'No data';
    cardHabitat.innerText = element.habitat ? element.habitat : 'No data';

    if (isLogin() === false) {
      clone.querySelector('.js-delete-button').classList.add('hidden');
      clone.querySelector('.js-edit-button').classList.add('hidden');

      // document.getElementsByClassName('js-add-button').classList.add('hidden');
    } else {
      clone.querySelector('.js-delete-button').classList.remove('hidden');
      clone.querySelector('.js-edit-button').classList.remove('hidden');
      // document.getElementsByClassName('js-add-button').classList.remove('hidden');
    }

    clone.querySelector('.js-delete-button').id = element.id;
    clone.querySelector('.js-edit-button').id = element.id;

    elCardContainer.appendChild(clone);
  });

  AOS.refresh();
}

elCardContainer.addEventListener('click', (evt) => {
  if (evt.target.classList.contains('js-delete-button')) {
    deleteCard(evt.target.id);

    evt.target.disabled = true;
    evt.target.innerHTML = `
      <svg class="animate-spin" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.90321 7.29677C1.90321 10.341 4.11041 12.4147 6.58893 12.8439C6.87255 12.893 7.06266 13.1627 7.01355 13.4464C6.96444 13.73 6.69471 13.9201 6.41109 13.871C3.49942 13.3668 0.86084 10.9127 0.86084 7.29677C0.860839 5.76009 1.55996 4.55245 2.37639 3.63377C2.96124 2.97568 3.63034 2.44135 4.16846 2.03202L2.53205 2.03202C2.25591 2.03202 2.03205 1.80816 2.03205 1.53202C2.03205 1.25588 2.25591 1.03202 2.53205 1.03202L5.53205 1.03202C5.80819 1.03202 6.03205 1.25588 6.03205 1.53202L6.03205 4.53202C6.03205 4.80816 5.80819 5.03202 5.53205 5.03202C5.25591 5.03202 5.03205 4.80816 5.03205 4.53202L5.03205 2.68645L5.03054 2.68759L5.03045 2.68766L5.03044 2.68767L5.03043 2.68767C4.45896 3.11868 3.76059 3.64538 3.15554 4.3262C2.44102 5.13021 1.90321 6.10154 1.90321 7.29677ZM13.0109 7.70321C13.0109 4.69115 10.8505 2.6296 8.40384 2.17029C8.12093 2.11718 7.93465 1.84479 7.98776 1.56188C8.04087 1.27898 8.31326 1.0927 8.59616 1.14581C11.4704 1.68541 14.0532 4.12605 14.0532 7.70321C14.0532 9.23988 13.3541 10.4475 12.5377 11.3662C11.9528 12.0243 11.2837 12.5586 10.7456 12.968L12.3821 12.968C12.6582 12.968 12.8821 13.1918 12.8821 13.468C12.8821 13.7441 12.6582 13.968 12.3821 13.968L9.38205 13.968C9.10591 13.968 8.88205 13.7441 8.88205 13.468L8.88205 10.468C8.88205 10.1918 9.10591 9.96796 9.38205 9.96796C9.65819 9.96796 9.88205 10.1918 9.88205 10.468L9.88205 12.3135L9.88362 12.3123C10.4551 11.8813 11.1535 11.3546 11.7585 10.6738C12.4731 9.86976 13.0109 8.89844 13.0109 7.70321Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
    `;
    evt.target.style.cssText = `
      background-color: rgb(133, 133, 133);
      opacity: 1;
    `;
  }

  if (evt.target.classList.contains('js-edit-button')) {
    getById(evt.target.id);
    const elBody = document.querySelector('body');
    elBody.classList.add('overflow-hidden');

    evt.target.disabled = true;
    evt.target.innerHTML = `
      <svg class="animate-spin" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.90321 7.29677C1.90321 10.341 4.11041 12.4147 6.58893 12.8439C6.87255 12.893 7.06266 13.1627 7.01355 13.4464C6.96444 13.73 6.69471 13.9201 6.41109 13.871C3.49942 13.3668 0.86084 10.9127 0.86084 7.29677C0.860839 5.76009 1.55996 4.55245 2.37639 3.63377C2.96124 2.97568 3.63034 2.44135 4.16846 2.03202L2.53205 2.03202C2.25591 2.03202 2.03205 1.80816 2.03205 1.53202C2.03205 1.25588 2.25591 1.03202 2.53205 1.03202L5.53205 1.03202C5.80819 1.03202 6.03205 1.25588 6.03205 1.53202L6.03205 4.53202C6.03205 4.80816 5.80819 5.03202 5.53205 5.03202C5.25591 5.03202 5.03205 4.80816 5.03205 4.53202L5.03205 2.68645L5.03054 2.68759L5.03045 2.68766L5.03044 2.68767L5.03043 2.68767C4.45896 3.11868 3.76059 3.64538 3.15554 4.3262C2.44102 5.13021 1.90321 6.10154 1.90321 7.29677ZM13.0109 7.70321C13.0109 4.69115 10.8505 2.6296 8.40384 2.17029C8.12093 2.11718 7.93465 1.84479 7.98776 1.56188C8.04087 1.27898 8.31326 1.0927 8.59616 1.14581C11.4704 1.68541 14.0532 4.12605 14.0532 7.70321C14.0532 9.23988 13.3541 10.4475 12.5377 11.3662C11.9528 12.0243 11.2837 12.5586 10.7456 12.968L12.3821 12.968C12.6582 12.968 12.8821 13.1918 12.8821 13.468C12.8821 13.7441 12.6582 13.968 12.3821 13.968L9.38205 13.968C9.10591 13.968 8.88205 13.7441 8.88205 13.468L8.88205 10.468C8.88205 10.1918 9.10591 9.96796 9.38205 9.96796C9.65819 9.96796 9.88205 10.1918 9.88205 10.468L9.88205 12.3135L9.88362 12.3123C10.4551 11.8813 11.1535 11.3546 11.7585 10.6738C12.4731 9.86976 13.0109 8.89844 13.0109 7.70321Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
    `;
    evt.target.style.cssText = `
      background-color: rgb(133, 133, 133);
      opacity: 1;
    `;
  }
});

// loader

function loader(bool) {
  if (bool) {
    elSkeletonContainer.classList.remove('hidden');
  } else {
    elSkeletonContainer.classList.add('hidden');
  }

  let arr = Array.from({ length: 8 });

  arr.forEach((el) => {
    const clone = elSkeletonTemplate.cloneNode(true).content;

    elSkeletonContainer.appendChild(clone);
  });
}

// Detete

function deleteCard(id) {
  const token = localStorage.getItem('token');
  fetch('https://json-api.uz/api/project/game-over/animals/' + id, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then((res) => res.text())
    .then((res) => {
      const clone = elSuccessTost.cloneNode(true).content;
      evt.target.closest('.card').remove();
      elTostContainer.appendChild(clone);
      setTimeout(() => {
        document.querySelector('[role="alert"]').remove();
      }, 2000);
    })
    .catch(() => {})
    .finally(() => {
      loader(false);
    });
}

// Edit

function getById(id) {
  fetch(`https://json-api.uz/api/project/game-over/animals/${id}`)
    .then((res) => res.json())
    .then((res) => {
      editId = id;
      elEditModal.showModal();

      elEditForm.name.value = res.name;
      elEditForm.year.value = res.year;
      elEditForm.color.value = res.color;
      elEditForm.speed.value = res.speed;
      elEditForm.habitat.value = res.habitat;
      elEditForm.category.value = res.category;
      elEditForm.isWild.value = res.isWild;
      elEditForm.weight.value = res.weight;
      elEditForm.soundText.value = res.soundText;
    });
}

elEditForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const formData = new FormData(elEditForm);
  const result = {};

  elEditSubmitBtn.disabled = true;
  elEditSubmitBtn.innerHTML = `
    <svg class="animate-spin" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.90321 7.29677C1.90321 10.341 4.11041 12.4147 6.58893 12.8439C6.87255 12.893 7.06266 13.1627 7.01355 13.4464C6.96444 13.73 6.69471 13.9201 6.41109 13.871C3.49942 13.3668 0.86084 10.9127 0.86084 7.29677C0.860839 5.76009 1.55996 4.55245 2.37639 3.63377C2.96124 2.97568 3.63034 2.44135 4.16846 2.03202L2.53205 2.03202C2.25591 2.03202 2.03205 1.80816 2.03205 1.53202C2.03205 1.25588 2.25591 1.03202 2.53205 1.03202L5.53205 1.03202C5.80819 1.03202 6.03205 1.25588 6.03205 1.53202L6.03205 4.53202C6.03205 4.80816 5.80819 5.03202 5.53205 5.03202C5.25591 5.03202 5.03205 4.80816 5.03205 4.53202L5.03205 2.68645L5.03054 2.68759L5.03045 2.68766L5.03044 2.68767L5.03043 2.68767C4.45896 3.11868 3.76059 3.64538 3.15554 4.3262C2.44102 5.13021 1.90321 6.10154 1.90321 7.29677ZM13.0109 7.70321C13.0109 4.69115 10.8505 2.6296 8.40384 2.17029C8.12093 2.11718 7.93465 1.84479 7.98776 1.56188C8.04087 1.27898 8.31326 1.0927 8.59616 1.14581C11.4704 1.68541 14.0532 4.12605 14.0532 7.70321C14.0532 9.23988 13.3541 10.4475 12.5377 11.3662C11.9528 12.0243 11.2837 12.5586 10.7456 12.968L12.3821 12.968C12.6582 12.968 12.8821 13.1918 12.8821 13.468C12.8821 13.7441 12.6582 13.968 12.3821 13.968L9.38205 13.968C9.10591 13.968 8.88205 13.7441 8.88205 13.468L8.88205 10.468C8.88205 10.1918 9.10591 9.96796 9.38205 9.96796C9.65819 9.96796 9.88205 10.1918 9.88205 10.468L9.88205 12.3135L9.88362 12.3123C10.4551 11.8813 11.1535 11.3546 11.7585 10.6738C12.4731 9.86976 13.0109 8.89844 13.0109 7.70321Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
  `;
  elEditSubmitBtn.style.backgroundColor = 'rgb(133,133,133)';

  formData.forEach((value, key) => {
    if (key === 'isWild') {
      result[key] = value === 'true';
    } else {
      result[key] = value;
    }
  });

  const token = localStorage.getItem('token');

  fetch(`https://json-api.uz/api/project/game-over/animals/${editId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(result),
  })
    .then((res) => res.json())
    .then(() => {
      loader(true);
      elEditModal.close();
      location.reload();
      document.body.classList.remove('overflow-hidden');
      const clone = elSuccessTost.cloneNode(true).content;
      document.getElementById(id).closest('.card').remove();
      elTostContainer.appendChild(clone);
      setTimeout(() => {
        document.querySelector('[role="alert"]').remove();
      }, 2000);
    })
    .catch(() => {})
    .finally(() => {
      loader(false);
    });
});

// login

function isLogin() {
  if (localStorage.getItem('token') === null) {
    return false;
  } else {
    return true;
  }
}

// Exit

elExitBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  location.reload();
});

// acsses token remove

setInterval(() => {
  localStorage.removeItem('token');
}, 1800000);
