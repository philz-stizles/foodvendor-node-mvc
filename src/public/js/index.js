import Chart from 'chart.js';
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { signup } from './signup';
import { createMenu } from './create-menu';
import { createCategory } from './create-category';
import { createCoupon } from './create-coupon';
import { updateUserData } from './updateUser';
import { createCheckoutSession } from './stripe';
import { showAlert } from './alert';
import { initQuill } from './quill';

// Add map if mapBox exists
const mapBox = document.querySelector('#map');
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

// Add loginForm Handler if loginForm exists
const loginForm = document.querySelector('#loginForm');
if (loginForm) {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams) {
    const email = urlParams.get('email');
    if (email) {
      document.getElementById('email').value = email;
    }
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const credentials = {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
    };

    login(credentials);
  });
}

// Add signupForm Handler if signupForm exists
const signupForm = document.querySelector('#signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const credentials = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
      confirmPassword: document.getElementById('confirmPassword').value,
    };

    signup(credentials);
  });
}

// Add handler to signupBtns if they exists
const signupBtns = document.querySelectorAll('.signupBtn');
console.log(signupBtns);
if (
  signupBtns &&
  NodeList.prototype.isPrototypeOf(signupBtns) &&
  signupBtns.length > 0
) {
  for (let i = 0; i < signupBtns.length; i++) {
    console.log(signupBtns[i]);
    signupBtns[i].addEventListener('click', (e) => {
      e.preventDefault();
      console.log(e.target);
      const credentials = {
        type: e.target.getAttribute('data-type'),
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
      };

      signup(credentials);
    });
  }
}

// Add logoutBtn Handler if logoutBtn exists
const logoutBtn = document.querySelector('#logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();

    logout();
  });
}

// Add quill
let quill;
const container = document.getElementById('editor');
if (container) {
  quill = initQuill();
}

// Add createMenuForm Handler if createMenuForm exists
const createMenuForm = document.querySelector('#createMenuForm');
if (createMenuForm) {
  createMenuForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append(
      'description',
      document.getElementById('editor').children[0].innerHTML,
    );
    formData.append('price', document.getElementById('price').value);
    formData.append(
      'isPublished',
      document.getElementById('isPublished').checked,
    );
    formData.append('photo', document.getElementById('photo').files[0]);

    createMenu(formData);
  });
}

// Add createCouponForm Handler if createCouponForm exists
const createCouponForm = document.querySelector('#createCouponForm');
if (createCouponForm) {
  createCouponForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById('name').value,
      discount: document.getElementById('discount').value,
      expiry: document.getElementById('expiry').value,
      isActive: document.getElementById('isActive').value,
    };

    createCoupon(data);
  });
}

// Add createCategoryForm Handler if createCategoryForm exists
const createCategoryForm = document.querySelector('#createCategoryForm');
if (createCategoryForm) {
  createCategoryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById('name').value,
      description: document.getElementById('description').value,
    };

    createCategory(data);
  });
}

// Add updateUserForm Handler if updateUserForm exists
const updateUserForm = document.querySelector('#updateUserForm');
if (updateUserForm) {
  updateUserForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('photo', document.getElementById('photo').files[0]);
    // const data = {
    //   name: document.getElementById('name').value,
    //   email: document.getElementById('email').value
    // }

    updateUserData(formData, 'data');
  });
}

// Add updatePasswordForm Handler if updatePasswordForm exists
const updatePasswordForm = document.querySelector('#updatePasswordForm');
if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      currentPassword: document.getElementById('currentPassword').value,
      password: document.getElementById('password').value,
      confirmPassword: document.getElementById('confirmPassword').value,
    };

    e.target.textContent = 'Updating ...';

    await updateUserData(data, 'password');

    e.target.textContent = 'Save password';

    updatePasswordForm.reset();
  });
}

// Add orderMenuBtn Handler if orderMenuBtn exists
const orderMenuBtn = document.querySelector('#orderMenuBtn');
if (orderMenuBtn) {
  orderMenuBtn.addEventListener('click', async (e) => {
    const { menuId } = e.target.dataset;
    console.log(menuId);

    e.target.textContent = 'Processing ...';

    await createCheckoutSession(menuId);

    e.target.textContent = 'Book Tour Now!';
  });
}

// check for alerts on body
const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) {
  showAlert('success', alertMessage, 20);
}

const ctx = document.getElementById('myChart').getContext('2d');
if (ctx) {
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [
        {
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}
