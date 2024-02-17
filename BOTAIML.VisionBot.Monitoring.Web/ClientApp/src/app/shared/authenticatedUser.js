"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticatedUser = void 0;
var AuthenticatedUser = /** @class */ (function () {
    function AuthenticatedUser(token) {
        this.id = parseInt(token.nameid);
        this.name = token.unique_name;
        if (token.role)
            this.permissions = Array.isArray(token.role) ? token.role : [token.role];
        //this.issuedAt = new Date(token.iat * 1000);
        this.notBefore = new Date(token.nbf * 1000);
        this.expiresAt = new Date(token.exp * 1000);
    }
    AuthenticatedUser.prototype.isTokenValid = function () {
        var curDateTime = new Date();
        return (curDateTime > this.notBefore && curDateTime < this.expiresAt);
    };
    return AuthenticatedUser;
}());
exports.AuthenticatedUser = AuthenticatedUser;
//# sourceMappingURL=authenticatedUser.js.map