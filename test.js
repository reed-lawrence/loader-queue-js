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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var index_1 = require("./index");
var assert = __importStar(require("assert"));
mocha_1.describe('LoaderQueue', function () {
    mocha_1.it('Should add LoaderQueueEvent', function () { return __awaiter(void 0, void 0, void 0, function () {
        var loaderQueue, newEvent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loaderQueue = new index_1.LoaderQueue();
                    return [4 /*yield*/, loaderQueue.add('TestEvent')];
                case 1:
                    newEvent = _a.sent();
                    assert.equal(loaderQueue.length, 1, 'Loader queue length not as expected');
                    assert.equal(newEvent.common_id, 'TestEvent', 'LoaderQueueEvent common_id not as expected');
                    assert.notEqual(newEvent.unique_id, 'TestEvent', 'LoaderQueueEvent unique_id not as expected');
                    return [2 /*return*/];
            }
        });
    }); });
    mocha_1.it('Should reference same queueInstance', function () { return __awaiter(void 0, void 0, void 0, function () {
        var loaderQueue, event;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loaderQueue = new index_1.LoaderQueue();
                    return [4 /*yield*/, loaderQueue.add('TestEvent')];
                case 1:
                    event = _a.sent();
                    assert.equal(event._queueInstance, loaderQueue, 'Loader queue length not as expected');
                    return [2 /*return*/];
            }
        });
    }); });
    mocha_1.it('Should create unique identifiers', function () { return __awaiter(void 0, void 0, void 0, function () {
        var loaderQueue, events, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    loaderQueue = new index_1.LoaderQueue();
                    return [4 /*yield*/, loaderQueue.add('TestEvent')];
                case 1:
                    _a = [
                        _b.sent()
                    ];
                    return [4 /*yield*/, loaderQueue.add('TestEvent')];
                case 2:
                    events = _a.concat([
                        _b.sent()
                    ]);
                    assert.equal(events[0].common_id, events[1].common_id, 'LoaderQueueEvent common_ids should match');
                    assert.notEqual(events[0].unique_id, events[1].unique_id, 'LoaderQueueEvent unique_ids should not collide');
                    return [2 /*return*/];
            }
        });
    }); });
    mocha_1.it('Should remove single instance via string', function () { return __awaiter(void 0, void 0, void 0, function () {
        var loaderQueue, events, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    loaderQueue = new index_1.LoaderQueue();
                    return [4 /*yield*/, loaderQueue.add('TestEvent')];
                case 1:
                    _a = [
                        _b.sent()
                    ];
                    return [4 /*yield*/, loaderQueue.add('TestEvent')];
                case 2:
                    events = _a.concat([
                        _b.sent()
                    ]);
                    return [4 /*yield*/, loaderQueue.remove('TestEvent', false)];
                case 3:
                    _b.sent();
                    assert.equal(loaderQueue.length, 1, 'LoaderQueue length not as expected following remove() event');
                    return [2 /*return*/];
            }
        });
    }); });
    mocha_1.it('Should remove all instances via string', function () { return __awaiter(void 0, void 0, void 0, function () {
        var loaderQueue, events, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    loaderQueue = new index_1.LoaderQueue();
                    return [4 /*yield*/, loaderQueue.add('TestEvent')];
                case 1:
                    _a = [
                        _b.sent()
                    ];
                    return [4 /*yield*/, loaderQueue.add('TestEvent')];
                case 2:
                    _a = _a.concat([
                        _b.sent()
                    ]);
                    return [4 /*yield*/, loaderQueue.add('TestEvent2')];
                case 3:
                    events = _a.concat([
                        _b.sent()
                    ]);
                    return [4 /*yield*/, loaderQueue.remove('TestEvent')];
                case 4:
                    _b.sent();
                    assert.equal(loaderQueue.length, 1, 'LoaderQueue length not as expected following remove() event');
                    return [2 /*return*/];
            }
        });
    }); });
    mocha_1.it('Should remove localized instance of event', function () { return __awaiter(void 0, void 0, void 0, function () {
        var loaderQueue, event;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loaderQueue = new index_1.LoaderQueue();
                    return [4 /*yield*/, loaderQueue.add('TestEvent')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loaderQueue.add('TestEvent2')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loaderQueue.add('TestEvent3')];
                case 3:
                    event = _a.sent();
                    event.remove();
                    assert.equal(loaderQueue.length, 2, 'LoaderQueue length not as expected following remove() event');
                    return [2 /*return*/];
            }
        });
    }); });
    mocha_1.it('Should clear queue', function () { return __awaiter(void 0, void 0, void 0, function () {
        var loaderQueue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loaderQueue = new index_1.LoaderQueue();
                    return [4 /*yield*/, loaderQueue.add('TestEvent')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loaderQueue.add('TestEvent2')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loaderQueue.add('TestEvent3')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loaderQueue.clear()];
                case 4:
                    _a.sent();
                    assert.equal(0, 0, 'LoaderQueue length not as expected following clear() event');
                    return [2 /*return*/];
            }
        });
    }); });
    mocha_1.it('Should auto-remove event if passed as a promise (resolve)', function (done) {
        var loaderQueue = new index_1.LoaderQueue();
        var promiseFn = function () {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve();
                }, 10);
            });
        };
        loaderQueue.add(promiseFn()).then(function () {
            setTimeout(function () {
                assert.equal(0, loaderQueue.length, 'LoaderQueue length not as expected following add() event');
                done();
            }, 20);
        });
    });
    mocha_1.it('Should auto-remove event if passed as a promise (reject)', function (done) {
        var loaderQueue = new index_1.LoaderQueue();
        var promiseFn = function () {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    reject();
                }, 10);
            });
        };
        loaderQueue.add(promiseFn()).then(function () {
            setTimeout(function () {
                assert.equal(0, loaderQueue.length, 'LoaderQueue length not as expected following add() event');
                done();
            }, 20);
        });
    });
    mocha_1.it('Should create unique identifiers for events passed as promises', function () { return __awaiter(void 0, void 0, void 0, function () {
        var loaderQueue, promiseFn, events, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    loaderQueue = new index_1.LoaderQueue();
                    promiseFn = function () {
                        return new Promise(function (resolve) {
                            setTimeout(function () {
                                resolve();
                            }, 10);
                        });
                    };
                    return [4 /*yield*/, loaderQueue.add(promiseFn())];
                case 1:
                    _a = [
                        _b.sent()
                    ];
                    return [4 /*yield*/, loaderQueue.add(promiseFn())];
                case 2:
                    events = _a.concat([
                        _b.sent()
                    ]);
                    assert.notEqual(events[0].unique_id, events[1].unique_id, 'LoaderQueueEvent unique_ids should be unique');
                    return [2 /*return*/];
            }
        });
    }); });
});
mocha_1.describe('LoaderQueue.events', function () {
    mocha_1.it("Should emit " + index_1.QueueEventType.Add + " event upon add", function (done) {
        var loaderQueue = new index_1.LoaderQueue();
        var sub = loaderQueue.events.subscribe(function (ev) {
            sub.unsubscribe();
            assert.equal(ev.type, index_1.QueueEventType.Add, 'Event type fired not as expected');
            done();
        });
        loaderQueue.add('TestEvent');
    });
    mocha_1.it("Should emit " + index_1.QueueEventType.Remove + " event upon remove", function (done) {
        var loaderQueue = new index_1.LoaderQueue();
        loaderQueue.add('TestEvent').then(function (event) {
            var sub = loaderQueue.events.subscribe(function (ev) {
                sub.unsubscribe();
                assert.equal(ev.type, index_1.QueueEventType.Remove, 'Event type fired not as expected');
                done();
            });
            event.remove();
        });
    });
    mocha_1.it("Should emit " + index_1.QueueEventType.Clear + " event upon clear", function (done) {
        var loaderQueue = new index_1.LoaderQueue();
        loaderQueue.add('TestEvent').then(function (event) {
            var sub = loaderQueue.events.subscribe(function (ev) {
                sub.unsubscribe();
                assert.equal(ev.type, index_1.QueueEventType.Clear, 'Event type fired not as expected');
                done();
            });
            loaderQueue.clear();
        });
    });
});
