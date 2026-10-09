const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');

function setupApp() {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const dom = new JSDOM(html, {
    url: 'http://localhost/',
    pretendToBeVisual: true,
    runScripts: 'outside-only'
  });

  const { window } = dom;
  window.scrollTo = () => {};
  const localStorageState = {};
  const localStorage = {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(localStorageState, key) ? localStorageState[key] : null;
    },
    setItem(key, value) {
      localStorageState[key] = String(value);
    },
    removeItem(key) {
      delete localStorageState[key];
    },
    clear() {
      Object.keys(localStorageState).forEach((key) => delete localStorageState[key]);
    }
  };

  const context = dom.getInternalVMContext();
  Object.defineProperty(window, 'localStorage', { value: localStorage, configurable: true });
  Object.defineProperty(window, 'sessionStorage', { value: localStorage, configurable: true });

  context.window = window;
  context.document = window.document;
  context.localStorage = localStorage;
  context.console = console;

  const scriptPath = path.join(__dirname, '../script.js');
  const script = fs.readFileSync(scriptPath, 'utf8');
  vm.runInContext(script, context);
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));

  return { window, document: window.document, state: vm.runInContext('state', context), context };
}

test('students can add a shop item to the cart and pay in checkout', () => {
  const { context } = setupApp();
  vm.runInContext("quickLogin('student')", context);
  vm.runInContext("state.shopView = 'canteen'; renderShopPage();", context);

  assert.ok(vm.runInContext("typeof addToCart === 'function'", context));
  vm.runInContext("addToCart('CANTEEN', state.canteen[0].id)", context);

  assert.equal(vm.runInContext("state.cart.length", context), 1);
  assert.equal(vm.runInContext("state.cart[0].productType", context), 'CANTEEN');

  vm.runInContext("checkoutCart()", context);

  assert.equal(vm.runInContext("state.cart.length", context), 0);
  assert.equal(vm.runInContext("state.orders.length", context), 1);
  assert.equal(vm.runInContext("state.orders[0].payment", context), 'Pay now');
});

test('teacher can delete chat messages', () => {
  const { context } = setupApp();
  vm.runInContext("quickLogin('teacher')", context);
  vm.runInContext("state.chats.push({ id: 'msg-1', senderId: 'user-student-1', senderName: 'Student Kyth', senderRole: 'STUDENT', chatType: 'GLOBAL', message: 'Test message', createdAt: new Date().toISOString() }); renderChatPage();", context);

  assert.equal(vm.runInContext("state.chats.length", context), 4);
  assert.ok(vm.runInContext("document.querySelector('[data-delete-message]') !== null", context));

  vm.runInContext("deleteMessage('msg-1')", context);

  assert.equal(vm.runInContext("state.chats.length", context), 3);
});

test('student can edit their profile name from the profile page', () => {
  const { context } = setupApp();
  vm.runInContext("quickLogin('student')", context);

  vm.runInContext("saveProfileName('Kyth Updated')", context);

  assert.equal(vm.runInContext("state.currentUser.name", context), 'Kyth Updated');
  assert.equal(vm.runInContext("state.users.find(user => user.id === 'user-student-1').name", context), 'Kyth Updated');
});

test('teacher can approve orders with a comment and student can see and clear the approval notice', () => {
  const { context } = setupApp();
  vm.runInContext("quickLogin('student')", context);
  vm.runInContext("addToCart('CANTEEN', state.canteen[0].id); checkoutCart();", context);
  vm.runInContext("quickLogin('teacher')", context);

  assert.equal(vm.runInContext("state.orders[0].status", context), 'pending');
  vm.runInContext("saveOrderInstruction(state.orders[0].id, 'Please prepare before 2:00 PM.')", context);
  vm.runInContext("toggleOrderStatus(state.orders[0].id)", context);

  assert.equal(vm.runInContext("state.orders[0].status", context), 'approved');
  assert.equal(vm.runInContext("state.orders[0].teacherNote", context), 'Please prepare before 2:00 PM.');

  vm.runInContext("quickLogin('student')", context);
  assert.ok(vm.runInContext("document.body.textContent.includes('Teacher comment: Please prepare before 2:00 PM.')", context));
  assert.ok(vm.runInContext("document.querySelector('[data-order-clear]') !== null", context));

  vm.runInContext("clearDoneOrderNotice(state.orders[0].id)", context);
  assert.equal(vm.runInContext("state.orders[0].studentCleared", context), true);
});

test('teacher can remove old recent orders without clearing the student notice', () => {
  const { context } = setupApp();
  vm.runInContext("quickLogin('student')", context);
  vm.runInContext("addToCart('CANTEEN', state.canteen[0].id); checkoutCart();", context);
  vm.runInContext("quickLogin('teacher')", context);

  vm.runInContext("saveOrderInstruction(state.orders[0].id, 'Please prepare before 2:00 PM.')", context);
  vm.runInContext("toggleOrderStatus(state.orders[0].id)", context);

  vm.runInContext("removeOrder(state.orders[0].id)", context);
  assert.equal(vm.runInContext("state.orders[0].teacherRemoved", context), true);
  assert.equal(vm.runInContext("state.orders[0].studentCleared", context), false);

  vm.runInContext("quickLogin('student')", context);
  assert.ok(vm.runInContext("document.body.textContent.includes('Approved by teacher')", context));
});
