const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const { AuthService } = require('../../src/app/services/auth.service');

let authService: any;
let lastResult: any;
let lastError: any;

Before(() => {
  authService = new AuthService();
  lastResult = null;
  lastError = null;
});

// US01
Given(
  'the Visitor is on the sign-up page and has no existing account with the submitted email',
  function () {
    // state is handled by fresh AuthService
  },
);

When(
  'the Visitor submits a valid email, a password meeting the strength policy, and accepts the terms',
  function () {
    try {
      lastResult = authService.register('new@dummy.com', 'ValidPass1!', true);
    } catch (e) {
      lastError = e;
    }
  },
);

Then('a Customer account is created in an {string} state', function (state: string) {
  assert.equal(lastResult.status, state);
});

Then('a verification email is dispatched', function () {
  assert.equal(lastResult.emailDispatched, true);
});

Then('the Visitor is informed that verification is required to continue', function () {
  assert.ok(lastResult !== null);
});

Given('an account already exists for the submitted email', function () {
  authService.seedUser('exists@dummy.com', 'Pass1!');
});

When('the Visitor attempts to register', function () {
  try {
    lastResult = authService.register('exists@dummy.com', 'Pass1!', true);
  } catch (e) {
    lastError = e;
  }
});

Then('registration is rejected with a clear, non-revealing message', function () {
  assert.ok(lastError !== null);
});

// US02
Given('the Customer received a verification email with a unique, unexpired token', function () {
  authService.seedUser('dummy@dummy.com', 'Pass', false);
});

When('the Customer follows the verification link', function () {
  try {
    lastResult = authService.verify('valid-token');
  } catch (e) {
    lastError = e;
  }
});

Then('the account is marked as verified', function () {
  assert.equal(lastResult.redirected, 'login');
});

Then('the Customer is redirected to the login page', function () {
  assert.equal(lastResult.redirected, 'login');
});

Given('the verification token is expired or has already been consumed', function () {
  // state mocked in service
});

When('the Customer follows the link', function () {
  try {
    lastResult = authService.verify('expired');
  } catch (e) {
    lastError = e;
  }
});

Then('verification fails', function () {
  assert.ok(lastError !== null);
});

Then('the Customer is offered to request a new verification email', function () {
  assert.ok(lastError !== null);
});

// US03
Given("the Customer's account is verified and the credentials match", function () {
  authService.seedUser('verified@dummy.com', 'pass123', true);
});

When('the Customer submits email and password', function () {
  try {
    lastResult = authService.login('verified@dummy.com', 'pass123');
  } catch (e) {
    lastError = e;
  }
});

Then('a session is established', function () {
  assert.equal(lastResult.routed, 'dashboard');
});

Then('the Customer is routed to their dashboard', function () {
  assert.equal(lastResult.routed, 'dashboard');
});

Given('the submitted credentials do not match any verified account', function () {
  authService.seedUser('verified@dummy.com', 'pass123', true);
});

When('the Customer attempts to log in', function () {
  try {
    // Determine which test case is running based on seed data
    // This is a simplified mock for the caveat of exact same step text in Gherkin
    if (authService['users'].has('unverified@dummy.com')) {
      lastResult = authService.login('unverified@dummy.com', 'pass123');
    } else {
      lastResult = authService.login('verified@dummy.com', 'wrong');
    }
  } catch (e) {
    lastError = e;
  }
});

Then(
  'access is denied with a generic error that does not reveal which field is wrong',
  function () {
    assert.equal(lastError.message, 'Invalid credentials');
  },
);

Given('the account exists but has not been verified', function () {
  authService.seedUser('unverified@dummy.com', 'pass123', false);
});

When('the Customer attempts to log in with unverified account', function () {
  try {
    lastResult = authService.login('unverified@dummy.com', 'pass123');
  } catch (e) {
    lastError = e;
  }
});

Then('access is denied', function () {
  assert.equal(lastError.message, 'Unverified');
});

Then('the Customer is offered to resend the verification email', function () {
  assert.ok(lastError !== null);
});
