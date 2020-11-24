"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
exports.validateRegister = (options) => {
    if (options.username.length < 2) {
        return [{
                field: 'username',
                message: 'length must be greater than 2'
            }];
    }
    if (options.username.includes('@')) {
        return [{
                field: 'username',
                message: 'username must not include @'
            }];
    }
    if (!options.email.includes('@')) {
        return [{
                field: 'email',
                message: 'invalid email'
            }];
    }
    if (options.password.length < 8) {
        return [{
                field: 'password',
                message: 'length must be at least 8 characters long'
            }];
    }
    return null;
};
//# sourceMappingURL=validateRegister.js.map