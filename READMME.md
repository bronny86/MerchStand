Dependencies & Installation

    Initialize the project:

npm init -y

Production Dependencies:

    Express.js: API routing and middleware.
    Mongoose: MongoDB integration.
    bcrypt: Password hashing.
    jsonwebtoken: JWT authentication.
    Helmet: Security headers.
    CORS: Cross-origin resource sharing.

Install using:

npm install express mongoose bcrypt jsonwebtoken helmet cors

Development Dependencies:

    ESLint (Airbnb Style Guide): Code quality enforcement.
    Jest & Supertest: Testing framework and HTTP testing.

Install ESLint with Airbnb:

npx install-peerdeps --dev eslint-config-airbnb-base
npm install --save-dev eslint

Install Jest and Supertest:

npm install --save-dev jest supertest

Add the test script in package.json:

"scripts": {
  "test": "jest"
}