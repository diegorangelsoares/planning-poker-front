// src/__mocks__/socket.js

let callbacks = {};

const socket = {
    emit: jest.fn(),
    on: jest.fn((event, callback) => {
        callbacks[event] = callback;
    }),
    off: jest.fn((event) => {
        delete callbacks[event];
    }),
    __reset: () => { callbacks = {}; },
    __getCallbacks: () => callbacks,
};

export default socket;
