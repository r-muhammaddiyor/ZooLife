const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const elLoginForm = document.getElementById('loginForm');
const elSignInButton = document.getElementById('signInButton');
const elTostTemplate = document.querySelector('#tostTemplate');
const elTost = document.querySelector('#tost');
const elSuccessTemplate = document.querySelector('#tostTemplateSuccess');
const elErorTepmlate = document.querySelector('#tostTemplate400');
const elSignUpForm = document.querySelector('#signUpForm');
const elSignUpBotton = document.querySelector('#signUpButton');

// Sign In

elLoginForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  elSignInButton.disabled = true;
  elSignInButton.classList.add('btn-loading');

  const formData = new FormData(elLoginForm);
  const result = {};
  const arr = [];

  formData.forEach((value, key) => {
    result[key] = value;

    if (value.trim() === '') {
      arr.push(key);
    }
  });

  if (arr.length > 0) {
    const clone = elTostTemplate.cloneNode(true).content;
    clone.querySelector('span').innerText = `${arr[0]} kiriting!`;
    elTost.appendChild(clone);

    const focusInput = elLoginForm.querySelector(`[name="${arr[0]}"]`);
    focusInput.focus();

    setTimeout(() => {
      document.querySelector('[role="alert"]').remove();
    }, 1500);

    elSignInButton.disabled = false;
    elSignInButton.classList.remove('btn-loading');
  } else {
    const clone = elSuccessTemplate.cloneNode(true).content;
    elTost.appendChild(clone);

    login(result);

    setTimeout(() => {
      document.querySelector('[role="alert"]').remove();
    }, 2000);
  }
});

function login(data) {
  fetch('https://json-api.uz/api/project/game-over/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);

      localStorage.setItem('token', res.access_token);
      location.href = '../index.html';
    })
    .catch(() => {
      const clone = elErorTepmlate.cloneNode(true).content;
      elTost.appendChild(clone);
      setTimeout(() => {
        document.querySelector('[role="alert"]').remove();
      }, 5000);
    })
    .finally(() => {
      elSignInButton.disabled = false;
      elSignInButton.classList.remove('btn-loading');
      elLoginForm.reset();
    });
}

// Sign Up

elSignUpForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  elSignUpBotton.disabled = true;
  elSignUpBotton.classList.add('btn-loading');

  const formData = new FormData(elSignUpForm);
  const result = {};
  const arr = [];

  formData.forEach((value, key) => {
    result[key] = value;

    if (value.trim() === '') {
      arr.push(key);
    }
  });

  if (arr.length > 0) {
    const clone = elTostTemplate.cloneNode(true).content;
    clone.querySelector('span').innerText = `${arr[0]} kiriting!`;
    elTost.appendChild(clone);

    const focusInput = elSignUpForm.querySelector(`[name="${arr[0]}"]`);
    focusInput.focus();

    setTimeout(() => {
      document.querySelector('[role="alert"]').remove();
    }, 1500);

    elSignUpBotton.disabled = false;
    elSignUpBotton.classList.remove('btn-loading');
  } else {
    const clone = elSuccessTemplate.cloneNode(true).content;
    elTost.appendChild(clone);

    signUp(result);

    setTimeout(() => {
      document.querySelector('[role="alert"]').remove();
    }, 2000);
  }
});
