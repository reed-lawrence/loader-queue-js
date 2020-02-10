"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var QueueEventType;
(function (QueueEventType) {
    QueueEventType["Add"] = "ADD";
    QueueEventType["Remove"] = "REMOVE";
    QueueEventType["Clear"] = "CLEAR";
})(QueueEventType = exports.QueueEventType || (exports.QueueEventType = {}));
var LoaderQueue = /** @class */ (function () {
    function LoaderQueue() {
        this._queue = [];
        this.events = new rxjs_1.Subject();
    }
    Object.defineProperty(LoaderQueue.prototype, "length", {
        /**
         * The current length of the LoaderQueue
         */
        get: function () {
            return this._queue.length;
        },
        enumerable: true,
        configurable: true
    });
    LoaderQueue.prototype.generateUID = function (common_id) {
        var _loop_1 = function (i) {
            var randomStr = getRandomInt(10000, 100000).toString();
            var unique_id = common_id + "_" + randomStr;
            var index = this_1._queue.findIndex(function (ev) { return ev.unique_id === unique_id; });
            if (index === -1) {
                return { value: unique_id };
            }
        };
        var this_1 = this;
        for (var i = 0; i < 1000; i++) {
            var state_1 = _loop_1(i);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        throw new Error('Could not generate Unique Identifier for loader event. This likely indicates a problem with the LoaderQueue library');
    };
    LoaderQueue.prototype.add = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var newEvent;
            var _this = this;
            return __generator(this, function (_a) {
                if (typeof event === 'object' && typeof event.then === 'function' && typeof event.catch === 'function') {
                    newEvent = new LoaderQueueEvent(this, 'PromiseLike', this.generateUID('PromiseLike'));
                    event.then(function () { return _this.remove(newEvent); }).catch(function () { return _this.remove(newEvent); });
                }
                else if (typeof event === 'string') {
                    newEvent = new LoaderQueueEvent(this, event, this.generateUID(event));
                }
                else {
                    throw new Error('event provided to LoaderQueue.add is not of type <string> or <Promise>');
                }
                this._queue.push(newEvent);
                // If there are observers of this queue, return the new event added
                if (this.events.observers && this.events.observers.length) {
                    this.events.next({ type: QueueEventType.Add, event: newEvent });
                }
                return [2 /*return*/, newEvent];
            });
        });
    };
    LoaderQueue.prototype.remove = function (event, removeAll) {
        if (removeAll === void 0) { removeAll = true; }
        return __awaiter(this, void 0, void 0, function () {
            var removed, removed, firstIndex, deleted;
            return __generator(this, function (_a) {
                if (!event) {
                    throw new Error('event passed to LoaderQueue.remove must be a string or LoaderQueueEvent type');
                }
                if (event instanceof LoaderQueueEvent) {
                    // If there are observers of this queue, return the array of events removed
                    if (this.events.observers && this.events.observers.length) {
                        removed = this._queue.filter(function (ev) { return ev.unique_id === event.unique_id; });
                        this.events.next({ type: QueueEventType.Remove, event: removed });
                    }
                    this._queue = this._queue.filter(function (ev) { return ev.unique_id !== event.unique_id; });
                    return [2 /*return*/];
                }
                else if (typeof event === 'string') {
                    // If the user has specified to remove all instances of the common string
                    if (removeAll) {
                        // If there are observers of this queue, return the array of events removed
                        if (this.events.observers && this.events.observers.length) {
                            removed = this._queue.filter(function (ev) { return ev.common_id === event; });
                            this.events.next({ type: QueueEventType.Remove, event: removed });
                        }
                        this._queue = this._queue.filter(function (ev) { return ev.common_id !== event; });
                        return [2 /*return*/];
                    }
                    else {
                        firstIndex = this._queue.findIndex(function (ev) { return ev.common_id === event; });
                        if (firstIndex >= 0) {
                            deleted = this._queue.splice(firstIndex, 1);
                            // If there are observers of this queue, return the event removed
                            if (this.events.observers && this.events.observers.length) {
                                this.events.next({ type: QueueEventType.Remove, event: deleted[0] });
                            }
                        }
                        return [2 /*return*/];
                    }
                }
                else {
                    throw new Error('event passed to LoaderQueue.remove must be a string or LoaderQueueEvent type');
                }
                return [2 /*return*/];
            });
        });
    };
    LoaderQueue.prototype.clear = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._queue.length = 0;
                if (this.events.observers && this.events.observers.length) {
                    this.events.next({ type: QueueEventType.Clear });
                }
                return [2 /*return*/];
            });
        });
    };
    return LoaderQueue;
}());
exports.LoaderQueue = LoaderQueue;
var LoaderQueueEvent = /** @class */ (function () {
    function LoaderQueueEvent(queueInstance, common_id, unique_id) {
        this.common_id = '';
        this.unique_id = '';
        if (!queueInstance) {
            throw new Error('No queueInstance provided to LoaderQueueEvent');
        }
        if (!common_id) {
            throw new Error('No commonId provided to LoaderQueueEvent');
        }
        if (!unique_id) {
            throw new Error('No uniqueId provided to LoaderQueueEvent');
        }
        this._queueInstance = queueInstance;
        this.common_id = common_id;
        this.unique_id = unique_id;
    }
    /**
     * Removes this LoaderQueueEvent from the LoaderQueue
     */
    LoaderQueueEvent.prototype.remove = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._queueInstance.remove(this)];
            });
        });
    };
    return LoaderQueueEvent;
}());
exports.LoaderQueueEvent = LoaderQueueEvent;
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
exports.getRandomInt = getRandomInt;
var test = new Promise(function (resolve) { console.log(); });
test.then;
