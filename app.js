/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "4e22b3611f8472212d65"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/public/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(23)(__webpack_require__.s = 23);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0;

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function createStyleElement() {
	var styleElement = document.createElement("style");
	var head = getHeadElement();
	styleElement.type = "text/css";
	head.appendChild(styleElement);
	return styleElement;
}

function createLinkElement() {
	var linkElement = document.createElement("link");
	var head = getHeadElement();
	linkElement.rel = "stylesheet";
	head.appendChild(linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement());
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement();
		update = updateLink.bind(null, styleElement);
		remove = function() {
			styleElement.parentNode.removeChild(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement();
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			styleElement.parentNode.removeChild(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;
	var sourceMap = obj.sourceMap;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var media = obj.media;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "/*!\r\n * Bootstrap v3.3.4 (http://getbootstrap.com)\r\n * Copyright 2011-2015 Twitter, Inc.\r\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\r\n */\r\n\r\n/*! normalize.css v3.0.2 | MIT License | git.io/normalize */\r\nhtml {\r\n  font-family: sans-serif;\r\n  -webkit-text-size-adjust: 100%;\r\n      -ms-text-size-adjust: 100%;\r\n}\r\nbody {\r\n  margin: 0;\r\n}\r\narticle,\r\naside,\r\ndetails,\r\nfigcaption,\r\nfigure,\r\nfooter,\r\nheader,\r\nhgroup,\r\nmain,\r\nmenu,\r\nnav,\r\nsection,\r\nsummary {\r\n  display: block;\r\n}\r\naudio,\r\ncanvas,\r\nprogress,\r\nvideo {\r\n  display: inline-block;\r\n  vertical-align: baseline;\r\n}\r\naudio:not([controls]) {\r\n  display: none;\r\n  height: 0;\r\n}\r\n[hidden],\r\ntemplate {\r\n  display: none;\r\n}\r\na {\r\n  background-color: transparent;\r\n}\r\na:active,\r\na:hover {\r\n  outline: 0;\r\n}\r\nabbr[title] {\r\n  border-bottom: 1px dotted;\r\n}\r\nb,\r\nstrong {\r\n  font-weight: bold;\r\n}\r\ndfn {\r\n  font-style: italic;\r\n}\r\nh1 {\r\n  margin: .67em 0;\r\n  font-size: 2em;\r\n}\r\nmark {\r\n  color: #000;\r\n  background: #ff0;\r\n}\r\nsmall {\r\n  font-size: 80%;\r\n}\r\nsub,\r\nsup {\r\n  position: relative;\r\n  font-size: 75%;\r\n  line-height: 0;\r\n  vertical-align: baseline;\r\n}\r\nsup {\r\n  top: -.5em;\r\n}\r\nsub {\r\n  bottom: -.25em;\r\n}\r\nimg {\r\n  border: 0;\r\n}\r\nsvg:not(:root) {\r\n  overflow: hidden;\r\n}\r\nfigure {\r\n  margin: 1em 40px;\r\n}\r\nhr {\r\n  height: 0;\r\n  -webkit-box-sizing: content-box;\r\n     -moz-box-sizing: content-box;\r\n          box-sizing: content-box;\r\n}\r\npre {\r\n  overflow: auto;\r\n}\r\ncode,\r\nkbd,\r\npre,\r\nsamp {\r\n  font-family: monospace, monospace;\r\n  font-size: 1em;\r\n}\r\nbutton,\r\ninput,\r\noptgroup,\r\nselect,\r\ntextarea {\r\n  margin: 0;\r\n  font: inherit;\r\n  color: inherit;\r\n}\r\nbutton {\r\n  overflow: visible;\r\n}\r\nbutton,\r\nselect {\r\n  text-transform: none;\r\n}\r\nbutton,\r\nhtml input[type=\"button\"],\r\ninput[type=\"reset\"],\r\ninput[type=\"submit\"] {\r\n  -webkit-appearance: button;\r\n  cursor: pointer;\r\n}\r\nbutton[disabled],\r\nhtml input[disabled] {\r\n  cursor: default;\r\n}\r\nbutton::-moz-focus-inner,\r\ninput::-moz-focus-inner {\r\n  padding: 0;\r\n  border: 0;\r\n}\r\ninput {\r\n  line-height: normal;\r\n}\r\ninput[type=\"checkbox\"],\r\ninput[type=\"radio\"] {\r\n  -webkit-box-sizing: border-box;\r\n     -moz-box-sizing: border-box;\r\n          box-sizing: border-box;\r\n  padding: 0;\r\n}\r\ninput[type=\"number\"]::-webkit-inner-spin-button,\r\ninput[type=\"number\"]::-webkit-outer-spin-button {\r\n  height: auto;\r\n}\r\ninput[type=\"search\"] {\r\n  -webkit-box-sizing: content-box;\r\n     -moz-box-sizing: content-box;\r\n          box-sizing: content-box;\r\n  -webkit-appearance: textfield;\r\n}\r\ninput[type=\"search\"]::-webkit-search-cancel-button,\r\ninput[type=\"search\"]::-webkit-search-decoration {\r\n  -webkit-appearance: none;\r\n}\r\nfieldset {\r\n  padding: .35em .625em .75em;\r\n  margin: 0 2px;\r\n  border: 1px solid #c0c0c0;\r\n}\r\nlegend {\r\n  padding: 0;\r\n  border: 0;\r\n}\r\ntextarea {\r\n  overflow: auto;\r\n}\r\noptgroup {\r\n  font-weight: bold;\r\n}\r\ntable {\r\n  border-spacing: 0;\r\n  border-collapse: collapse;\r\n}\r\ntd,\r\nth {\r\n  padding: 0;\r\n}\r\n/*! Source: https://github.com/h5bp/html5-boilerplate/blob/master/src/css/main.css */\r\n@media print {\r\n  *,\r\n  *:before,\r\n  *:after {\r\n    color: #000 !important;\r\n    text-shadow: none !important;\r\n    background: transparent !important;\r\n    -webkit-box-shadow: none !important;\r\n            box-shadow: none !important;\r\n  }\r\n  a,\r\n  a:visited {\r\n    text-decoration: underline;\r\n  }\r\n  a[href]:after {\r\n    content: \" (\" attr(href) \")\";\r\n  }\r\n  abbr[title]:after {\r\n    content: \" (\" attr(title) \")\";\r\n  }\r\n  a[href^=\"#\"]:after,\r\n  a[href^=\"javascript:\"]:after {\r\n    content: \"\";\r\n  }\r\n  pre,\r\n  blockquote {\r\n    border: 1px solid #999;\r\n\r\n    page-break-inside: avoid;\r\n  }\r\n  thead {\r\n    display: table-header-group;\r\n  }\r\n  tr,\r\n  img {\r\n    page-break-inside: avoid;\r\n  }\r\n  img {\r\n    max-width: 100% !important;\r\n  }\r\n  p,\r\n  h2,\r\n  h3 {\r\n    orphans: 3;\r\n    widows: 3;\r\n  }\r\n  h2,\r\n  h3 {\r\n    page-break-after: avoid;\r\n  }\r\n  select {\r\n    background: #fff !important;\r\n  }\r\n  .navbar {\r\n    display: none;\r\n  }\r\n  .btn > .caret,\r\n  .dropup > .btn > .caret {\r\n    border-top-color: #000 !important;\r\n  }\r\n  .label {\r\n    border: 1px solid #000;\r\n  }\r\n  .table {\r\n    border-collapse: collapse !important;\r\n  }\r\n  .table td,\r\n  .table th {\r\n    background-color: #fff !important;\r\n  }\r\n  .table-bordered th,\r\n  .table-bordered td {\r\n    border: 1px solid #ddd !important;\r\n  }\r\n}\r\n/* @font-face { */\r\n/*   font-family: 'Glyphicons Halflings'; */\r\n/*  */\r\n/*   src: url('../fonts/glyphicons-halflings-regular.eot'); */\r\n/*   src: url('../fonts/glyphicons-halflings-regular.eot?#iefix') format('embedded-opentype'), url('../fonts/glyphicons-halflings-regular.woff2') format('woff2'), url('../fonts/glyphicons-halflings-regular.woff') format('woff'), url('../fonts/glyphicons-halflings-regular.ttf') format('truetype'), url('../fonts/glyphicons-halflings-regular.svg#glyphicons_halflingsregular') format('svg'); */\r\n/* } */\r\n.glyphicon {\r\n  position: relative;\r\n  top: 1px;\r\n  display: inline-block;\r\n  font-family: 'Glyphicons Halflings';\r\n  font-style: normal;\r\n  font-weight: normal;\r\n  line-height: 1;\r\n\r\n  -webkit-font-smoothing: antialiased;\r\n  -moz-osx-font-smoothing: grayscale;\r\n}\r\n.glyphicon-asterisk:before {\r\n  content: \"*\";\r\n}\r\n.glyphicon-plus:before {\r\n  content: \"+\";\r\n}\r\n.glyphicon-euro:before,\r\n.glyphicon-eur:before {\r\n  content: \"\\20AC\";\r\n}\r\n.glyphicon-minus:before {\r\n  content: \"\\2212\";\r\n}\r\n.glyphicon-cloud:before {\r\n  content: \"\\2601\";\r\n}\r\n.glyphicon-envelope:before {\r\n  content: \"\\2709\";\r\n}\r\n.glyphicon-pencil:before {\r\n  content: \"\\270F\";\r\n}\r\n.glyphicon-glass:before {\r\n  content: \"\\E001\";\r\n}\r\n.glyphicon-music:before {\r\n  content: \"\\E002\";\r\n}\r\n.glyphicon-search:before {\r\n  content: \"\\E003\";\r\n}\r\n.glyphicon-heart:before {\r\n  content: \"\\E005\";\r\n}\r\n.glyphicon-star:before {\r\n  content: \"\\E006\";\r\n}\r\n.glyphicon-star-empty:before {\r\n  content: \"\\E007\";\r\n}\r\n.glyphicon-user:before {\r\n  content: \"\\E008\";\r\n}\r\n.glyphicon-film:before {\r\n  content: \"\\E009\";\r\n}\r\n.glyphicon-th-large:before {\r\n  content: \"\\E010\";\r\n}\r\n.glyphicon-th:before {\r\n  content: \"\\E011\";\r\n}\r\n.glyphicon-th-list:before {\r\n  content: \"\\E012\";\r\n}\r\n.glyphicon-ok:before {\r\n  content: \"\\E013\";\r\n}\r\n.glyphicon-remove:before {\r\n  content: \"\\E014\";\r\n}\r\n.glyphicon-zoom-in:before {\r\n  content: \"\\E015\";\r\n}\r\n.glyphicon-zoom-out:before {\r\n  content: \"\\E016\";\r\n}\r\n.glyphicon-off:before {\r\n  content: \"\\E017\";\r\n}\r\n.glyphicon-signal:before {\r\n  content: \"\\E018\";\r\n}\r\n.glyphicon-cog:before {\r\n  content: \"\\E019\";\r\n}\r\n.glyphicon-trash:before {\r\n  content: \"\\E020\";\r\n}\r\n.glyphicon-home:before {\r\n  content: \"\\E021\";\r\n}\r\n.glyphicon-file:before {\r\n  content: \"\\E022\";\r\n}\r\n.glyphicon-time:before {\r\n  content: \"\\E023\";\r\n}\r\n.glyphicon-road:before {\r\n  content: \"\\E024\";\r\n}\r\n.glyphicon-download-alt:before {\r\n  content: \"\\E025\";\r\n}\r\n.glyphicon-download:before {\r\n  content: \"\\E026\";\r\n}\r\n.glyphicon-upload:before {\r\n  content: \"\\E027\";\r\n}\r\n.glyphicon-inbox:before {\r\n  content: \"\\E028\";\r\n}\r\n.glyphicon-play-circle:before {\r\n  content: \"\\E029\";\r\n}\r\n.glyphicon-repeat:before {\r\n  content: \"\\E030\";\r\n}\r\n.glyphicon-refresh:before {\r\n  content: \"\\E031\";\r\n}\r\n.glyphicon-list-alt:before {\r\n  content: \"\\E032\";\r\n}\r\n.glyphicon-lock:before {\r\n  content: \"\\E033\";\r\n}\r\n.glyphicon-flag:before {\r\n  content: \"\\E034\";\r\n}\r\n.glyphicon-headphones:before {\r\n  content: \"\\E035\";\r\n}\r\n.glyphicon-volume-off:before {\r\n  content: \"\\E036\";\r\n}\r\n.glyphicon-volume-down:before {\r\n  content: \"\\E037\";\r\n}\r\n.glyphicon-volume-up:before {\r\n  content: \"\\E038\";\r\n}\r\n.glyphicon-qrcode:before {\r\n  content: \"\\E039\";\r\n}\r\n.glyphicon-barcode:before {\r\n  content: \"\\E040\";\r\n}\r\n.glyphicon-tag:before {\r\n  content: \"\\E041\";\r\n}\r\n.glyphicon-tags:before {\r\n  content: \"\\E042\";\r\n}\r\n.glyphicon-book:before {\r\n  content: \"\\E043\";\r\n}\r\n.glyphicon-bookmark:before {\r\n  content: \"\\E044\";\r\n}\r\n.glyphicon-print:before {\r\n  content: \"\\E045\";\r\n}\r\n.glyphicon-camera:before {\r\n  content: \"\\E046\";\r\n}\r\n.glyphicon-font:before {\r\n  content: \"\\E047\";\r\n}\r\n.glyphicon-bold:before {\r\n  content: \"\\E048\";\r\n}\r\n.glyphicon-italic:before {\r\n  content: \"\\E049\";\r\n}\r\n.glyphicon-text-height:before {\r\n  content: \"\\E050\";\r\n}\r\n.glyphicon-text-width:before {\r\n  content: \"\\E051\";\r\n}\r\n.glyphicon-align-left:before {\r\n  content: \"\\E052\";\r\n}\r\n.glyphicon-align-center:before {\r\n  content: \"\\E053\";\r\n}\r\n.glyphicon-align-right:before {\r\n  content: \"\\E054\";\r\n}\r\n.glyphicon-align-justify:before {\r\n  content: \"\\E055\";\r\n}\r\n.glyphicon-list:before {\r\n  content: \"\\E056\";\r\n}\r\n.glyphicon-indent-left:before {\r\n  content: \"\\E057\";\r\n}\r\n.glyphicon-indent-right:before {\r\n  content: \"\\E058\";\r\n}\r\n.glyphicon-facetime-video:before {\r\n  content: \"\\E059\";\r\n}\r\n.glyphicon-picture:before {\r\n  content: \"\\E060\";\r\n}\r\n.glyphicon-map-marker:before {\r\n  content: \"\\E062\";\r\n}\r\n.glyphicon-adjust:before {\r\n  content: \"\\E063\";\r\n}\r\n.glyphicon-tint:before {\r\n  content: \"\\E064\";\r\n}\r\n.glyphicon-edit:before {\r\n  content: \"\\E065\";\r\n}\r\n.glyphicon-share:before {\r\n  content: \"\\E066\";\r\n}\r\n.glyphicon-check:before {\r\n  content: \"\\E067\";\r\n}\r\n.glyphicon-move:before {\r\n  content: \"\\E068\";\r\n}\r\n.glyphicon-step-backward:before {\r\n  content: \"\\E069\";\r\n}\r\n.glyphicon-fast-backward:before {\r\n  content: \"\\E070\";\r\n}\r\n.glyphicon-backward:before {\r\n  content: \"\\E071\";\r\n}\r\n.glyphicon-play:before {\r\n  content: \"\\E072\";\r\n}\r\n.glyphicon-pause:before {\r\n  content: \"\\E073\";\r\n}\r\n.glyphicon-stop:before {\r\n  content: \"\\E074\";\r\n}\r\n.glyphicon-forward:before {\r\n  content: \"\\E075\";\r\n}\r\n.glyphicon-fast-forward:before {\r\n  content: \"\\E076\";\r\n}\r\n.glyphicon-step-forward:before {\r\n  content: \"\\E077\";\r\n}\r\n.glyphicon-eject:before {\r\n  content: \"\\E078\";\r\n}\r\n.glyphicon-chevron-left:before {\r\n  content: \"\\E079\";\r\n}\r\n.glyphicon-chevron-right:before {\r\n  content: \"\\E080\";\r\n}\r\n.glyphicon-plus-sign:before {\r\n  content: \"\\E081\";\r\n}\r\n.glyphicon-minus-sign:before {\r\n  content: \"\\E082\";\r\n}\r\n.glyphicon-remove-sign:before {\r\n  content: \"\\E083\";\r\n}\r\n.glyphicon-ok-sign:before {\r\n  content: \"\\E084\";\r\n}\r\n.glyphicon-question-sign:before {\r\n  content: \"\\E085\";\r\n}\r\n.glyphicon-info-sign:before {\r\n  content: \"\\E086\";\r\n}\r\n.glyphicon-screenshot:before {\r\n  content: \"\\E087\";\r\n}\r\n.glyphicon-remove-circle:before {\r\n  content: \"\\E088\";\r\n}\r\n.glyphicon-ok-circle:before {\r\n  content: \"\\E089\";\r\n}\r\n.glyphicon-ban-circle:before {\r\n  content: \"\\E090\";\r\n}\r\n.glyphicon-arrow-left:before {\r\n  content: \"\\E091\";\r\n}\r\n.glyphicon-arrow-right:before {\r\n  content: \"\\E092\";\r\n}\r\n.glyphicon-arrow-up:before {\r\n  content: \"\\E093\";\r\n}\r\n.glyphicon-arrow-down:before {\r\n  content: \"\\E094\";\r\n}\r\n.glyphicon-share-alt:before {\r\n  content: \"\\E095\";\r\n}\r\n.glyphicon-resize-full:before {\r\n  content: \"\\E096\";\r\n}\r\n.glyphicon-resize-small:before {\r\n  content: \"\\E097\";\r\n}\r\n.glyphicon-exclamation-sign:before {\r\n  content: \"\\E101\";\r\n}\r\n.glyphicon-gift:before {\r\n  content: \"\\E102\";\r\n}\r\n.glyphicon-leaf:before {\r\n  content: \"\\E103\";\r\n}\r\n.glyphicon-fire:before {\r\n  content: \"\\E104\";\r\n}\r\n.glyphicon-eye-open:before {\r\n  content: \"\\E105\";\r\n}\r\n.glyphicon-eye-close:before {\r\n  content: \"\\E106\";\r\n}\r\n.glyphicon-warning-sign:before {\r\n  content: \"\\E107\";\r\n}\r\n.glyphicon-plane:before {\r\n  content: \"\\E108\";\r\n}\r\n.glyphicon-calendar:before {\r\n  content: \"\\E109\";\r\n}\r\n.glyphicon-random:before {\r\n  content: \"\\E110\";\r\n}\r\n.glyphicon-comment:before {\r\n  content: \"\\E111\";\r\n}\r\n.glyphicon-magnet:before {\r\n  content: \"\\E112\";\r\n}\r\n.glyphicon-chevron-up:before {\r\n  content: \"\\E113\";\r\n}\r\n.glyphicon-chevron-down:before {\r\n  content: \"\\E114\";\r\n}\r\n.glyphicon-retweet:before {\r\n  content: \"\\E115\";\r\n}\r\n.glyphicon-shopping-cart:before {\r\n  content: \"\\E116\";\r\n}\r\n.glyphicon-folder-close:before {\r\n  content: \"\\E117\";\r\n}\r\n.glyphicon-folder-open:before {\r\n  content: \"\\E118\";\r\n}\r\n.glyphicon-resize-vertical:before {\r\n  content: \"\\E119\";\r\n}\r\n.glyphicon-resize-horizontal:before {\r\n  content: \"\\E120\";\r\n}\r\n.glyphicon-hdd:before {\r\n  content: \"\\E121\";\r\n}\r\n.glyphicon-bullhorn:before {\r\n  content: \"\\E122\";\r\n}\r\n.glyphicon-bell:before {\r\n  content: \"\\E123\";\r\n}\r\n.glyphicon-certificate:before {\r\n  content: \"\\E124\";\r\n}\r\n.glyphicon-thumbs-up:before {\r\n  content: \"\\E125\";\r\n}\r\n.glyphicon-thumbs-down:before {\r\n  content: \"\\E126\";\r\n}\r\n.glyphicon-hand-right:before {\r\n  content: \"\\E127\";\r\n}\r\n.glyphicon-hand-left:before {\r\n  content: \"\\E128\";\r\n}\r\n.glyphicon-hand-up:before {\r\n  content: \"\\E129\";\r\n}\r\n.glyphicon-hand-down:before {\r\n  content: \"\\E130\";\r\n}\r\n.glyphicon-circle-arrow-right:before {\r\n  content: \"\\E131\";\r\n}\r\n.glyphicon-circle-arrow-left:before {\r\n  content: \"\\E132\";\r\n}\r\n.glyphicon-circle-arrow-up:before {\r\n  content: \"\\E133\";\r\n}\r\n.glyphicon-circle-arrow-down:before {\r\n  content: \"\\E134\";\r\n}\r\n.glyphicon-globe:before {\r\n  content: \"\\E135\";\r\n}\r\n.glyphicon-wrench:before {\r\n  content: \"\\E136\";\r\n}\r\n.glyphicon-tasks:before {\r\n  content: \"\\E137\";\r\n}\r\n.glyphicon-filter:before {\r\n  content: \"\\E138\";\r\n}\r\n.glyphicon-briefcase:before {\r\n  content: \"\\E139\";\r\n}\r\n.glyphicon-fullscreen:before {\r\n  content: \"\\E140\";\r\n}\r\n.glyphicon-dashboard:before {\r\n  content: \"\\E141\";\r\n}\r\n.glyphicon-paperclip:before {\r\n  content: \"\\E142\";\r\n}\r\n.glyphicon-heart-empty:before {\r\n  content: \"\\E143\";\r\n}\r\n.glyphicon-link:before {\r\n  content: \"\\E144\";\r\n}\r\n.glyphicon-phone:before {\r\n  content: \"\\E145\";\r\n}\r\n.glyphicon-pushpin:before {\r\n  content: \"\\E146\";\r\n}\r\n.glyphicon-usd:before {\r\n  content: \"\\E148\";\r\n}\r\n.glyphicon-gbp:before {\r\n  content: \"\\E149\";\r\n}\r\n.glyphicon-sort:before {\r\n  content: \"\\E150\";\r\n}\r\n.glyphicon-sort-by-alphabet:before {\r\n  content: \"\\E151\";\r\n}\r\n.glyphicon-sort-by-alphabet-alt:before {\r\n  content: \"\\E152\";\r\n}\r\n.glyphicon-sort-by-order:before {\r\n  content: \"\\E153\";\r\n}\r\n.glyphicon-sort-by-order-alt:before {\r\n  content: \"\\E154\";\r\n}\r\n.glyphicon-sort-by-attributes:before {\r\n  content: \"\\E155\";\r\n}\r\n.glyphicon-sort-by-attributes-alt:before {\r\n  content: \"\\E156\";\r\n}\r\n.glyphicon-unchecked:before {\r\n  content: \"\\E157\";\r\n}\r\n.glyphicon-expand:before {\r\n  content: \"\\E158\";\r\n}\r\n.glyphicon-collapse-down:before {\r\n  content: \"\\E159\";\r\n}\r\n.glyphicon-collapse-up:before {\r\n  content: \"\\E160\";\r\n}\r\n.glyphicon-log-in:before {\r\n  content: \"\\E161\";\r\n}\r\n.glyphicon-flash:before {\r\n  content: \"\\E162\";\r\n}\r\n.glyphicon-log-out:before {\r\n  content: \"\\E163\";\r\n}\r\n.glyphicon-new-window:before {\r\n  content: \"\\E164\";\r\n}\r\n.glyphicon-record:before {\r\n  content: \"\\E165\";\r\n}\r\n.glyphicon-save:before {\r\n  content: \"\\E166\";\r\n}\r\n.glyphicon-open:before {\r\n  content: \"\\E167\";\r\n}\r\n.glyphicon-saved:before {\r\n  content: \"\\E168\";\r\n}\r\n.glyphicon-import:before {\r\n  content: \"\\E169\";\r\n}\r\n.glyphicon-export:before {\r\n  content: \"\\E170\";\r\n}\r\n.glyphicon-send:before {\r\n  content: \"\\E171\";\r\n}\r\n.glyphicon-floppy-disk:before {\r\n  content: \"\\E172\";\r\n}\r\n.glyphicon-floppy-saved:before {\r\n  content: \"\\E173\";\r\n}\r\n.glyphicon-floppy-remove:before {\r\n  content: \"\\E174\";\r\n}\r\n.glyphicon-floppy-save:before {\r\n  content: \"\\E175\";\r\n}\r\n.glyphicon-floppy-open:before {\r\n  content: \"\\E176\";\r\n}\r\n.glyphicon-credit-card:before {\r\n  content: \"\\E177\";\r\n}\r\n.glyphicon-transfer:before {\r\n  content: \"\\E178\";\r\n}\r\n.glyphicon-cutlery:before {\r\n  content: \"\\E179\";\r\n}\r\n.glyphicon-header:before {\r\n  content: \"\\E180\";\r\n}\r\n.glyphicon-compressed:before {\r\n  content: \"\\E181\";\r\n}\r\n.glyphicon-earphone:before {\r\n  content: \"\\E182\";\r\n}\r\n.glyphicon-phone-alt:before {\r\n  content: \"\\E183\";\r\n}\r\n.glyphicon-tower:before {\r\n  content: \"\\E184\";\r\n}\r\n.glyphicon-stats:before {\r\n  content: \"\\E185\";\r\n}\r\n.glyphicon-sd-video:before {\r\n  content: \"\\E186\";\r\n}\r\n.glyphicon-hd-video:before {\r\n  content: \"\\E187\";\r\n}\r\n.glyphicon-subtitles:before {\r\n  content: \"\\E188\";\r\n}\r\n.glyphicon-sound-stereo:before {\r\n  content: \"\\E189\";\r\n}\r\n.glyphicon-sound-dolby:before {\r\n  content: \"\\E190\";\r\n}\r\n.glyphicon-sound-5-1:before {\r\n  content: \"\\E191\";\r\n}\r\n.glyphicon-sound-6-1:before {\r\n  content: \"\\E192\";\r\n}\r\n.glyphicon-sound-7-1:before {\r\n  content: \"\\E193\";\r\n}\r\n.glyphicon-copyright-mark:before {\r\n  content: \"\\E194\";\r\n}\r\n.glyphicon-registration-mark:before {\r\n  content: \"\\E195\";\r\n}\r\n.glyphicon-cloud-download:before {\r\n  content: \"\\E197\";\r\n}\r\n.glyphicon-cloud-upload:before {\r\n  content: \"\\E198\";\r\n}\r\n.glyphicon-tree-conifer:before {\r\n  content: \"\\E199\";\r\n}\r\n.glyphicon-tree-deciduous:before {\r\n  content: \"\\E200\";\r\n}\r\n.glyphicon-cd:before {\r\n  content: \"\\E201\";\r\n}\r\n.glyphicon-save-file:before {\r\n  content: \"\\E202\";\r\n}\r\n.glyphicon-open-file:before {\r\n  content: \"\\E203\";\r\n}\r\n.glyphicon-level-up:before {\r\n  content: \"\\E204\";\r\n}\r\n.glyphicon-copy:before {\r\n  content: \"\\E205\";\r\n}\r\n.glyphicon-paste:before {\r\n  content: \"\\E206\";\r\n}\r\n.glyphicon-alert:before {\r\n  content: \"\\E209\";\r\n}\r\n.glyphicon-equalizer:before {\r\n  content: \"\\E210\";\r\n}\r\n.glyphicon-king:before {\r\n  content: \"\\E211\";\r\n}\r\n.glyphicon-queen:before {\r\n  content: \"\\E212\";\r\n}\r\n.glyphicon-pawn:before {\r\n  content: \"\\E213\";\r\n}\r\n.glyphicon-bishop:before {\r\n  content: \"\\E214\";\r\n}\r\n.glyphicon-knight:before {\r\n  content: \"\\E215\";\r\n}\r\n.glyphicon-baby-formula:before {\r\n  content: \"\\E216\";\r\n}\r\n.glyphicon-tent:before {\r\n  content: \"\\26FA\";\r\n}\r\n.glyphicon-blackboard:before {\r\n  content: \"\\E218\";\r\n}\r\n.glyphicon-bed:before {\r\n  content: \"\\E219\";\r\n}\r\n.glyphicon-apple:before {\r\n  content: \"\\F8FF\";\r\n}\r\n.glyphicon-erase:before {\r\n  content: \"\\E221\";\r\n}\r\n.glyphicon-hourglass:before {\r\n  content: \"\\231B\";\r\n}\r\n.glyphicon-lamp:before {\r\n  content: \"\\E223\";\r\n}\r\n.glyphicon-duplicate:before {\r\n  content: \"\\E224\";\r\n}\r\n.glyphicon-piggy-bank:before {\r\n  content: \"\\E225\";\r\n}\r\n.glyphicon-scissors:before {\r\n  content: \"\\E226\";\r\n}\r\n.glyphicon-bitcoin:before {\r\n  content: \"\\E227\";\r\n}\r\n.glyphicon-btc:before {\r\n  content: \"\\E227\";\r\n}\r\n.glyphicon-xbt:before {\r\n  content: \"\\E227\";\r\n}\r\n.glyphicon-yen:before {\r\n  content: \"\\A5\";\r\n}\r\n.glyphicon-jpy:before {\r\n  content: \"\\A5\";\r\n}\r\n.glyphicon-ruble:before {\r\n  content: \"\\20BD\";\r\n}\r\n.glyphicon-rub:before {\r\n  content: \"\\20BD\";\r\n}\r\n.glyphicon-scale:before {\r\n  content: \"\\E230\";\r\n}\r\n.glyphicon-ice-lolly:before {\r\n  content: \"\\E231\";\r\n}\r\n.glyphicon-ice-lolly-tasted:before {\r\n  content: \"\\E232\";\r\n}\r\n.glyphicon-education:before {\r\n  content: \"\\E233\";\r\n}\r\n.glyphicon-option-horizontal:before {\r\n  content: \"\\E234\";\r\n}\r\n.glyphicon-option-vertical:before {\r\n  content: \"\\E235\";\r\n}\r\n.glyphicon-menu-hamburger:before {\r\n  content: \"\\E236\";\r\n}\r\n.glyphicon-modal-window:before {\r\n  content: \"\\E237\";\r\n}\r\n.glyphicon-oil:before {\r\n  content: \"\\E238\";\r\n}\r\n.glyphicon-grain:before {\r\n  content: \"\\E239\";\r\n}\r\n.glyphicon-sunglasses:before {\r\n  content: \"\\E240\";\r\n}\r\n.glyphicon-text-size:before {\r\n  content: \"\\E241\";\r\n}\r\n.glyphicon-text-color:before {\r\n  content: \"\\E242\";\r\n}\r\n.glyphicon-text-background:before {\r\n  content: \"\\E243\";\r\n}\r\n.glyphicon-object-align-top:before {\r\n  content: \"\\E244\";\r\n}\r\n.glyphicon-object-align-bottom:before {\r\n  content: \"\\E245\";\r\n}\r\n.glyphicon-object-align-horizontal:before {\r\n  content: \"\\E246\";\r\n}\r\n.glyphicon-object-align-left:before {\r\n  content: \"\\E247\";\r\n}\r\n.glyphicon-object-align-vertical:before {\r\n  content: \"\\E248\";\r\n}\r\n.glyphicon-object-align-right:before {\r\n  content: \"\\E249\";\r\n}\r\n.glyphicon-triangle-right:before {\r\n  content: \"\\E250\";\r\n}\r\n.glyphicon-triangle-left:before {\r\n  content: \"\\E251\";\r\n}\r\n.glyphicon-triangle-bottom:before {\r\n  content: \"\\E252\";\r\n}\r\n.glyphicon-triangle-top:before {\r\n  content: \"\\E253\";\r\n}\r\n.glyphicon-console:before {\r\n  content: \"\\E254\";\r\n}\r\n.glyphicon-superscript:before {\r\n  content: \"\\E255\";\r\n}\r\n.glyphicon-subscript:before {\r\n  content: \"\\E256\";\r\n}\r\n.glyphicon-menu-left:before {\r\n  content: \"\\E257\";\r\n}\r\n.glyphicon-menu-right:before {\r\n  content: \"\\E258\";\r\n}\r\n.glyphicon-menu-down:before {\r\n  content: \"\\E259\";\r\n}\r\n.glyphicon-menu-up:before {\r\n  content: \"\\E260\";\r\n}\r\n* {\r\n  -webkit-box-sizing: border-box;\r\n     -moz-box-sizing: border-box;\r\n          box-sizing: border-box;\r\n}\r\n*:before,\r\n*:after {\r\n  -webkit-box-sizing: border-box;\r\n     -moz-box-sizing: border-box;\r\n          box-sizing: border-box;\r\n}\r\nhtml {\r\n  font-size: 10px;\r\n\r\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\r\n}\r\nbody {\r\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\r\n  font-size: 14px;\r\n  line-height: 1.42857143;\r\n  color: #333;\r\n  background-color: #fff;\r\n}\r\ninput,\r\nbutton,\r\nselect,\r\ntextarea {\r\n  font-family: inherit;\r\n  font-size: inherit;\r\n  line-height: inherit;\r\n}\r\na {\r\n  color: #337ab7;\r\n  text-decoration: none;\r\n}\r\na:hover,\r\na:focus {\r\n  color: #23527c;\r\n  text-decoration: underline;\r\n}\r\na:focus {\r\n  outline: thin dotted;\r\n  outline: 5px auto -webkit-focus-ring-color;\r\n  outline-offset: -2px;\r\n}\r\nfigure {\r\n  margin: 0;\r\n}\r\nimg {\r\n  vertical-align: middle;\r\n}\r\n.img-responsive,\r\n.thumbnail > img,\r\n.thumbnail a > img,\r\n.carousel-inner > .item > img,\r\n.carousel-inner > .item > a > img {\r\n  display: block;\r\n  max-width: 100%;\r\n  height: auto;\r\n}\r\n.img-rounded {\r\n  border-radius: 6px;\r\n}\r\n.img-thumbnail {\r\n  display: inline-block;\r\n  max-width: 100%;\r\n  height: auto;\r\n  padding: 4px;\r\n  line-height: 1.42857143;\r\n  background-color: #fff;\r\n  border: 1px solid #ddd;\r\n  border-radius: 4px;\r\n  -webkit-transition: all .2s ease-in-out;\r\n       -o-transition: all .2s ease-in-out;\r\n          transition: all .2s ease-in-out;\r\n}\r\n.img-circle {\r\n  border-radius: 50%;\r\n}\r\nhr {\r\n  margin-top: 20px;\r\n  margin-bottom: 20px;\r\n  border: 0;\r\n  border-top: 1px solid #eee;\r\n}\r\n.sr-only {\r\n  position: absolute;\r\n  width: 1px;\r\n  height: 1px;\r\n  padding: 0;\r\n  margin: -1px;\r\n  overflow: hidden;\r\n  clip: rect(0, 0, 0, 0);\r\n  border: 0;\r\n}\r\n.sr-only-focusable:active,\r\n.sr-only-focusable:focus {\r\n  position: static;\r\n  width: auto;\r\n  height: auto;\r\n  margin: 0;\r\n  overflow: visible;\r\n  clip: auto;\r\n}\r\n[role=\"button\"] {\r\n  cursor: pointer;\r\n}\r\nh1,\r\nh2,\r\nh3,\r\nh4,\r\nh5,\r\nh6,\r\n.h1,\r\n.h2,\r\n.h3,\r\n.h4,\r\n.h5,\r\n.h6 {\r\n  font-family: inherit;\r\n  font-weight: 500;\r\n  line-height: 1.1;\r\n  color: inherit;\r\n}\r\nh1 small,\r\nh2 small,\r\nh3 small,\r\nh4 small,\r\nh5 small,\r\nh6 small,\r\n.h1 small,\r\n.h2 small,\r\n.h3 small,\r\n.h4 small,\r\n.h5 small,\r\n.h6 small,\r\nh1 .small,\r\nh2 .small,\r\nh3 .small,\r\nh4 .small,\r\nh5 .small,\r\nh6 .small,\r\n.h1 .small,\r\n.h2 .small,\r\n.h3 .small,\r\n.h4 .small,\r\n.h5 .small,\r\n.h6 .small {\r\n  font-weight: normal;\r\n  line-height: 1;\r\n  color: #777;\r\n}\r\nh1,\r\n.h1,\r\nh2,\r\n.h2,\r\nh3,\r\n.h3 {\r\n  margin-top: 20px;\r\n  margin-bottom: 10px;\r\n}\r\nh1 small,\r\n.h1 small,\r\nh2 small,\r\n.h2 small,\r\nh3 small,\r\n.h3 small,\r\nh1 .small,\r\n.h1 .small,\r\nh2 .small,\r\n.h2 .small,\r\nh3 .small,\r\n.h3 .small {\r\n  font-size: 65%;\r\n}\r\nh4,\r\n.h4,\r\nh5,\r\n.h5,\r\nh6,\r\n.h6 {\r\n  margin-top: 10px;\r\n  margin-bottom: 10px;\r\n}\r\nh4 small,\r\n.h4 small,\r\nh5 small,\r\n.h5 small,\r\nh6 small,\r\n.h6 small,\r\nh4 .small,\r\n.h4 .small,\r\nh5 .small,\r\n.h5 .small,\r\nh6 .small,\r\n.h6 .small {\r\n  font-size: 75%;\r\n}\r\nh1,\r\n.h1 {\r\n  font-size: 36px;\r\n}\r\nh2,\r\n.h2 {\r\n  font-size: 30px;\r\n}\r\nh3,\r\n.h3 {\r\n  font-size: 24px;\r\n}\r\nh4,\r\n.h4 {\r\n  font-size: 18px;\r\n}\r\nh5,\r\n.h5 {\r\n  font-size: 14px;\r\n}\r\nh6,\r\n.h6 {\r\n  font-size: 12px;\r\n}\r\np {\r\n  margin: 0 0 10px;\r\n}\r\n.lead {\r\n  margin-bottom: 20px;\r\n  font-size: 16px;\r\n  font-weight: 300;\r\n  line-height: 1.4;\r\n}\r\n@media (min-width: 768px) {\r\n  .lead {\r\n    font-size: 21px;\r\n  }\r\n}\r\nsmall,\r\n.small {\r\n  font-size: 85%;\r\n}\r\nmark,\r\n.mark {\r\n  padding: .2em;\r\n  background-color: #fcf8e3;\r\n}\r\n.text-left {\r\n  text-align: left;\r\n}\r\n.text-right {\r\n  text-align: right;\r\n}\r\n.text-center {\r\n  text-align: center;\r\n}\r\n.text-justify {\r\n  text-align: justify;\r\n}\r\n.text-nowrap {\r\n  white-space: nowrap;\r\n}\r\n.text-lowercase {\r\n  text-transform: lowercase;\r\n}\r\n.text-uppercase {\r\n  text-transform: uppercase;\r\n}\r\n.text-capitalize {\r\n  text-transform: capitalize;\r\n}\r\n.text-muted {\r\n  color: #777;\r\n}\r\n.text-primary {\r\n  color: #337ab7;\r\n}\r\na.text-primary:hover {\r\n  color: #286090;\r\n}\r\n.text-success {\r\n  color: #3c763d;\r\n}\r\na.text-success:hover {\r\n  color: #2b542c;\r\n}\r\n.text-info {\r\n  color: #31708f;\r\n}\r\na.text-info:hover {\r\n  color: #245269;\r\n}\r\n.text-warning {\r\n  color: #8a6d3b;\r\n}\r\na.text-warning:hover {\r\n  color: #66512c;\r\n}\r\n.text-danger {\r\n  color: #a94442;\r\n}\r\na.text-danger:hover {\r\n  color: #843534;\r\n}\r\n.bg-primary {\r\n  color: #fff;\r\n  background-color: #337ab7;\r\n}\r\na.bg-primary:hover {\r\n  background-color: #286090;\r\n}\r\n.bg-success {\r\n  background-color: #dff0d8;\r\n}\r\na.bg-success:hover {\r\n  background-color: #c1e2b3;\r\n}\r\n.bg-info {\r\n  background-color: #d9edf7;\r\n}\r\na.bg-info:hover {\r\n  background-color: #afd9ee;\r\n}\r\n.bg-warning {\r\n  background-color: #fcf8e3;\r\n}\r\na.bg-warning:hover {\r\n  background-color: #f7ecb5;\r\n}\r\n.bg-danger {\r\n  background-color: #f2dede;\r\n}\r\na.bg-danger:hover {\r\n  background-color: #e4b9b9;\r\n}\r\n.page-header {\r\n  padding-bottom: 9px;\r\n  margin: 40px 0 20px;\r\n  border-bottom: 1px solid #eee;\r\n}\r\nul,\r\nol {\r\n  margin-top: 0;\r\n  margin-bottom: 10px;\r\n}\r\nul ul,\r\nol ul,\r\nul ol,\r\nol ol {\r\n  margin-bottom: 0;\r\n}\r\n.list-unstyled {\r\n  padding-left: 0;\r\n  list-style: none;\r\n}\r\n.list-inline {\r\n  padding-left: 0;\r\n  margin-left: -5px;\r\n  list-style: none;\r\n}\r\n.list-inline > li {\r\n  display: inline-block;\r\n  padding-right: 5px;\r\n  padding-left: 5px;\r\n}\r\ndl {\r\n  margin-top: 0;\r\n  margin-bottom: 20px;\r\n}\r\ndt,\r\ndd {\r\n  line-height: 1.42857143;\r\n}\r\ndt {\r\n  font-weight: bold;\r\n}\r\ndd {\r\n  margin-left: 0;\r\n}\r\n@media (min-width: 768px) {\r\n  .dl-horizontal dt {\r\n    float: left;\r\n    width: 160px;\r\n    overflow: hidden;\r\n    clear: left;\r\n    text-align: right;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n  }\r\n  .dl-horizontal dd {\r\n    margin-left: 180px;\r\n  }\r\n}\r\nabbr[title],\r\nabbr[data-original-title] {\r\n  cursor: help;\r\n  border-bottom: 1px dotted #777;\r\n}\r\n.initialism {\r\n  font-size: 90%;\r\n  text-transform: uppercase;\r\n}\r\nblockquote {\r\n  padding: 10px 20px;\r\n  margin: 0 0 20px;\r\n  font-size: 17.5px;\r\n  border-left: 5px solid #eee;\r\n}\r\nblockquote p:last-child,\r\nblockquote ul:last-child,\r\nblockquote ol:last-child {\r\n  margin-bottom: 0;\r\n}\r\nblockquote footer,\r\nblockquote small,\r\nblockquote .small {\r\n  display: block;\r\n  font-size: 80%;\r\n  line-height: 1.42857143;\r\n  color: #777;\r\n}\r\nblockquote footer:before,\r\nblockquote small:before,\r\nblockquote .small:before {\r\n  content: '\\2014   \\A0';\r\n}\r\n.blockquote-reverse,\r\nblockquote.pull-right {\r\n  padding-right: 15px;\r\n  padding-left: 0;\r\n  text-align: right;\r\n  border-right: 5px solid #eee;\r\n  border-left: 0;\r\n}\r\n.blockquote-reverse footer:before,\r\nblockquote.pull-right footer:before,\r\n.blockquote-reverse small:before,\r\nblockquote.pull-right small:before,\r\n.blockquote-reverse .small:before,\r\nblockquote.pull-right .small:before {\r\n  content: '';\r\n}\r\n.blockquote-reverse footer:after,\r\nblockquote.pull-right footer:after,\r\n.blockquote-reverse small:after,\r\nblockquote.pull-right small:after,\r\n.blockquote-reverse .small:after,\r\nblockquote.pull-right .small:after {\r\n  content: '\\A0   \\2014';\r\n}\r\naddress {\r\n  margin-bottom: 20px;\r\n  font-style: normal;\r\n  line-height: 1.42857143;\r\n}\r\ncode,\r\nkbd,\r\npre,\r\nsamp {\r\n  font-family: Menlo, Monaco, Consolas, \"Courier New\", monospace;\r\n}\r\ncode {\r\n  padding: 2px 4px;\r\n  font-size: 90%;\r\n  color: #c7254e;\r\n  background-color: #f9f2f4;\r\n  border-radius: 4px;\r\n}\r\nkbd {\r\n  padding: 2px 4px;\r\n  font-size: 90%;\r\n  color: #fff;\r\n  background-color: #333;\r\n  border-radius: 3px;\r\n  -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .25);\r\n          box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .25);\r\n}\r\nkbd kbd {\r\n  padding: 0;\r\n  font-size: 100%;\r\n  font-weight: bold;\r\n  -webkit-box-shadow: none;\r\n          box-shadow: none;\r\n}\r\npre {\r\n  display: block;\r\n  padding: 9.5px;\r\n  margin: 0 0 10px;\r\n  font-size: 13px;\r\n  line-height: 1.42857143;\r\n  color: #333;\r\n  word-break: break-all;\r\n  word-wrap: break-word;\r\n  background-color: #f5f5f5;\r\n  border: 1px solid #ccc;\r\n  border-radius: 4px;\r\n}\r\npre code {\r\n  padding: 0;\r\n  font-size: inherit;\r\n  color: inherit;\r\n  white-space: pre-wrap;\r\n  background-color: transparent;\r\n  border-radius: 0;\r\n}\r\n.pre-scrollable {\r\n  max-height: 340px;\r\n  overflow-y: scroll;\r\n}\r\n.container {\r\n  padding-right: 15px;\r\n  padding-left: 15px;\r\n  margin-right: auto;\r\n  margin-left: auto;\r\n}\r\n@media (min-width: 768px) {\r\n  .container {\r\n    width: 750px;\r\n  }\r\n}\r\n@media (min-width: 992px) {\r\n  .container {\r\n    width: 970px;\r\n  }\r\n}\r\n@media (min-width: 1200px) {\r\n  .container {\r\n    width: 1170px;\r\n  }\r\n}\r\n.container-fluid {\r\n  padding-right: 15px;\r\n  padding-left: 15px;\r\n  margin-right: auto;\r\n  margin-left: auto;\r\n}\r\n.row {\r\n  margin-right: -15px;\r\n  margin-left: -15px;\r\n}\r\n.col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 {\r\n  position: relative;\r\n  min-height: 1px;\r\n  padding-right: 15px;\r\n  padding-left: 15px;\r\n}\r\n.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12 {\r\n  float: left;\r\n}\r\n.col-xs-12 {\r\n  width: 100%;\r\n}\r\n.col-xs-11 {\r\n  width: 91.66666667%;\r\n}\r\n.col-xs-10 {\r\n  width: 83.33333333%;\r\n}\r\n.col-xs-9 {\r\n  width: 75%;\r\n}\r\n.col-xs-8 {\r\n  width: 66.66666667%;\r\n}\r\n.col-xs-7 {\r\n  width: 58.33333333%;\r\n}\r\n.col-xs-6 {\r\n  width: 50%;\r\n}\r\n.col-xs-5 {\r\n  width: 41.66666667%;\r\n}\r\n.col-xs-4 {\r\n  width: 33.33333333%;\r\n}\r\n.col-xs-3 {\r\n  width: 25%;\r\n}\r\n.col-xs-2 {\r\n  width: 16.66666667%;\r\n}\r\n.col-xs-1 {\r\n  width: 8.33333333%;\r\n}\r\n.col-xs-pull-12 {\r\n  right: 100%;\r\n}\r\n.col-xs-pull-11 {\r\n  right: 91.66666667%;\r\n}\r\n.col-xs-pull-10 {\r\n  right: 83.33333333%;\r\n}\r\n.col-xs-pull-9 {\r\n  right: 75%;\r\n}\r\n.col-xs-pull-8 {\r\n  right: 66.66666667%;\r\n}\r\n.col-xs-pull-7 {\r\n  right: 58.33333333%;\r\n}\r\n.col-xs-pull-6 {\r\n  right: 50%;\r\n}\r\n.col-xs-pull-5 {\r\n  right: 41.66666667%;\r\n}\r\n.col-xs-pull-4 {\r\n  right: 33.33333333%;\r\n}\r\n.col-xs-pull-3 {\r\n  right: 25%;\r\n}\r\n.col-xs-pull-2 {\r\n  right: 16.66666667%;\r\n}\r\n.col-xs-pull-1 {\r\n  right: 8.33333333%;\r\n}\r\n.col-xs-pull-0 {\r\n  right: auto;\r\n}\r\n.col-xs-push-12 {\r\n  left: 100%;\r\n}\r\n.col-xs-push-11 {\r\n  left: 91.66666667%;\r\n}\r\n.col-xs-push-10 {\r\n  left: 83.33333333%;\r\n}\r\n.col-xs-push-9 {\r\n  left: 75%;\r\n}\r\n.col-xs-push-8 {\r\n  left: 66.66666667%;\r\n}\r\n.col-xs-push-7 {\r\n  left: 58.33333333%;\r\n}\r\n.col-xs-push-6 {\r\n  left: 50%;\r\n}\r\n.col-xs-push-5 {\r\n  left: 41.66666667%;\r\n}\r\n.col-xs-push-4 {\r\n  left: 33.33333333%;\r\n}\r\n.col-xs-push-3 {\r\n  left: 25%;\r\n}\r\n.col-xs-push-2 {\r\n  left: 16.66666667%;\r\n}\r\n.col-xs-push-1 {\r\n  left: 8.33333333%;\r\n}\r\n.col-xs-push-0 {\r\n  left: auto;\r\n}\r\n.col-xs-offset-12 {\r\n  margin-left: 100%;\r\n}\r\n.col-xs-offset-11 {\r\n  margin-left: 91.66666667%;\r\n}\r\n.col-xs-offset-10 {\r\n  margin-left: 83.33333333%;\r\n}\r\n.col-xs-offset-9 {\r\n  margin-left: 75%;\r\n}\r\n.col-xs-offset-8 {\r\n  margin-left: 66.66666667%;\r\n}\r\n.col-xs-offset-7 {\r\n  margin-left: 58.33333333%;\r\n}\r\n.col-xs-offset-6 {\r\n  margin-left: 50%;\r\n}\r\n.col-xs-offset-5 {\r\n  margin-left: 41.66666667%;\r\n}\r\n.col-xs-offset-4 {\r\n  margin-left: 33.33333333%;\r\n}\r\n.col-xs-offset-3 {\r\n  margin-left: 25%;\r\n}\r\n.col-xs-offset-2 {\r\n  margin-left: 16.66666667%;\r\n}\r\n.col-xs-offset-1 {\r\n  margin-left: 8.33333333%;\r\n}\r\n.col-xs-offset-0 {\r\n  margin-left: 0;\r\n}\r\n@media (min-width: 768px) {\r\n  .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12 {\r\n    float: left;\r\n  }\r\n  .col-sm-12 {\r\n    width: 100%;\r\n  }\r\n  .col-sm-11 {\r\n    width: 91.66666667%;\r\n  }\r\n  .col-sm-10 {\r\n    width: 83.33333333%;\r\n  }\r\n  .col-sm-9 {\r\n    width: 75%;\r\n  }\r\n  .col-sm-8 {\r\n    width: 66.66666667%;\r\n  }\r\n  .col-sm-7 {\r\n    width: 58.33333333%;\r\n  }\r\n  .col-sm-6 {\r\n    width: 50%;\r\n  }\r\n  .col-sm-5 {\r\n    width: 41.66666667%;\r\n  }\r\n  .col-sm-4 {\r\n    width: 33.33333333%;\r\n  }\r\n  .col-sm-3 {\r\n    width: 25%;\r\n  }\r\n  .col-sm-2 {\r\n    width: 16.66666667%;\r\n  }\r\n  .col-sm-1 {\r\n    width: 8.33333333%;\r\n  }\r\n  .col-sm-pull-12 {\r\n    right: 100%;\r\n  }\r\n  .col-sm-pull-11 {\r\n    right: 91.66666667%;\r\n  }\r\n  .col-sm-pull-10 {\r\n    right: 83.33333333%;\r\n  }\r\n  .col-sm-pull-9 {\r\n    right: 75%;\r\n  }\r\n  .col-sm-pull-8 {\r\n    right: 66.66666667%;\r\n  }\r\n  .col-sm-pull-7 {\r\n    right: 58.33333333%;\r\n  }\r\n  .col-sm-pull-6 {\r\n    right: 50%;\r\n  }\r\n  .col-sm-pull-5 {\r\n    right: 41.66666667%;\r\n  }\r\n  .col-sm-pull-4 {\r\n    right: 33.33333333%;\r\n  }\r\n  .col-sm-pull-3 {\r\n    right: 25%;\r\n  }\r\n  .col-sm-pull-2 {\r\n    right: 16.66666667%;\r\n  }\r\n  .col-sm-pull-1 {\r\n    right: 8.33333333%;\r\n  }\r\n  .col-sm-pull-0 {\r\n    right: auto;\r\n  }\r\n  .col-sm-push-12 {\r\n    left: 100%;\r\n  }\r\n  .col-sm-push-11 {\r\n    left: 91.66666667%;\r\n  }\r\n  .col-sm-push-10 {\r\n    left: 83.33333333%;\r\n  }\r\n  .col-sm-push-9 {\r\n    left: 75%;\r\n  }\r\n  .col-sm-push-8 {\r\n    left: 66.66666667%;\r\n  }\r\n  .col-sm-push-7 {\r\n    left: 58.33333333%;\r\n  }\r\n  .col-sm-push-6 {\r\n    left: 50%;\r\n  }\r\n  .col-sm-push-5 {\r\n    left: 41.66666667%;\r\n  }\r\n  .col-sm-push-4 {\r\n    left: 33.33333333%;\r\n  }\r\n  .col-sm-push-3 {\r\n    left: 25%;\r\n  }\r\n  .col-sm-push-2 {\r\n    left: 16.66666667%;\r\n  }\r\n  .col-sm-push-1 {\r\n    left: 8.33333333%;\r\n  }\r\n  .col-sm-push-0 {\r\n    left: auto;\r\n  }\r\n  .col-sm-offset-12 {\r\n    margin-left: 100%;\r\n  }\r\n  .col-sm-offset-11 {\r\n    margin-left: 91.66666667%;\r\n  }\r\n  .col-sm-offset-10 {\r\n    margin-left: 83.33333333%;\r\n  }\r\n  .col-sm-offset-9 {\r\n    margin-left: 75%;\r\n  }\r\n  .col-sm-offset-8 {\r\n    margin-left: 66.66666667%;\r\n  }\r\n  .col-sm-offset-7 {\r\n    margin-left: 58.33333333%;\r\n  }\r\n  .col-sm-offset-6 {\r\n    margin-left: 50%;\r\n  }\r\n  .col-sm-offset-5 {\r\n    margin-left: 41.66666667%;\r\n  }\r\n  .col-sm-offset-4 {\r\n    margin-left: 33.33333333%;\r\n  }\r\n  .col-sm-offset-3 {\r\n    margin-left: 25%;\r\n  }\r\n  .col-sm-offset-2 {\r\n    margin-left: 16.66666667%;\r\n  }\r\n  .col-sm-offset-1 {\r\n    margin-left: 8.33333333%;\r\n  }\r\n  .col-sm-offset-0 {\r\n    margin-left: 0;\r\n  }\r\n}\r\n@media (min-width: 992px) {\r\n  .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12 {\r\n    float: left;\r\n  }\r\n  .col-md-12 {\r\n    width: 100%;\r\n  }\r\n  .col-md-11 {\r\n    width: 91.66666667%;\r\n  }\r\n  .col-md-10 {\r\n    width: 83.33333333%;\r\n  }\r\n  .col-md-9 {\r\n    width: 75%;\r\n  }\r\n  .col-md-8 {\r\n    width: 66.66666667%;\r\n  }\r\n  .col-md-7 {\r\n    width: 58.33333333%;\r\n  }\r\n  .col-md-6 {\r\n    width: 50%;\r\n  }\r\n  .col-md-5 {\r\n    width: 41.66666667%;\r\n  }\r\n  .col-md-4 {\r\n    width: 33.33333333%;\r\n  }\r\n  .col-md-3 {\r\n    width: 25%;\r\n  }\r\n  .col-md-2 {\r\n    width: 16.66666667%;\r\n  }\r\n  .col-md-1 {\r\n    width: 8.33333333%;\r\n  }\r\n  .col-md-pull-12 {\r\n    right: 100%;\r\n  }\r\n  .col-md-pull-11 {\r\n    right: 91.66666667%;\r\n  }\r\n  .col-md-pull-10 {\r\n    right: 83.33333333%;\r\n  }\r\n  .col-md-pull-9 {\r\n    right: 75%;\r\n  }\r\n  .col-md-pull-8 {\r\n    right: 66.66666667%;\r\n  }\r\n  .col-md-pull-7 {\r\n    right: 58.33333333%;\r\n  }\r\n  .col-md-pull-6 {\r\n    right: 50%;\r\n  }\r\n  .col-md-pull-5 {\r\n    right: 41.66666667%;\r\n  }\r\n  .col-md-pull-4 {\r\n    right: 33.33333333%;\r\n  }\r\n  .col-md-pull-3 {\r\n    right: 25%;\r\n  }\r\n  .col-md-pull-2 {\r\n    right: 16.66666667%;\r\n  }\r\n  .col-md-pull-1 {\r\n    right: 8.33333333%;\r\n  }\r\n  .col-md-pull-0 {\r\n    right: auto;\r\n  }\r\n  .col-md-push-12 {\r\n    left: 100%;\r\n  }\r\n  .col-md-push-11 {\r\n    left: 91.66666667%;\r\n  }\r\n  .col-md-push-10 {\r\n    left: 83.33333333%;\r\n  }\r\n  .col-md-push-9 {\r\n    left: 75%;\r\n  }\r\n  .col-md-push-8 {\r\n    left: 66.66666667%;\r\n  }\r\n  .col-md-push-7 {\r\n    left: 58.33333333%;\r\n  }\r\n  .col-md-push-6 {\r\n    left: 50%;\r\n  }\r\n  .col-md-push-5 {\r\n    left: 41.66666667%;\r\n  }\r\n  .col-md-push-4 {\r\n    left: 33.33333333%;\r\n  }\r\n  .col-md-push-3 {\r\n    left: 25%;\r\n  }\r\n  .col-md-push-2 {\r\n    left: 16.66666667%;\r\n  }\r\n  .col-md-push-1 {\r\n    left: 8.33333333%;\r\n  }\r\n  .col-md-push-0 {\r\n    left: auto;\r\n  }\r\n  .col-md-offset-12 {\r\n    margin-left: 100%;\r\n  }\r\n  .col-md-offset-11 {\r\n    margin-left: 91.66666667%;\r\n  }\r\n  .col-md-offset-10 {\r\n    margin-left: 83.33333333%;\r\n  }\r\n  .col-md-offset-9 {\r\n    margin-left: 75%;\r\n  }\r\n  .col-md-offset-8 {\r\n    margin-left: 66.66666667%;\r\n  }\r\n  .col-md-offset-7 {\r\n    margin-left: 58.33333333%;\r\n  }\r\n  .col-md-offset-6 {\r\n    margin-left: 50%;\r\n  }\r\n  .col-md-offset-5 {\r\n    margin-left: 41.66666667%;\r\n  }\r\n  .col-md-offset-4 {\r\n    margin-left: 33.33333333%;\r\n  }\r\n  .col-md-offset-3 {\r\n    margin-left: 25%;\r\n  }\r\n  .col-md-offset-2 {\r\n    margin-left: 16.66666667%;\r\n  }\r\n  .col-md-offset-1 {\r\n    margin-left: 8.33333333%;\r\n  }\r\n  .col-md-offset-0 {\r\n    margin-left: 0;\r\n  }\r\n}\r\n@media (min-width: 1200px) {\r\n  .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12 {\r\n    float: left;\r\n  }\r\n  .col-lg-12 {\r\n    width: 100%;\r\n  }\r\n  .col-lg-11 {\r\n    width: 91.66666667%;\r\n  }\r\n  .col-lg-10 {\r\n    width: 83.33333333%;\r\n  }\r\n  .col-lg-9 {\r\n    width: 75%;\r\n  }\r\n  .col-lg-8 {\r\n    width: 66.66666667%;\r\n  }\r\n  .col-lg-7 {\r\n    width: 58.33333333%;\r\n  }\r\n  .col-lg-6 {\r\n    width: 50%;\r\n  }\r\n  .col-lg-5 {\r\n    width: 41.66666667%;\r\n  }\r\n  .col-lg-4 {\r\n    width: 33.33333333%;\r\n  }\r\n  .col-lg-3 {\r\n    width: 25%;\r\n  }\r\n  .col-lg-2 {\r\n    width: 16.66666667%;\r\n  }\r\n  .col-lg-1 {\r\n    width: 8.33333333%;\r\n  }\r\n  .col-lg-pull-12 {\r\n    right: 100%;\r\n  }\r\n  .col-lg-pull-11 {\r\n    right: 91.66666667%;\r\n  }\r\n  .col-lg-pull-10 {\r\n    right: 83.33333333%;\r\n  }\r\n  .col-lg-pull-9 {\r\n    right: 75%;\r\n  }\r\n  .col-lg-pull-8 {\r\n    right: 66.66666667%;\r\n  }\r\n  .col-lg-pull-7 {\r\n    right: 58.33333333%;\r\n  }\r\n  .col-lg-pull-6 {\r\n    right: 50%;\r\n  }\r\n  .col-lg-pull-5 {\r\n    right: 41.66666667%;\r\n  }\r\n  .col-lg-pull-4 {\r\n    right: 33.33333333%;\r\n  }\r\n  .col-lg-pull-3 {\r\n    right: 25%;\r\n  }\r\n  .col-lg-pull-2 {\r\n    right: 16.66666667%;\r\n  }\r\n  .col-lg-pull-1 {\r\n    right: 8.33333333%;\r\n  }\r\n  .col-lg-pull-0 {\r\n    right: auto;\r\n  }\r\n  .col-lg-push-12 {\r\n    left: 100%;\r\n  }\r\n  .col-lg-push-11 {\r\n    left: 91.66666667%;\r\n  }\r\n  .col-lg-push-10 {\r\n    left: 83.33333333%;\r\n  }\r\n  .col-lg-push-9 {\r\n    left: 75%;\r\n  }\r\n  .col-lg-push-8 {\r\n    left: 66.66666667%;\r\n  }\r\n  .col-lg-push-7 {\r\n    left: 58.33333333%;\r\n  }\r\n  .col-lg-push-6 {\r\n    left: 50%;\r\n  }\r\n  .col-lg-push-5 {\r\n    left: 41.66666667%;\r\n  }\r\n  .col-lg-push-4 {\r\n    left: 33.33333333%;\r\n  }\r\n  .col-lg-push-3 {\r\n    left: 25%;\r\n  }\r\n  .col-lg-push-2 {\r\n    left: 16.66666667%;\r\n  }\r\n  .col-lg-push-1 {\r\n    left: 8.33333333%;\r\n  }\r\n  .col-lg-push-0 {\r\n    left: auto;\r\n  }\r\n  .col-lg-offset-12 {\r\n    margin-left: 100%;\r\n  }\r\n  .col-lg-offset-11 {\r\n    margin-left: 91.66666667%;\r\n  }\r\n  .col-lg-offset-10 {\r\n    margin-left: 83.33333333%;\r\n  }\r\n  .col-lg-offset-9 {\r\n    margin-left: 75%;\r\n  }\r\n  .col-lg-offset-8 {\r\n    margin-left: 66.66666667%;\r\n  }\r\n  .col-lg-offset-7 {\r\n    margin-left: 58.33333333%;\r\n  }\r\n  .col-lg-offset-6 {\r\n    margin-left: 50%;\r\n  }\r\n  .col-lg-offset-5 {\r\n    margin-left: 41.66666667%;\r\n  }\r\n  .col-lg-offset-4 {\r\n    margin-left: 33.33333333%;\r\n  }\r\n  .col-lg-offset-3 {\r\n    margin-left: 25%;\r\n  }\r\n  .col-lg-offset-2 {\r\n    margin-left: 16.66666667%;\r\n  }\r\n  .col-lg-offset-1 {\r\n    margin-left: 8.33333333%;\r\n  }\r\n  .col-lg-offset-0 {\r\n    margin-left: 0;\r\n  }\r\n}\r\ntable {\r\n  background-color: transparent;\r\n}\r\ncaption {\r\n  padding-top: 8px;\r\n  padding-bottom: 8px;\r\n  color: #777;\r\n  text-align: left;\r\n}\r\nth {\r\n  text-align: left;\r\n}\r\n.table {\r\n  width: 100%;\r\n  max-width: 100%;\r\n  margin-bottom: 20px;\r\n}\r\n.table > thead > tr > th,\r\n.table > tbody > tr > th,\r\n.table > tfoot > tr > th,\r\n.table > thead > tr > td,\r\n.table > tbody > tr > td,\r\n.table > tfoot > tr > td {\r\n  padding: 8px;\r\n  line-height: 1.42857143;\r\n  vertical-align: top;\r\n  border-top: 1px solid #ddd;\r\n}\r\n.table > thead > tr > th {\r\n  vertical-align: bottom;\r\n  border-bottom: 2px solid #ddd;\r\n}\r\n.table > caption + thead > tr:first-child > th,\r\n.table > colgroup + thead > tr:first-child > th,\r\n.table > thead:first-child > tr:first-child > th,\r\n.table > caption + thead > tr:first-child > td,\r\n.table > colgroup + thead > tr:first-child > td,\r\n.table > thead:first-child > tr:first-child > td {\r\n  border-top: 0;\r\n}\r\n.table > tbody + tbody {\r\n  border-top: 2px solid #ddd;\r\n}\r\n.table .table {\r\n  background-color: #fff;\r\n}\r\n.table-condensed > thead > tr > th,\r\n.table-condensed > tbody > tr > th,\r\n.table-condensed > tfoot > tr > th,\r\n.table-condensed > thead > tr > td,\r\n.table-condensed > tbody > tr > td,\r\n.table-condensed > tfoot > tr > td {\r\n  padding: 5px;\r\n}\r\n.table-bordered {\r\n  border: 1px solid #ddd;\r\n}\r\n.table-bordered > thead > tr > th,\r\n.table-bordered > tbody > tr > th,\r\n.table-bordered > tfoot > tr > th,\r\n.table-bordered > thead > tr > td,\r\n.table-bordered > tbody > tr > td,\r\n.table-bordered > tfoot > tr > td {\r\n  border: 1px solid #ddd;\r\n}\r\n.table-bordered > thead > tr > th,\r\n.table-bordered > thead > tr > td {\r\n  border-bottom-width: 2px;\r\n}\r\n.table-striped > tbody > tr:nth-of-type(odd) {\r\n  background-color: #f9f9f9;\r\n}\r\n.table-hover > tbody > tr:hover {\r\n  background-color: #f5f5f5;\r\n}\r\ntable col[class*=\"col-\"] {\r\n  position: static;\r\n  display: table-column;\r\n  float: none;\r\n}\r\ntable td[class*=\"col-\"],\r\ntable th[class*=\"col-\"] {\r\n  position: static;\r\n  display: table-cell;\r\n  float: none;\r\n}\r\n.table > thead > tr > td.active,\r\n.table > tbody > tr > td.active,\r\n.table > tfoot > tr > td.active,\r\n.table > thead > tr > th.active,\r\n.table > tbody > tr > th.active,\r\n.table > tfoot > tr > th.active,\r\n.table > thead > tr.active > td,\r\n.table > tbody > tr.active > td,\r\n.table > tfoot > tr.active > td,\r\n.table > thead > tr.active > th,\r\n.table > tbody > tr.active > th,\r\n.table > tfoot > tr.active > th {\r\n  background-color: #f5f5f5;\r\n}\r\n.table-hover > tbody > tr > td.active:hover,\r\n.table-hover > tbody > tr > th.active:hover,\r\n.table-hover > tbody > tr.active:hover > td,\r\n.table-hover > tbody > tr:hover > .active,\r\n.table-hover > tbody > tr.active:hover > th {\r\n  background-color: #e8e8e8;\r\n}\r\n.table > thead > tr > td.success,\r\n.table > tbody > tr > td.success,\r\n.table > tfoot > tr > td.success,\r\n.table > thead > tr > th.success,\r\n.table > tbody > tr > th.success,\r\n.table > tfoot > tr > th.success,\r\n.table > thead > tr.success > td,\r\n.table > tbody > tr.success > td,\r\n.table > tfoot > tr.success > td,\r\n.table > thead > tr.success > th,\r\n.table > tbody > tr.success > th,\r\n.table > tfoot > tr.success > th {\r\n  background-color: #dff0d8;\r\n}\r\n.table-hover > tbody > tr > td.success:hover,\r\n.table-hover > tbody > tr > th.success:hover,\r\n.table-hover > tbody > tr.success:hover > td,\r\n.table-hover > tbody > tr:hover > .success,\r\n.table-hover > tbody > tr.success:hover > th {\r\n  background-color: #d0e9c6;\r\n}\r\n.table > thead > tr > td.info,\r\n.table > tbody > tr > td.info,\r\n.table > tfoot > tr > td.info,\r\n.table > thead > tr > th.info,\r\n.table > tbody > tr > th.info,\r\n.table > tfoot > tr > th.info,\r\n.table > thead > tr.info > td,\r\n.table > tbody > tr.info > td,\r\n.table > tfoot > tr.info > td,\r\n.table > thead > tr.info > th,\r\n.table > tbody > tr.info > th,\r\n.table > tfoot > tr.info > th {\r\n  background-color: #d9edf7;\r\n}\r\n.table-hover > tbody > tr > td.info:hover,\r\n.table-hover > tbody > tr > th.info:hover,\r\n.table-hover > tbody > tr.info:hover > td,\r\n.table-hover > tbody > tr:hover > .info,\r\n.table-hover > tbody > tr.info:hover > th {\r\n  background-color: #c4e3f3;\r\n}\r\n.table > thead > tr > td.warning,\r\n.table > tbody > tr > td.warning,\r\n.table > tfoot > tr > td.warning,\r\n.table > thead > tr > th.warning,\r\n.table > tbody > tr > th.warning,\r\n.table > tfoot > tr > th.warning,\r\n.table > thead > tr.warning > td,\r\n.table > tbody > tr.warning > td,\r\n.table > tfoot > tr.warning > td,\r\n.table > thead > tr.warning > th,\r\n.table > tbody > tr.warning > th,\r\n.table > tfoot > tr.warning > th {\r\n  background-color: #fcf8e3;\r\n}\r\n.table-hover > tbody > tr > td.warning:hover,\r\n.table-hover > tbody > tr > th.warning:hover,\r\n.table-hover > tbody > tr.warning:hover > td,\r\n.table-hover > tbody > tr:hover > .warning,\r\n.table-hover > tbody > tr.warning:hover > th {\r\n  background-color: #faf2cc;\r\n}\r\n.table > thead > tr > td.danger,\r\n.table > tbody > tr > td.danger,\r\n.table > tfoot > tr > td.danger,\r\n.table > thead > tr > th.danger,\r\n.table > tbody > tr > th.danger,\r\n.table > tfoot > tr > th.danger,\r\n.table > thead > tr.danger > td,\r\n.table > tbody > tr.danger > td,\r\n.table > tfoot > tr.danger > td,\r\n.table > thead > tr.danger > th,\r\n.table > tbody > tr.danger > th,\r\n.table > tfoot > tr.danger > th {\r\n  background-color: #f2dede;\r\n}\r\n.table-hover > tbody > tr > td.danger:hover,\r\n.table-hover > tbody > tr > th.danger:hover,\r\n.table-hover > tbody > tr.danger:hover > td,\r\n.table-hover > tbody > tr:hover > .danger,\r\n.table-hover > tbody > tr.danger:hover > th {\r\n  background-color: #ebcccc;\r\n}\r\n.table-responsive {\r\n  min-height: .01%;\r\n  overflow-x: auto;\r\n}\r\n@media screen and (max-width: 767px) {\r\n  .table-responsive {\r\n    width: 100%;\r\n    margin-bottom: 15px;\r\n    overflow-y: hidden;\r\n    -ms-overflow-style: -ms-autohiding-scrollbar;\r\n    border: 1px solid #ddd;\r\n  }\r\n  .table-responsive > .table {\r\n    margin-bottom: 0;\r\n  }\r\n  .table-responsive > .table > thead > tr > th,\r\n  .table-responsive > .table > tbody > tr > th,\r\n  .table-responsive > .table > tfoot > tr > th,\r\n  .table-responsive > .table > thead > tr > td,\r\n  .table-responsive > .table > tbody > tr > td,\r\n  .table-responsive > .table > tfoot > tr > td {\r\n    white-space: nowrap;\r\n  }\r\n  .table-responsive > .table-bordered {\r\n    border: 0;\r\n  }\r\n  .table-responsive > .table-bordered > thead > tr > th:first-child,\r\n  .table-responsive > .table-bordered > tbody > tr > th:first-child,\r\n  .table-responsive > .table-bordered > tfoot > tr > th:first-child,\r\n  .table-responsive > .table-bordered > thead > tr > td:first-child,\r\n  .table-responsive > .table-bordered > tbody > tr > td:first-child,\r\n  .table-responsive > .table-bordered > tfoot > tr > td:first-child {\r\n    border-left: 0;\r\n  }\r\n  .table-responsive > .table-bordered > thead > tr > th:last-child,\r\n  .table-responsive > .table-bordered > tbody > tr > th:last-child,\r\n  .table-responsive > .table-bordered > tfoot > tr > th:last-child,\r\n  .table-responsive > .table-bordered > thead > tr > td:last-child,\r\n  .table-responsive > .table-bordered > tbody > tr > td:last-child,\r\n  .table-responsive > .table-bordered > tfoot > tr > td:last-child {\r\n    border-right: 0;\r\n  }\r\n  .table-responsive > .table-bordered > tbody > tr:last-child > th,\r\n  .table-responsive > .table-bordered > tfoot > tr:last-child > th,\r\n  .table-responsive > .table-bordered > tbody > tr:last-child > td,\r\n  .table-responsive > .table-bordered > tfoot > tr:last-child > td {\r\n    border-bottom: 0;\r\n  }\r\n}\r\nfieldset {\r\n  min-width: 0;\r\n  padding: 0;\r\n  margin: 0;\r\n  border: 0;\r\n}\r\nlegend {\r\n  display: block;\r\n  width: 100%;\r\n  padding: 0;\r\n  margin-bottom: 20px;\r\n  font-size: 21px;\r\n  line-height: inherit;\r\n  color: #333;\r\n  border: 0;\r\n  border-bottom: 1px solid #e5e5e5;\r\n}\r\nlabel {\r\n  display: inline-block;\r\n  max-width: 100%;\r\n  margin-bottom: 5px;\r\n  font-weight: bold;\r\n}\r\ninput[type=\"search\"] {\r\n  -webkit-box-sizing: border-box;\r\n     -moz-box-sizing: border-box;\r\n          box-sizing: border-box;\r\n}\r\ninput[type=\"radio\"],\r\ninput[type=\"checkbox\"] {\r\n  margin: 4px 0 0;\r\n  margin-top: 1px \\9;\r\n  line-height: normal;\r\n}\r\ninput[type=\"file\"] {\r\n  display: block;\r\n}\r\ninput[type=\"range\"] {\r\n  display: block;\r\n  width: 100%;\r\n}\r\nselect[multiple],\r\nselect[size] {\r\n  height: auto;\r\n}\r\ninput[type=\"file\"]:focus,\r\ninput[type=\"radio\"]:focus,\r\ninput[type=\"checkbox\"]:focus {\r\n  outline: thin dotted;\r\n  outline: 5px auto -webkit-focus-ring-color;\r\n  outline-offset: -2px;\r\n}\r\noutput {\r\n  display: block;\r\n  padding-top: 7px;\r\n  font-size: 14px;\r\n  line-height: 1.42857143;\r\n  color: #555;\r\n}\r\n.form-control {\r\n  display: block;\r\n  width: 100%;\r\n  height: 34px;\r\n  padding: 6px 12px;\r\n  font-size: 14px;\r\n  line-height: 1.42857143;\r\n  color: #555;\r\n  background-color: #fff;\r\n  background-image: none;\r\n  border: 1px solid #ccc;\r\n  border-radius: 4px;\r\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\r\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\r\n  -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;\r\n       -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;\r\n          transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;\r\n}\r\n.form-control:focus {\r\n  border-color: #66afe9;\r\n  outline: 0;\r\n  -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);\r\n          box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6);\r\n}\r\n.form-control::-moz-placeholder {\r\n  color: #999;\r\n  opacity: 1;\r\n}\r\n.form-control:-ms-input-placeholder {\r\n  color: #999;\r\n}\r\n.form-control::-webkit-input-placeholder {\r\n  color: #999;\r\n}\r\n.form-control[disabled],\r\n.form-control[readonly],\r\nfieldset[disabled] .form-control {\r\n  background-color: #eee;\r\n  opacity: 1;\r\n}\r\n.form-control[disabled],\r\nfieldset[disabled] .form-control {\r\n  cursor: not-allowed;\r\n}\r\ntextarea.form-control {\r\n  height: auto;\r\n}\r\ninput[type=\"search\"] {\r\n  -webkit-appearance: none;\r\n}\r\n@media screen and (-webkit-min-device-pixel-ratio: 0) {\r\n  input[type=\"date\"],\r\n  input[type=\"time\"],\r\n  input[type=\"datetime-local\"],\r\n  input[type=\"month\"] {\r\n    line-height: 34px;\r\n  }\r\n  input[type=\"date\"].input-sm,\r\n  input[type=\"time\"].input-sm,\r\n  input[type=\"datetime-local\"].input-sm,\r\n  input[type=\"month\"].input-sm,\r\n  .input-group-sm input[type=\"date\"],\r\n  .input-group-sm input[type=\"time\"],\r\n  .input-group-sm input[type=\"datetime-local\"],\r\n  .input-group-sm input[type=\"month\"] {\r\n    line-height: 30px;\r\n  }\r\n  input[type=\"date\"].input-lg,\r\n  input[type=\"time\"].input-lg,\r\n  input[type=\"datetime-local\"].input-lg,\r\n  input[type=\"month\"].input-lg,\r\n  .input-group-lg input[type=\"date\"],\r\n  .input-group-lg input[type=\"time\"],\r\n  .input-group-lg input[type=\"datetime-local\"],\r\n  .input-group-lg input[type=\"month\"] {\r\n    line-height: 46px;\r\n  }\r\n}\r\n.form-group {\r\n  margin-bottom: 15px;\r\n}\r\n.radio,\r\n.checkbox {\r\n  position: relative;\r\n  display: block;\r\n  margin-top: 10px;\r\n  margin-bottom: 10px;\r\n}\r\n.radio label,\r\n.checkbox label {\r\n  min-height: 20px;\r\n  padding-left: 20px;\r\n  margin-bottom: 0;\r\n  font-weight: normal;\r\n  cursor: pointer;\r\n}\r\n.radio input[type=\"radio\"],\r\n.radio-inline input[type=\"radio\"],\r\n.checkbox input[type=\"checkbox\"],\r\n.checkbox-inline input[type=\"checkbox\"] {\r\n  position: absolute;\r\n  margin-top: 4px \\9;\r\n  margin-left: -20px;\r\n}\r\n.radio + .radio,\r\n.checkbox + .checkbox {\r\n  margin-top: -5px;\r\n}\r\n.radio-inline,\r\n.checkbox-inline {\r\n  position: relative;\r\n  display: inline-block;\r\n  padding-left: 20px;\r\n  margin-bottom: 0;\r\n  font-weight: normal;\r\n  vertical-align: middle;\r\n  cursor: pointer;\r\n}\r\n.radio-inline + .radio-inline,\r\n.checkbox-inline + .checkbox-inline {\r\n  margin-top: 0;\r\n  margin-left: 10px;\r\n}\r\ninput[type=\"radio\"][disabled],\r\ninput[type=\"checkbox\"][disabled],\r\ninput[type=\"radio\"].disabled,\r\ninput[type=\"checkbox\"].disabled,\r\nfieldset[disabled] input[type=\"radio\"],\r\nfieldset[disabled] input[type=\"checkbox\"] {\r\n  cursor: not-allowed;\r\n}\r\n.radio-inline.disabled,\r\n.checkbox-inline.disabled,\r\nfieldset[disabled] .radio-inline,\r\nfieldset[disabled] .checkbox-inline {\r\n  cursor: not-allowed;\r\n}\r\n.radio.disabled label,\r\n.checkbox.disabled label,\r\nfieldset[disabled] .radio label,\r\nfieldset[disabled] .checkbox label {\r\n  cursor: not-allowed;\r\n}\r\n.form-control-static {\r\n  min-height: 34px;\r\n  padding-top: 7px;\r\n  padding-bottom: 7px;\r\n  margin-bottom: 0;\r\n}\r\n.form-control-static.input-lg,\r\n.form-control-static.input-sm {\r\n  padding-right: 0;\r\n  padding-left: 0;\r\n}\r\n.input-sm {\r\n  height: 30px;\r\n  padding: 5px 10px;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  border-radius: 3px;\r\n}\r\nselect.input-sm {\r\n  height: 30px;\r\n  line-height: 30px;\r\n}\r\ntextarea.input-sm,\r\nselect[multiple].input-sm {\r\n  height: auto;\r\n}\r\n.form-group-sm .form-control {\r\n  height: 30px;\r\n  padding: 5px 10px;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  border-radius: 3px;\r\n}\r\nselect.form-group-sm .form-control {\r\n  height: 30px;\r\n  line-height: 30px;\r\n}\r\ntextarea.form-group-sm .form-control,\r\nselect[multiple].form-group-sm .form-control {\r\n  height: auto;\r\n}\r\n.form-group-sm .form-control-static {\r\n  height: 30px;\r\n  min-height: 32px;\r\n  padding: 5px 10px;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n}\r\n.input-lg {\r\n  height: 46px;\r\n  padding: 10px 16px;\r\n  font-size: 18px;\r\n  line-height: 1.3333333;\r\n  border-radius: 6px;\r\n}\r\nselect.input-lg {\r\n  height: 46px;\r\n  line-height: 46px;\r\n}\r\ntextarea.input-lg,\r\nselect[multiple].input-lg {\r\n  height: auto;\r\n}\r\n.form-group-lg .form-control {\r\n  height: 46px;\r\n  padding: 10px 16px;\r\n  font-size: 18px;\r\n  line-height: 1.3333333;\r\n  border-radius: 6px;\r\n}\r\nselect.form-group-lg .form-control {\r\n  height: 46px;\r\n  line-height: 46px;\r\n}\r\ntextarea.form-group-lg .form-control,\r\nselect[multiple].form-group-lg .form-control {\r\n  height: auto;\r\n}\r\n.form-group-lg .form-control-static {\r\n  height: 46px;\r\n  min-height: 38px;\r\n  padding: 10px 16px;\r\n  font-size: 18px;\r\n  line-height: 1.3333333;\r\n}\r\n.has-feedback {\r\n  position: relative;\r\n}\r\n.has-feedback .form-control {\r\n  padding-right: 42.5px;\r\n}\r\n.form-control-feedback {\r\n  position: absolute;\r\n  top: 0;\r\n  right: 0;\r\n  z-index: 2;\r\n  display: block;\r\n  width: 34px;\r\n  height: 34px;\r\n  line-height: 34px;\r\n  text-align: center;\r\n  pointer-events: none;\r\n}\r\n.input-lg + .form-control-feedback {\r\n  width: 46px;\r\n  height: 46px;\r\n  line-height: 46px;\r\n}\r\n.input-sm + .form-control-feedback {\r\n  width: 30px;\r\n  height: 30px;\r\n  line-height: 30px;\r\n}\r\n.has-success .help-block,\r\n.has-success .control-label,\r\n.has-success .radio,\r\n.has-success .checkbox,\r\n.has-success .radio-inline,\r\n.has-success .checkbox-inline,\r\n.has-success.radio label,\r\n.has-success.checkbox label,\r\n.has-success.radio-inline label,\r\n.has-success.checkbox-inline label {\r\n  color: #3c763d;\r\n}\r\n.has-success .form-control {\r\n  border-color: #3c763d;\r\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\r\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\r\n}\r\n.has-success .form-control:focus {\r\n  border-color: #2b542c;\r\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #67b168;\r\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #67b168;\r\n}\r\n.has-success .input-group-addon {\r\n  color: #3c763d;\r\n  background-color: #dff0d8;\r\n  border-color: #3c763d;\r\n}\r\n.has-success .form-control-feedback {\r\n  color: #3c763d;\r\n}\r\n.has-warning .help-block,\r\n.has-warning .control-label,\r\n.has-warning .radio,\r\n.has-warning .checkbox,\r\n.has-warning .radio-inline,\r\n.has-warning .checkbox-inline,\r\n.has-warning.radio label,\r\n.has-warning.checkbox label,\r\n.has-warning.radio-inline label,\r\n.has-warning.checkbox-inline label {\r\n  color: #8a6d3b;\r\n}\r\n.has-warning .form-control {\r\n  border-color: #8a6d3b;\r\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\r\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\r\n}\r\n.has-warning .form-control:focus {\r\n  border-color: #66512c;\r\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #c0a16b;\r\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #c0a16b;\r\n}\r\n.has-warning .input-group-addon {\r\n  color: #8a6d3b;\r\n  background-color: #fcf8e3;\r\n  border-color: #8a6d3b;\r\n}\r\n.has-warning .form-control-feedback {\r\n  color: #8a6d3b;\r\n}\r\n.has-error .help-block,\r\n.has-error .control-label,\r\n.has-error .radio,\r\n.has-error .checkbox,\r\n.has-error .radio-inline,\r\n.has-error .checkbox-inline,\r\n.has-error.radio label,\r\n.has-error.checkbox label,\r\n.has-error.radio-inline label,\r\n.has-error.checkbox-inline label {\r\n  color: #a94442;\r\n}\r\n.has-error .form-control {\r\n  border-color: #a94442;\r\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\r\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\r\n}\r\n.has-error .form-control:focus {\r\n  border-color: #843534;\r\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #ce8483;\r\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 6px #ce8483;\r\n}\r\n.has-error .input-group-addon {\r\n  color: #a94442;\r\n  background-color: #f2dede;\r\n  border-color: #a94442;\r\n}\r\n.has-error .form-control-feedback {\r\n  color: #a94442;\r\n}\r\n.has-feedback label ~ .form-control-feedback {\r\n  top: 25px;\r\n}\r\n.has-feedback label.sr-only ~ .form-control-feedback {\r\n  top: 0;\r\n}\r\n.help-block {\r\n  display: block;\r\n  margin-top: 5px;\r\n  margin-bottom: 10px;\r\n  color: #737373;\r\n}\r\n@media (min-width: 768px) {\r\n  .form-inline .form-group {\r\n    display: inline-block;\r\n    margin-bottom: 0;\r\n    vertical-align: middle;\r\n  }\r\n  .form-inline .form-control {\r\n    display: inline-block;\r\n    width: auto;\r\n    vertical-align: middle;\r\n  }\r\n  .form-inline .form-control-static {\r\n    display: inline-block;\r\n  }\r\n  .form-inline .input-group {\r\n    display: inline-table;\r\n    vertical-align: middle;\r\n  }\r\n  .form-inline .input-group .input-group-addon,\r\n  .form-inline .input-group .input-group-btn,\r\n  .form-inline .input-group .form-control {\r\n    width: auto;\r\n  }\r\n  .form-inline .input-group > .form-control {\r\n    width: 100%;\r\n  }\r\n  .form-inline .control-label {\r\n    margin-bottom: 0;\r\n    vertical-align: middle;\r\n  }\r\n  .form-inline .radio,\r\n  .form-inline .checkbox {\r\n    display: inline-block;\r\n    margin-top: 0;\r\n    margin-bottom: 0;\r\n    vertical-align: middle;\r\n  }\r\n  .form-inline .radio label,\r\n  .form-inline .checkbox label {\r\n    padding-left: 0;\r\n  }\r\n  .form-inline .radio input[type=\"radio\"],\r\n  .form-inline .checkbox input[type=\"checkbox\"] {\r\n    position: relative;\r\n    margin-left: 0;\r\n  }\r\n  .form-inline .has-feedback .form-control-feedback {\r\n    top: 0;\r\n  }\r\n}\r\n.form-horizontal .radio,\r\n.form-horizontal .checkbox,\r\n.form-horizontal .radio-inline,\r\n.form-horizontal .checkbox-inline {\r\n  padding-top: 7px;\r\n  margin-top: 0;\r\n  margin-bottom: 0;\r\n}\r\n.form-horizontal .radio,\r\n.form-horizontal .checkbox {\r\n  min-height: 27px;\r\n}\r\n.form-horizontal .form-group {\r\n  margin-right: -15px;\r\n  margin-left: -15px;\r\n}\r\n@media (min-width: 768px) {\r\n  .form-horizontal .control-label {\r\n    padding-top: 7px;\r\n    margin-bottom: 0;\r\n    text-align: right;\r\n  }\r\n}\r\n.form-horizontal .has-feedback .form-control-feedback {\r\n  right: 15px;\r\n}\r\n@media (min-width: 768px) {\r\n  .form-horizontal .form-group-lg .control-label {\r\n    padding-top: 14.333333px;\r\n  }\r\n}\r\n@media (min-width: 768px) {\r\n  .form-horizontal .form-group-sm .control-label {\r\n    padding-top: 6px;\r\n  }\r\n}\r\n.btn {\r\n  display: inline-block;\r\n  padding: 6px 12px;\r\n  margin-bottom: 0;\r\n  font-size: 14px;\r\n  font-weight: normal;\r\n  line-height: 1.42857143;\r\n  text-align: center;\r\n  white-space: nowrap;\r\n  vertical-align: middle;\r\n  -ms-touch-action: manipulation;\r\n      touch-action: manipulation;\r\n  cursor: pointer;\r\n  -webkit-user-select: none;\r\n     -moz-user-select: none;\r\n      -ms-user-select: none;\r\n          user-select: none;\r\n  background-image: none;\r\n  border: 1px solid transparent;\r\n  border-radius: 4px;\r\n}\r\n.btn:focus,\r\n.btn:active:focus,\r\n.btn.active:focus,\r\n.btn.focus,\r\n.btn:active.focus,\r\n.btn.active.focus {\r\n  outline: thin dotted;\r\n  outline: 5px auto -webkit-focus-ring-color;\r\n  outline-offset: -2px;\r\n}\r\n.btn:hover,\r\n.btn:focus,\r\n.btn.focus {\r\n  color: #333;\r\n  text-decoration: none;\r\n}\r\n.btn:active,\r\n.btn.active {\r\n  background-image: none;\r\n  outline: 0;\r\n  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);\r\n          box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);\r\n}\r\n.btn.disabled,\r\n.btn[disabled],\r\nfieldset[disabled] .btn {\r\n  pointer-events: none;\r\n  cursor: not-allowed;\r\n  filter: alpha(opacity=65);\r\n  -webkit-box-shadow: none;\r\n          box-shadow: none;\r\n  opacity: .65;\r\n}\r\n.btn-default {\r\n  color: #333;\r\n  background-color: #fff;\r\n  border-color: #ccc;\r\n}\r\n.btn-default:hover,\r\n.btn-default:focus,\r\n.btn-default.focus,\r\n.btn-default:active,\r\n.btn-default.active,\r\n.open > .dropdown-toggle.btn-default {\r\n  color: #333;\r\n  background-color: #e6e6e6;\r\n  border-color: #adadad;\r\n}\r\n.btn-default:active,\r\n.btn-default.active,\r\n.open > .dropdown-toggle.btn-default {\r\n  background-image: none;\r\n}\r\n.btn-default.disabled,\r\n.btn-default[disabled],\r\nfieldset[disabled] .btn-default,\r\n.btn-default.disabled:hover,\r\n.btn-default[disabled]:hover,\r\nfieldset[disabled] .btn-default:hover,\r\n.btn-default.disabled:focus,\r\n.btn-default[disabled]:focus,\r\nfieldset[disabled] .btn-default:focus,\r\n.btn-default.disabled.focus,\r\n.btn-default[disabled].focus,\r\nfieldset[disabled] .btn-default.focus,\r\n.btn-default.disabled:active,\r\n.btn-default[disabled]:active,\r\nfieldset[disabled] .btn-default:active,\r\n.btn-default.disabled.active,\r\n.btn-default[disabled].active,\r\nfieldset[disabled] .btn-default.active {\r\n  background-color: #fff;\r\n  border-color: #ccc;\r\n}\r\n.btn-default .badge {\r\n  color: #fff;\r\n  background-color: #333;\r\n}\r\n.btn-primary {\r\n  color: #fff;\r\n  background-color: #337ab7;\r\n  border-color: #2e6da4;\r\n}\r\n.btn-primary:hover,\r\n.btn-primary:focus,\r\n.btn-primary.focus,\r\n.btn-primary:active,\r\n.btn-primary.active,\r\n.open > .dropdown-toggle.btn-primary {\r\n  color: #fff;\r\n  background-color: #286090;\r\n  border-color: #204d74;\r\n}\r\n.btn-primary:active,\r\n.btn-primary.active,\r\n.open > .dropdown-toggle.btn-primary {\r\n  background-image: none;\r\n}\r\n.btn-primary.disabled,\r\n.btn-primary[disabled],\r\nfieldset[disabled] .btn-primary,\r\n.btn-primary.disabled:hover,\r\n.btn-primary[disabled]:hover,\r\nfieldset[disabled] .btn-primary:hover,\r\n.btn-primary.disabled:focus,\r\n.btn-primary[disabled]:focus,\r\nfieldset[disabled] .btn-primary:focus,\r\n.btn-primary.disabled.focus,\r\n.btn-primary[disabled].focus,\r\nfieldset[disabled] .btn-primary.focus,\r\n.btn-primary.disabled:active,\r\n.btn-primary[disabled]:active,\r\nfieldset[disabled] .btn-primary:active,\r\n.btn-primary.disabled.active,\r\n.btn-primary[disabled].active,\r\nfieldset[disabled] .btn-primary.active {\r\n  background-color: #337ab7;\r\n  border-color: #2e6da4;\r\n}\r\n.btn-primary .badge {\r\n  color: #337ab7;\r\n  background-color: #fff;\r\n}\r\n.btn-success {\r\n  color: #fff;\r\n  background-color: #5cb85c;\r\n  border-color: #4cae4c;\r\n}\r\n.btn-success:hover,\r\n.btn-success:focus,\r\n.btn-success.focus,\r\n.btn-success:active,\r\n.btn-success.active,\r\n.open > .dropdown-toggle.btn-success {\r\n  color: #fff;\r\n  background-color: #449d44;\r\n  border-color: #398439;\r\n}\r\n.btn-success:active,\r\n.btn-success.active,\r\n.open > .dropdown-toggle.btn-success {\r\n  background-image: none;\r\n}\r\n.btn-success.disabled,\r\n.btn-success[disabled],\r\nfieldset[disabled] .btn-success,\r\n.btn-success.disabled:hover,\r\n.btn-success[disabled]:hover,\r\nfieldset[disabled] .btn-success:hover,\r\n.btn-success.disabled:focus,\r\n.btn-success[disabled]:focus,\r\nfieldset[disabled] .btn-success:focus,\r\n.btn-success.disabled.focus,\r\n.btn-success[disabled].focus,\r\nfieldset[disabled] .btn-success.focus,\r\n.btn-success.disabled:active,\r\n.btn-success[disabled]:active,\r\nfieldset[disabled] .btn-success:active,\r\n.btn-success.disabled.active,\r\n.btn-success[disabled].active,\r\nfieldset[disabled] .btn-success.active {\r\n  background-color: #5cb85c;\r\n  border-color: #4cae4c;\r\n}\r\n.btn-success .badge {\r\n  color: #5cb85c;\r\n  background-color: #fff;\r\n}\r\n.btn-info {\r\n  color: #fff;\r\n  background-color: #5bc0de;\r\n  border-color: #46b8da;\r\n}\r\n.btn-info:hover,\r\n.btn-info:focus,\r\n.btn-info.focus,\r\n.btn-info:active,\r\n.btn-info.active,\r\n.open > .dropdown-toggle.btn-info {\r\n  color: #fff;\r\n  background-color: #31b0d5;\r\n  border-color: #269abc;\r\n}\r\n.btn-info:active,\r\n.btn-info.active,\r\n.open > .dropdown-toggle.btn-info {\r\n  background-image: none;\r\n}\r\n.btn-info.disabled,\r\n.btn-info[disabled],\r\nfieldset[disabled] .btn-info,\r\n.btn-info.disabled:hover,\r\n.btn-info[disabled]:hover,\r\nfieldset[disabled] .btn-info:hover,\r\n.btn-info.disabled:focus,\r\n.btn-info[disabled]:focus,\r\nfieldset[disabled] .btn-info:focus,\r\n.btn-info.disabled.focus,\r\n.btn-info[disabled].focus,\r\nfieldset[disabled] .btn-info.focus,\r\n.btn-info.disabled:active,\r\n.btn-info[disabled]:active,\r\nfieldset[disabled] .btn-info:active,\r\n.btn-info.disabled.active,\r\n.btn-info[disabled].active,\r\nfieldset[disabled] .btn-info.active {\r\n  background-color: #5bc0de;\r\n  border-color: #46b8da;\r\n}\r\n.btn-info .badge {\r\n  color: #5bc0de;\r\n  background-color: #fff;\r\n}\r\n.btn-warning {\r\n  color: #fff;\r\n  background-color: #f0ad4e;\r\n  border-color: #eea236;\r\n}\r\n.btn-warning:hover,\r\n.btn-warning:focus,\r\n.btn-warning.focus,\r\n.btn-warning:active,\r\n.btn-warning.active,\r\n.open > .dropdown-toggle.btn-warning {\r\n  color: #fff;\r\n  background-color: #ec971f;\r\n  border-color: #d58512;\r\n}\r\n.btn-warning:active,\r\n.btn-warning.active,\r\n.open > .dropdown-toggle.btn-warning {\r\n  background-image: none;\r\n}\r\n.btn-warning.disabled,\r\n.btn-warning[disabled],\r\nfieldset[disabled] .btn-warning,\r\n.btn-warning.disabled:hover,\r\n.btn-warning[disabled]:hover,\r\nfieldset[disabled] .btn-warning:hover,\r\n.btn-warning.disabled:focus,\r\n.btn-warning[disabled]:focus,\r\nfieldset[disabled] .btn-warning:focus,\r\n.btn-warning.disabled.focus,\r\n.btn-warning[disabled].focus,\r\nfieldset[disabled] .btn-warning.focus,\r\n.btn-warning.disabled:active,\r\n.btn-warning[disabled]:active,\r\nfieldset[disabled] .btn-warning:active,\r\n.btn-warning.disabled.active,\r\n.btn-warning[disabled].active,\r\nfieldset[disabled] .btn-warning.active {\r\n  background-color: #f0ad4e;\r\n  border-color: #eea236;\r\n}\r\n.btn-warning .badge {\r\n  color: #f0ad4e;\r\n  background-color: #fff;\r\n}\r\n.btn-danger {\r\n  color: #fff;\r\n  background-color: #d9534f;\r\n  border-color: #d43f3a;\r\n}\r\n.btn-danger:hover,\r\n.btn-danger:focus,\r\n.btn-danger.focus,\r\n.btn-danger:active,\r\n.btn-danger.active,\r\n.open > .dropdown-toggle.btn-danger {\r\n  color: #fff;\r\n  background-color: #c9302c;\r\n  border-color: #ac2925;\r\n}\r\n.btn-danger:active,\r\n.btn-danger.active,\r\n.open > .dropdown-toggle.btn-danger {\r\n  background-image: none;\r\n}\r\n.btn-danger.disabled,\r\n.btn-danger[disabled],\r\nfieldset[disabled] .btn-danger,\r\n.btn-danger.disabled:hover,\r\n.btn-danger[disabled]:hover,\r\nfieldset[disabled] .btn-danger:hover,\r\n.btn-danger.disabled:focus,\r\n.btn-danger[disabled]:focus,\r\nfieldset[disabled] .btn-danger:focus,\r\n.btn-danger.disabled.focus,\r\n.btn-danger[disabled].focus,\r\nfieldset[disabled] .btn-danger.focus,\r\n.btn-danger.disabled:active,\r\n.btn-danger[disabled]:active,\r\nfieldset[disabled] .btn-danger:active,\r\n.btn-danger.disabled.active,\r\n.btn-danger[disabled].active,\r\nfieldset[disabled] .btn-danger.active {\r\n  background-color: #d9534f;\r\n  border-color: #d43f3a;\r\n}\r\n.btn-danger .badge {\r\n  color: #d9534f;\r\n  background-color: #fff;\r\n}\r\n.btn-link {\r\n  font-weight: normal;\r\n  color: #337ab7;\r\n  border-radius: 0;\r\n}\r\n.btn-link,\r\n.btn-link:active,\r\n.btn-link.active,\r\n.btn-link[disabled],\r\nfieldset[disabled] .btn-link {\r\n  background-color: transparent;\r\n  -webkit-box-shadow: none;\r\n          box-shadow: none;\r\n}\r\n.btn-link,\r\n.btn-link:hover,\r\n.btn-link:focus,\r\n.btn-link:active {\r\n  border-color: transparent;\r\n}\r\n.btn-link:hover,\r\n.btn-link:focus {\r\n  color: #23527c;\r\n  text-decoration: underline;\r\n  background-color: transparent;\r\n}\r\n.btn-link[disabled]:hover,\r\nfieldset[disabled] .btn-link:hover,\r\n.btn-link[disabled]:focus,\r\nfieldset[disabled] .btn-link:focus {\r\n  color: #777;\r\n  text-decoration: none;\r\n}\r\n.btn-lg,\r\n.btn-group-lg > .btn {\r\n  padding: 10px 16px;\r\n  font-size: 18px;\r\n  line-height: 1.3333333;\r\n  border-radius: 6px;\r\n}\r\n.btn-sm,\r\n.btn-group-sm > .btn {\r\n  padding: 5px 10px;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  border-radius: 3px;\r\n}\r\n.btn-xs,\r\n.btn-group-xs > .btn {\r\n  padding: 1px 5px;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  border-radius: 3px;\r\n}\r\n.btn-block {\r\n  display: block;\r\n  width: 100%;\r\n}\r\n.btn-block + .btn-block {\r\n  margin-top: 5px;\r\n}\r\ninput[type=\"submit\"].btn-block,\r\ninput[type=\"reset\"].btn-block,\r\ninput[type=\"button\"].btn-block {\r\n  width: 100%;\r\n}\r\n.fade {\r\n  opacity: 0;\r\n  -webkit-transition: opacity .15s linear;\r\n       -o-transition: opacity .15s linear;\r\n          transition: opacity .15s linear;\r\n}\r\n.fade.in {\r\n  opacity: 1;\r\n}\r\n.collapse {\r\n  display: none;\r\n}\r\n.collapse.in {\r\n  display: block;\r\n}\r\ntr.collapse.in {\r\n  display: table-row;\r\n}\r\ntbody.collapse.in {\r\n  display: table-row-group;\r\n}\r\n.collapsing {\r\n  position: relative;\r\n  height: 0;\r\n  overflow: hidden;\r\n  -webkit-transition-timing-function: ease;\r\n       -o-transition-timing-function: ease;\r\n          transition-timing-function: ease;\r\n  -webkit-transition-duration: .35s;\r\n       -o-transition-duration: .35s;\r\n          transition-duration: .35s;\r\n  -webkit-transition-property: height, visibility;\r\n       -o-transition-property: height, visibility;\r\n          transition-property: height, visibility;\r\n}\r\n.caret {\r\n  display: inline-block;\r\n  width: 0;\r\n  height: 0;\r\n  margin-left: 2px;\r\n  vertical-align: middle;\r\n  border-top: 4px dashed;\r\n  border-right: 4px solid transparent;\r\n  border-left: 4px solid transparent;\r\n}\r\n.dropup,\r\n.dropdown {\r\n  position: relative;\r\n}\r\n.dropdown-toggle:focus {\r\n  outline: 0;\r\n}\r\n.dropdown-menu {\r\n  position: absolute;\r\n  top: 100%;\r\n  left: 0;\r\n  z-index: 1000;\r\n  display: none;\r\n  float: left;\r\n  min-width: 160px;\r\n  padding: 5px 0;\r\n  margin: 2px 0 0;\r\n  font-size: 14px;\r\n  text-align: left;\r\n  list-style: none;\r\n  background-color: #fff;\r\n  -webkit-background-clip: padding-box;\r\n          background-clip: padding-box;\r\n  border: 1px solid #ccc;\r\n  border: 1px solid rgba(0, 0, 0, .15);\r\n  border-radius: 4px;\r\n  -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, .175);\r\n          box-shadow: 0 6px 12px rgba(0, 0, 0, .175);\r\n}\r\n.dropdown-menu.pull-right {\r\n  right: 0;\r\n  left: auto;\r\n}\r\n.dropdown-menu .divider {\r\n  height: 1px;\r\n  margin: 9px 0;\r\n  overflow: hidden;\r\n  background-color: #e5e5e5;\r\n}\r\n.dropdown-menu > li > a {\r\n  display: block;\r\n  padding: 3px 20px;\r\n  clear: both;\r\n  font-weight: normal;\r\n  line-height: 1.42857143;\r\n  color: #333;\r\n  white-space: nowrap;\r\n}\r\n.dropdown-menu > li > a:hover,\r\n.dropdown-menu > li > a:focus {\r\n  color: #262626;\r\n  text-decoration: none;\r\n  background-color: #f5f5f5;\r\n}\r\n.dropdown-menu > .active > a,\r\n.dropdown-menu > .active > a:hover,\r\n.dropdown-menu > .active > a:focus {\r\n  color: #fff;\r\n  text-decoration: none;\r\n  background-color: #337ab7;\r\n  outline: 0;\r\n}\r\n.dropdown-menu > .disabled > a,\r\n.dropdown-menu > .disabled > a:hover,\r\n.dropdown-menu > .disabled > a:focus {\r\n  color: #777;\r\n}\r\n.dropdown-menu > .disabled > a:hover,\r\n.dropdown-menu > .disabled > a:focus {\r\n  text-decoration: none;\r\n  cursor: not-allowed;\r\n  background-color: transparent;\r\n  background-image: none;\r\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);\r\n}\r\n.open > .dropdown-menu {\r\n  display: block;\r\n}\r\n.open > a {\r\n  outline: 0;\r\n}\r\n.dropdown-menu-right {\r\n  right: 0;\r\n  left: auto;\r\n}\r\n.dropdown-menu-left {\r\n  right: auto;\r\n  left: 0;\r\n}\r\n.dropdown-header {\r\n  display: block;\r\n  padding: 3px 20px;\r\n  font-size: 12px;\r\n  line-height: 1.42857143;\r\n  color: #777;\r\n  white-space: nowrap;\r\n}\r\n.dropdown-backdrop {\r\n  position: fixed;\r\n  top: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  z-index: 990;\r\n}\r\n.pull-right > .dropdown-menu {\r\n  right: 0;\r\n  left: auto;\r\n}\r\n.dropup .caret,\r\n.navbar-fixed-bottom .dropdown .caret {\r\n  content: \"\";\r\n  border-top: 0;\r\n  border-bottom: 4px solid;\r\n}\r\n.dropup .dropdown-menu,\r\n.navbar-fixed-bottom .dropdown .dropdown-menu {\r\n  top: auto;\r\n  bottom: 100%;\r\n  margin-bottom: 2px;\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar-right .dropdown-menu {\r\n    right: 0;\r\n    left: auto;\r\n  }\r\n  .navbar-right .dropdown-menu-left {\r\n    right: auto;\r\n    left: 0;\r\n  }\r\n}\r\n.btn-group,\r\n.btn-group-vertical {\r\n  position: relative;\r\n  display: inline-block;\r\n  vertical-align: middle;\r\n}\r\n.btn-group > .btn,\r\n.btn-group-vertical > .btn {\r\n  position: relative;\r\n  float: left;\r\n}\r\n.btn-group > .btn:hover,\r\n.btn-group-vertical > .btn:hover,\r\n.btn-group > .btn:focus,\r\n.btn-group-vertical > .btn:focus,\r\n.btn-group > .btn:active,\r\n.btn-group-vertical > .btn:active,\r\n.btn-group > .btn.active,\r\n.btn-group-vertical > .btn.active {\r\n  z-index: 2;\r\n}\r\n.btn-group .btn + .btn,\r\n.btn-group .btn + .btn-group,\r\n.btn-group .btn-group + .btn,\r\n.btn-group .btn-group + .btn-group {\r\n  margin-left: -1px;\r\n}\r\n.btn-toolbar {\r\n  margin-left: -5px;\r\n}\r\n.btn-toolbar .btn-group,\r\n.btn-toolbar .input-group {\r\n  float: left;\r\n}\r\n.btn-toolbar > .btn,\r\n.btn-toolbar > .btn-group,\r\n.btn-toolbar > .input-group {\r\n  margin-left: 5px;\r\n}\r\n.btn-group > .btn:not(:first-child):not(:last-child):not(.dropdown-toggle) {\r\n  border-radius: 0;\r\n}\r\n.btn-group > .btn:first-child {\r\n  margin-left: 0;\r\n}\r\n.btn-group > .btn:first-child:not(:last-child):not(.dropdown-toggle) {\r\n  border-top-right-radius: 0;\r\n  border-bottom-right-radius: 0;\r\n}\r\n.btn-group > .btn:last-child:not(:first-child),\r\n.btn-group > .dropdown-toggle:not(:first-child) {\r\n  border-top-left-radius: 0;\r\n  border-bottom-left-radius: 0;\r\n}\r\n.btn-group > .btn-group {\r\n  float: left;\r\n}\r\n.btn-group > .btn-group:not(:first-child):not(:last-child) > .btn {\r\n  border-radius: 0;\r\n}\r\n.btn-group > .btn-group:first-child:not(:last-child) > .btn:last-child,\r\n.btn-group > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\r\n  border-top-right-radius: 0;\r\n  border-bottom-right-radius: 0;\r\n}\r\n.btn-group > .btn-group:last-child:not(:first-child) > .btn:first-child {\r\n  border-top-left-radius: 0;\r\n  border-bottom-left-radius: 0;\r\n}\r\n.btn-group .dropdown-toggle:active,\r\n.btn-group.open .dropdown-toggle {\r\n  outline: 0;\r\n}\r\n.btn-group > .btn + .dropdown-toggle {\r\n  padding-right: 8px;\r\n  padding-left: 8px;\r\n}\r\n.btn-group > .btn-lg + .dropdown-toggle {\r\n  padding-right: 12px;\r\n  padding-left: 12px;\r\n}\r\n.btn-group.open .dropdown-toggle {\r\n  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);\r\n          box-shadow: inset 0 3px 5px rgba(0, 0, 0, .125);\r\n}\r\n.btn-group.open .dropdown-toggle.btn-link {\r\n  -webkit-box-shadow: none;\r\n          box-shadow: none;\r\n}\r\n.btn .caret {\r\n  margin-left: 0;\r\n}\r\n.btn-lg .caret {\r\n  border-width: 5px 5px 0;\r\n  border-bottom-width: 0;\r\n}\r\n.dropup .btn-lg .caret {\r\n  border-width: 0 5px 5px;\r\n}\r\n.btn-group-vertical > .btn,\r\n.btn-group-vertical > .btn-group,\r\n.btn-group-vertical > .btn-group > .btn {\r\n  display: block;\r\n  float: none;\r\n  width: 100%;\r\n  max-width: 100%;\r\n}\r\n.btn-group-vertical > .btn-group > .btn {\r\n  float: none;\r\n}\r\n.btn-group-vertical > .btn + .btn,\r\n.btn-group-vertical > .btn + .btn-group,\r\n.btn-group-vertical > .btn-group + .btn,\r\n.btn-group-vertical > .btn-group + .btn-group {\r\n  margin-top: -1px;\r\n  margin-left: 0;\r\n}\r\n.btn-group-vertical > .btn:not(:first-child):not(:last-child) {\r\n  border-radius: 0;\r\n}\r\n.btn-group-vertical > .btn:first-child:not(:last-child) {\r\n  border-top-right-radius: 4px;\r\n  border-bottom-right-radius: 0;\r\n  border-bottom-left-radius: 0;\r\n}\r\n.btn-group-vertical > .btn:last-child:not(:first-child) {\r\n  border-top-left-radius: 0;\r\n  border-top-right-radius: 0;\r\n  border-bottom-left-radius: 4px;\r\n}\r\n.btn-group-vertical > .btn-group:not(:first-child):not(:last-child) > .btn {\r\n  border-radius: 0;\r\n}\r\n.btn-group-vertical > .btn-group:first-child:not(:last-child) > .btn:last-child,\r\n.btn-group-vertical > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\r\n  border-bottom-right-radius: 0;\r\n  border-bottom-left-radius: 0;\r\n}\r\n.btn-group-vertical > .btn-group:last-child:not(:first-child) > .btn:first-child {\r\n  border-top-left-radius: 0;\r\n  border-top-right-radius: 0;\r\n}\r\n.btn-group-justified {\r\n  display: table;\r\n  width: 100%;\r\n  table-layout: fixed;\r\n  border-collapse: separate;\r\n}\r\n.btn-group-justified > .btn,\r\n.btn-group-justified > .btn-group {\r\n  display: table-cell;\r\n  float: none;\r\n  width: 1%;\r\n}\r\n.btn-group-justified > .btn-group .btn {\r\n  width: 100%;\r\n}\r\n.btn-group-justified > .btn-group .dropdown-menu {\r\n  left: auto;\r\n}\r\n[data-toggle=\"buttons\"] > .btn input[type=\"radio\"],\r\n[data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"radio\"],\r\n[data-toggle=\"buttons\"] > .btn input[type=\"checkbox\"],\r\n[data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"checkbox\"] {\r\n  position: absolute;\r\n  clip: rect(0, 0, 0, 0);\r\n  pointer-events: none;\r\n}\r\n.input-group {\r\n  position: relative;\r\n  display: table;\r\n  border-collapse: separate;\r\n}\r\n.input-group[class*=\"col-\"] {\r\n  float: none;\r\n  padding-right: 0;\r\n  padding-left: 0;\r\n}\r\n.input-group .form-control {\r\n  position: relative;\r\n  z-index: 2;\r\n  float: left;\r\n  width: 100%;\r\n  margin-bottom: 0;\r\n}\r\n.input-group-lg > .form-control,\r\n.input-group-lg > .input-group-addon,\r\n.input-group-lg > .input-group-btn > .btn {\r\n  height: 46px;\r\n  padding: 10px 16px;\r\n  font-size: 18px;\r\n  line-height: 1.3333333;\r\n  border-radius: 6px;\r\n}\r\nselect.input-group-lg > .form-control,\r\nselect.input-group-lg > .input-group-addon,\r\nselect.input-group-lg > .input-group-btn > .btn {\r\n  height: 46px;\r\n  line-height: 46px;\r\n}\r\ntextarea.input-group-lg > .form-control,\r\ntextarea.input-group-lg > .input-group-addon,\r\ntextarea.input-group-lg > .input-group-btn > .btn,\r\nselect[multiple].input-group-lg > .form-control,\r\nselect[multiple].input-group-lg > .input-group-addon,\r\nselect[multiple].input-group-lg > .input-group-btn > .btn {\r\n  height: auto;\r\n}\r\n.input-group-sm > .form-control,\r\n.input-group-sm > .input-group-addon,\r\n.input-group-sm > .input-group-btn > .btn {\r\n  height: 30px;\r\n  padding: 5px 10px;\r\n  font-size: 12px;\r\n  line-height: 1.5;\r\n  border-radius: 3px;\r\n}\r\nselect.input-group-sm > .form-control,\r\nselect.input-group-sm > .input-group-addon,\r\nselect.input-group-sm > .input-group-btn > .btn {\r\n  height: 30px;\r\n  line-height: 30px;\r\n}\r\ntextarea.input-group-sm > .form-control,\r\ntextarea.input-group-sm > .input-group-addon,\r\ntextarea.input-group-sm > .input-group-btn > .btn,\r\nselect[multiple].input-group-sm > .form-control,\r\nselect[multiple].input-group-sm > .input-group-addon,\r\nselect[multiple].input-group-sm > .input-group-btn > .btn {\r\n  height: auto;\r\n}\r\n.input-group-addon,\r\n.input-group-btn,\r\n.input-group .form-control {\r\n  display: table-cell;\r\n}\r\n.input-group-addon:not(:first-child):not(:last-child),\r\n.input-group-btn:not(:first-child):not(:last-child),\r\n.input-group .form-control:not(:first-child):not(:last-child) {\r\n  border-radius: 0;\r\n}\r\n.input-group-addon,\r\n.input-group-btn {\r\n  width: 1%;\r\n  white-space: nowrap;\r\n  vertical-align: middle;\r\n}\r\n.input-group-addon {\r\n  padding: 6px 12px;\r\n  font-size: 14px;\r\n  font-weight: normal;\r\n  line-height: 1;\r\n  color: #555;\r\n  text-align: center;\r\n  background-color: #eee;\r\n  border: 1px solid #ccc;\r\n  border-radius: 4px;\r\n}\r\n.input-group-addon.input-sm {\r\n  padding: 5px 10px;\r\n  font-size: 12px;\r\n  border-radius: 3px;\r\n}\r\n.input-group-addon.input-lg {\r\n  padding: 10px 16px;\r\n  font-size: 18px;\r\n  border-radius: 6px;\r\n}\r\n.input-group-addon input[type=\"radio\"],\r\n.input-group-addon input[type=\"checkbox\"] {\r\n  margin-top: 0;\r\n}\r\n.input-group .form-control:first-child,\r\n.input-group-addon:first-child,\r\n.input-group-btn:first-child > .btn,\r\n.input-group-btn:first-child > .btn-group > .btn,\r\n.input-group-btn:first-child > .dropdown-toggle,\r\n.input-group-btn:last-child > .btn:not(:last-child):not(.dropdown-toggle),\r\n.input-group-btn:last-child > .btn-group:not(:last-child) > .btn {\r\n  border-top-right-radius: 0;\r\n  border-bottom-right-radius: 0;\r\n}\r\n.input-group-addon:first-child {\r\n  border-right: 0;\r\n}\r\n.input-group .form-control:last-child,\r\n.input-group-addon:last-child,\r\n.input-group-btn:last-child > .btn,\r\n.input-group-btn:last-child > .btn-group > .btn,\r\n.input-group-btn:last-child > .dropdown-toggle,\r\n.input-group-btn:first-child > .btn:not(:first-child),\r\n.input-group-btn:first-child > .btn-group:not(:first-child) > .btn {\r\n  border-top-left-radius: 0;\r\n  border-bottom-left-radius: 0;\r\n}\r\n.input-group-addon:last-child {\r\n  border-left: 0;\r\n}\r\n.input-group-btn {\r\n  position: relative;\r\n  font-size: 0;\r\n  white-space: nowrap;\r\n}\r\n.input-group-btn > .btn {\r\n  position: relative;\r\n}\r\n.input-group-btn > .btn + .btn {\r\n  margin-left: -1px;\r\n}\r\n.input-group-btn > .btn:hover,\r\n.input-group-btn > .btn:focus,\r\n.input-group-btn > .btn:active {\r\n  z-index: 2;\r\n}\r\n.input-group-btn:first-child > .btn,\r\n.input-group-btn:first-child > .btn-group {\r\n  margin-right: -1px;\r\n}\r\n.input-group-btn:last-child > .btn,\r\n.input-group-btn:last-child > .btn-group {\r\n  margin-left: -1px;\r\n}\r\n.nav {\r\n  padding-left: 0;\r\n  margin-bottom: 0;\r\n  list-style: none;\r\n}\r\n.nav > li {\r\n  position: relative;\r\n  display: block;\r\n}\r\n.nav > li > a {\r\n  position: relative;\r\n  display: block;\r\n  padding: 10px 15px;\r\n}\r\n.nav > li > a:hover,\r\n.nav > li > a:focus {\r\n  text-decoration: none;\r\n  background-color: #eee;\r\n}\r\n.nav > li.disabled > a {\r\n  color: #777;\r\n}\r\n.nav > li.disabled > a:hover,\r\n.nav > li.disabled > a:focus {\r\n  color: #777;\r\n  text-decoration: none;\r\n  cursor: not-allowed;\r\n  background-color: transparent;\r\n}\r\n.nav .open > a,\r\n.nav .open > a:hover,\r\n.nav .open > a:focus {\r\n  background-color: #eee;\r\n  border-color: #337ab7;\r\n}\r\n.nav .nav-divider {\r\n  height: 1px;\r\n  margin: 9px 0;\r\n  overflow: hidden;\r\n  background-color: #e5e5e5;\r\n}\r\n.nav > li > a > img {\r\n  max-width: none;\r\n}\r\n.nav-tabs {\r\n  border-bottom: 1px solid #ddd;\r\n}\r\n.nav-tabs > li {\r\n  float: left;\r\n  margin-bottom: -1px;\r\n}\r\n.nav-tabs > li > a {\r\n  margin-right: 2px;\r\n  line-height: 1.42857143;\r\n  border: 1px solid transparent;\r\n  border-radius: 4px 4px 0 0;\r\n}\r\n.nav-tabs > li > a:hover {\r\n  border-color: #eee #eee #ddd;\r\n}\r\n.nav-tabs > li.active > a,\r\n.nav-tabs > li.active > a:hover,\r\n.nav-tabs > li.active > a:focus {\r\n  color: #555;\r\n  cursor: default;\r\n  background-color: #fff;\r\n  border: 1px solid #ddd;\r\n  border-bottom-color: transparent;\r\n}\r\n.nav-tabs.nav-justified {\r\n  width: 100%;\r\n  border-bottom: 0;\r\n}\r\n.nav-tabs.nav-justified > li {\r\n  float: none;\r\n}\r\n.nav-tabs.nav-justified > li > a {\r\n  margin-bottom: 5px;\r\n  text-align: center;\r\n}\r\n.nav-tabs.nav-justified > .dropdown .dropdown-menu {\r\n  top: auto;\r\n  left: auto;\r\n}\r\n@media (min-width: 768px) {\r\n  .nav-tabs.nav-justified > li {\r\n    display: table-cell;\r\n    width: 1%;\r\n  }\r\n  .nav-tabs.nav-justified > li > a {\r\n    margin-bottom: 0;\r\n  }\r\n}\r\n.nav-tabs.nav-justified > li > a {\r\n  margin-right: 0;\r\n  border-radius: 4px;\r\n}\r\n.nav-tabs.nav-justified > .active > a,\r\n.nav-tabs.nav-justified > .active > a:hover,\r\n.nav-tabs.nav-justified > .active > a:focus {\r\n  border: 1px solid #ddd;\r\n}\r\n@media (min-width: 768px) {\r\n  .nav-tabs.nav-justified > li > a {\r\n    border-bottom: 1px solid #ddd;\r\n    border-radius: 4px 4px 0 0;\r\n  }\r\n  .nav-tabs.nav-justified > .active > a,\r\n  .nav-tabs.nav-justified > .active > a:hover,\r\n  .nav-tabs.nav-justified > .active > a:focus {\r\n    border-bottom-color: #fff;\r\n  }\r\n}\r\n.nav-pills > li {\r\n  float: left;\r\n}\r\n.nav-pills > li > a {\r\n  border-radius: 4px;\r\n}\r\n.nav-pills > li + li {\r\n  margin-left: 2px;\r\n}\r\n.nav-pills > li.active > a,\r\n.nav-pills > li.active > a:hover,\r\n.nav-pills > li.active > a:focus {\r\n  color: #fff;\r\n  background-color: #337ab7;\r\n}\r\n.nav-stacked > li {\r\n  float: none;\r\n}\r\n.nav-stacked > li + li {\r\n  margin-top: 2px;\r\n  margin-left: 0;\r\n}\r\n.nav-justified {\r\n  width: 100%;\r\n}\r\n.nav-justified > li {\r\n  float: none;\r\n}\r\n.nav-justified > li > a {\r\n  margin-bottom: 5px;\r\n  text-align: center;\r\n}\r\n.nav-justified > .dropdown .dropdown-menu {\r\n  top: auto;\r\n  left: auto;\r\n}\r\n@media (min-width: 768px) {\r\n  .nav-justified > li {\r\n    display: table-cell;\r\n    width: 1%;\r\n  }\r\n  .nav-justified > li > a {\r\n    margin-bottom: 0;\r\n  }\r\n}\r\n.nav-tabs-justified {\r\n  border-bottom: 0;\r\n}\r\n.nav-tabs-justified > li > a {\r\n  margin-right: 0;\r\n  border-radius: 4px;\r\n}\r\n.nav-tabs-justified > .active > a,\r\n.nav-tabs-justified > .active > a:hover,\r\n.nav-tabs-justified > .active > a:focus {\r\n  border: 1px solid #ddd;\r\n}\r\n@media (min-width: 768px) {\r\n  .nav-tabs-justified > li > a {\r\n    border-bottom: 1px solid #ddd;\r\n    border-radius: 4px 4px 0 0;\r\n  }\r\n  .nav-tabs-justified > .active > a,\r\n  .nav-tabs-justified > .active > a:hover,\r\n  .nav-tabs-justified > .active > a:focus {\r\n    border-bottom-color: #fff;\r\n  }\r\n}\r\n.tab-content > .tab-pane {\r\n  display: none;\r\n}\r\n.tab-content > .active {\r\n  display: block;\r\n}\r\n.nav-tabs .dropdown-menu {\r\n  margin-top: -1px;\r\n  border-top-left-radius: 0;\r\n  border-top-right-radius: 0;\r\n}\r\n.navbar {\r\n  position: relative;\r\n  min-height: 50px;\r\n  margin-bottom: 20px;\r\n  border: 1px solid transparent;\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar {\r\n    border-radius: 4px;\r\n  }\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar-header {\r\n    float: left;\r\n  }\r\n}\r\n.navbar-collapse {\r\n  padding-right: 15px;\r\n  padding-left: 15px;\r\n  overflow-x: visible;\r\n  -webkit-overflow-scrolling: touch;\r\n  border-top: 1px solid transparent;\r\n  -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, .1);\r\n          box-shadow: inset 0 1px 0 rgba(255, 255, 255, .1);\r\n}\r\n.navbar-collapse.in {\r\n  overflow-y: auto;\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar-collapse {\r\n    width: auto;\r\n    border-top: 0;\r\n    -webkit-box-shadow: none;\r\n            box-shadow: none;\r\n  }\r\n  .navbar-collapse.collapse {\r\n    display: block !important;\r\n    height: auto !important;\r\n    padding-bottom: 0;\r\n    overflow: visible !important;\r\n  }\r\n  .navbar-collapse.in {\r\n    overflow-y: visible;\r\n  }\r\n  .navbar-fixed-top .navbar-collapse,\r\n  .navbar-static-top .navbar-collapse,\r\n  .navbar-fixed-bottom .navbar-collapse {\r\n    padding-right: 0;\r\n    padding-left: 0;\r\n  }\r\n}\r\n.navbar-fixed-top .navbar-collapse,\r\n.navbar-fixed-bottom .navbar-collapse {\r\n  max-height: 340px;\r\n}\r\n@media (max-device-width: 480px) and (orientation: landscape) {\r\n  .navbar-fixed-top .navbar-collapse,\r\n  .navbar-fixed-bottom .navbar-collapse {\r\n    max-height: 200px;\r\n  }\r\n}\r\n.container > .navbar-header,\r\n.container-fluid > .navbar-header,\r\n.container > .navbar-collapse,\r\n.container-fluid > .navbar-collapse {\r\n  margin-right: -15px;\r\n  margin-left: -15px;\r\n}\r\n@media (min-width: 768px) {\r\n  .container > .navbar-header,\r\n  .container-fluid > .navbar-header,\r\n  .container > .navbar-collapse,\r\n  .container-fluid > .navbar-collapse {\r\n    margin-right: 0;\r\n    margin-left: 0;\r\n  }\r\n}\r\n.navbar-static-top {\r\n  z-index: 1000;\r\n  border-width: 0 0 1px;\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar-static-top {\r\n    border-radius: 0;\r\n  }\r\n}\r\n.navbar-fixed-top,\r\n.navbar-fixed-bottom {\r\n  position: fixed;\r\n  right: 0;\r\n  left: 0;\r\n  z-index: 1030;\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar-fixed-top,\r\n  .navbar-fixed-bottom {\r\n    border-radius: 0;\r\n  }\r\n}\r\n.navbar-fixed-top {\r\n  top: 0;\r\n  border-width: 0 0 1px;\r\n}\r\n.navbar-fixed-bottom {\r\n  bottom: 0;\r\n  margin-bottom: 0;\r\n  border-width: 1px 0 0;\r\n}\r\n.navbar-brand {\r\n  float: left;\r\n  height: 50px;\r\n  padding: 15px 15px;\r\n  font-size: 18px;\r\n  line-height: 20px;\r\n}\r\n.navbar-brand:hover,\r\n.navbar-brand:focus {\r\n  text-decoration: none;\r\n}\r\n.navbar-brand > img {\r\n  display: block;\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar > .container .navbar-brand,\r\n  .navbar > .container-fluid .navbar-brand {\r\n    margin-left: -15px;\r\n  }\r\n}\r\n.navbar-toggle {\r\n  position: relative;\r\n  float: right;\r\n  padding: 9px 10px;\r\n  margin-top: 8px;\r\n  margin-right: 15px;\r\n  margin-bottom: 8px;\r\n  background-color: transparent;\r\n  background-image: none;\r\n  border: 1px solid transparent;\r\n  border-radius: 4px;\r\n}\r\n.navbar-toggle:focus {\r\n  outline: 0;\r\n}\r\n.navbar-toggle .icon-bar {\r\n  display: block;\r\n  width: 22px;\r\n  height: 2px;\r\n  border-radius: 1px;\r\n}\r\n.navbar-toggle .icon-bar + .icon-bar {\r\n  margin-top: 4px;\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar-toggle {\r\n    display: none;\r\n  }\r\n}\r\n.navbar-nav {\r\n  margin: 7.5px -15px;\r\n}\r\n.navbar-nav > li > a {\r\n  padding-top: 10px;\r\n  padding-bottom: 10px;\r\n  line-height: 20px;\r\n}\r\n@media (max-width: 767px) {\r\n  .navbar-nav .open .dropdown-menu {\r\n    position: static;\r\n    float: none;\r\n    width: auto;\r\n    margin-top: 0;\r\n    background-color: transparent;\r\n    border: 0;\r\n    -webkit-box-shadow: none;\r\n            box-shadow: none;\r\n  }\r\n  .navbar-nav .open .dropdown-menu > li > a,\r\n  .navbar-nav .open .dropdown-menu .dropdown-header {\r\n    padding: 5px 15px 5px 25px;\r\n  }\r\n  .navbar-nav .open .dropdown-menu > li > a {\r\n    line-height: 20px;\r\n  }\r\n  .navbar-nav .open .dropdown-menu > li > a:hover,\r\n  .navbar-nav .open .dropdown-menu > li > a:focus {\r\n    background-image: none;\r\n  }\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar-nav {\r\n    float: left;\r\n    margin: 0;\r\n  }\r\n  .navbar-nav > li {\r\n    float: left;\r\n  }\r\n  .navbar-nav > li > a {\r\n    padding-top: 15px;\r\n    padding-bottom: 15px;\r\n  }\r\n}\r\n.navbar-form {\r\n  padding: 10px 15px;\r\n  margin-top: 8px;\r\n  margin-right: -15px;\r\n  margin-bottom: 8px;\r\n  margin-left: -15px;\r\n  border-top: 1px solid transparent;\r\n  border-bottom: 1px solid transparent;\r\n  -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, .1), 0 1px 0 rgba(255, 255, 255, .1);\r\n          box-shadow: inset 0 1px 0 rgba(255, 255, 255, .1), 0 1px 0 rgba(255, 255, 255, .1);\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar-form .form-group {\r\n    display: inline-block;\r\n    margin-bottom: 0;\r\n    vertical-align: middle;\r\n  }\r\n  .navbar-form .form-control {\r\n    display: inline-block;\r\n    width: auto;\r\n    vertical-align: middle;\r\n  }\r\n  .navbar-form .form-control-static {\r\n    display: inline-block;\r\n  }\r\n  .navbar-form .input-group {\r\n    display: inline-table;\r\n    vertical-align: middle;\r\n  }\r\n  .navbar-form .input-group .input-group-addon,\r\n  .navbar-form .input-group .input-group-btn,\r\n  .navbar-form .input-group .form-control {\r\n    width: auto;\r\n  }\r\n  .navbar-form .input-group > .form-control {\r\n    width: 100%;\r\n  }\r\n  .navbar-form .control-label {\r\n    margin-bottom: 0;\r\n    vertical-align: middle;\r\n  }\r\n  .navbar-form .radio,\r\n  .navbar-form .checkbox {\r\n    display: inline-block;\r\n    margin-top: 0;\r\n    margin-bottom: 0;\r\n    vertical-align: middle;\r\n  }\r\n  .navbar-form .radio label,\r\n  .navbar-form .checkbox label {\r\n    padding-left: 0;\r\n  }\r\n  .navbar-form .radio input[type=\"radio\"],\r\n  .navbar-form .checkbox input[type=\"checkbox\"] {\r\n    position: relative;\r\n    margin-left: 0;\r\n  }\r\n  .navbar-form .has-feedback .form-control-feedback {\r\n    top: 0;\r\n  }\r\n}\r\n@media (max-width: 767px) {\r\n  .navbar-form .form-group {\r\n    margin-bottom: 5px;\r\n  }\r\n  .navbar-form .form-group:last-child {\r\n    margin-bottom: 0;\r\n  }\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar-form {\r\n    width: auto;\r\n    padding-top: 0;\r\n    padding-bottom: 0;\r\n    margin-right: 0;\r\n    margin-left: 0;\r\n    border: 0;\r\n    -webkit-box-shadow: none;\r\n            box-shadow: none;\r\n  }\r\n}\r\n.navbar-nav > li > .dropdown-menu {\r\n  margin-top: 0;\r\n  border-top-left-radius: 0;\r\n  border-top-right-radius: 0;\r\n}\r\n.navbar-fixed-bottom .navbar-nav > li > .dropdown-menu {\r\n  margin-bottom: 0;\r\n  border-top-left-radius: 4px;\r\n  border-top-right-radius: 4px;\r\n  border-bottom-right-radius: 0;\r\n  border-bottom-left-radius: 0;\r\n}\r\n.navbar-btn {\r\n  margin-top: 8px;\r\n  margin-bottom: 8px;\r\n}\r\n.navbar-btn.btn-sm {\r\n  margin-top: 10px;\r\n  margin-bottom: 10px;\r\n}\r\n.navbar-btn.btn-xs {\r\n  margin-top: 14px;\r\n  margin-bottom: 14px;\r\n}\r\n.navbar-text {\r\n  margin-top: 15px;\r\n  margin-bottom: 15px;\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar-text {\r\n    float: left;\r\n    margin-right: 15px;\r\n    margin-left: 15px;\r\n  }\r\n}\r\n@media (min-width: 768px) {\r\n  .navbar-left {\r\n    float: left !important;\r\n  }\r\n  .navbar-right {\r\n    float: right !important;\r\n    margin-right: -15px;\r\n  }\r\n  .navbar-right ~ .navbar-right {\r\n    margin-right: 0;\r\n  }\r\n}\r\n.navbar-default {\r\n  background-color: #f8f8f8;\r\n  border-color: #e7e7e7;\r\n}\r\n.navbar-default .navbar-brand {\r\n  color: #777;\r\n}\r\n.navbar-default .navbar-brand:hover,\r\n.navbar-default .navbar-brand:focus {\r\n  color: #5e5e5e;\r\n  background-color: transparent;\r\n}\r\n.navbar-default .navbar-text {\r\n  color: #777;\r\n}\r\n.navbar-default .navbar-nav > li > a {\r\n  color: #777;\r\n}\r\n.navbar-default .navbar-nav > li > a:hover,\r\n.navbar-default .navbar-nav > li > a:focus {\r\n  color: #333;\r\n  background-color: transparent;\r\n}\r\n.navbar-default .navbar-nav > .active > a,\r\n.navbar-default .navbar-nav > .active > a:hover,\r\n.navbar-default .navbar-nav > .active > a:focus {\r\n  color: #555;\r\n  background-color: #e7e7e7;\r\n}\r\n.navbar-default .navbar-nav > .disabled > a,\r\n.navbar-default .navbar-nav > .disabled > a:hover,\r\n.navbar-default .navbar-nav > .disabled > a:focus {\r\n  color: #ccc;\r\n  background-color: transparent;\r\n}\r\n.navbar-default .navbar-toggle {\r\n  border-color: #ddd;\r\n}\r\n.navbar-default .navbar-toggle:hover,\r\n.navbar-default .navbar-toggle:focus {\r\n  background-color: #ddd;\r\n}\r\n.navbar-default .navbar-toggle .icon-bar {\r\n  background-color: #888;\r\n}\r\n.navbar-default .navbar-collapse,\r\n.navbar-default .navbar-form {\r\n  border-color: #e7e7e7;\r\n}\r\n.navbar-default .navbar-nav > .open > a,\r\n.navbar-default .navbar-nav > .open > a:hover,\r\n.navbar-default .navbar-nav > .open > a:focus {\r\n  color: #555;\r\n  background-color: #e7e7e7;\r\n}\r\n@media (max-width: 767px) {\r\n  .navbar-default .navbar-nav .open .dropdown-menu > li > a {\r\n    color: #777;\r\n  }\r\n  .navbar-default .navbar-nav .open .dropdown-menu > li > a:hover,\r\n  .navbar-default .navbar-nav .open .dropdown-menu > li > a:focus {\r\n    color: #333;\r\n    background-color: transparent;\r\n  }\r\n  .navbar-default .navbar-nav .open .dropdown-menu > .active > a,\r\n  .navbar-default .navbar-nav .open .dropdown-menu > .active > a:hover,\r\n  .navbar-default .navbar-nav .open .dropdown-menu > .active > a:focus {\r\n    color: #555;\r\n    background-color: #e7e7e7;\r\n  }\r\n  .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a,\r\n  .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:hover,\r\n  .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:focus {\r\n    color: #ccc;\r\n    background-color: transparent;\r\n  }\r\n}\r\n.navbar-default .navbar-link {\r\n  color: #777;\r\n}\r\n.navbar-default .navbar-link:hover {\r\n  color: #333;\r\n}\r\n.navbar-default .btn-link {\r\n  color: #777;\r\n}\r\n.navbar-default .btn-link:hover,\r\n.navbar-default .btn-link:focus {\r\n  color: #333;\r\n}\r\n.navbar-default .btn-link[disabled]:hover,\r\nfieldset[disabled] .navbar-default .btn-link:hover,\r\n.navbar-default .btn-link[disabled]:focus,\r\nfieldset[disabled] .navbar-default .btn-link:focus {\r\n  color: #ccc;\r\n}\r\n.navbar-inverse {\r\n  background-color: #222;\r\n  border-color: #080808;\r\n}\r\n.navbar-inverse .navbar-brand {\r\n  color: #9d9d9d;\r\n}\r\n.navbar-inverse .navbar-brand:hover,\r\n.navbar-inverse .navbar-brand:focus {\r\n  color: #fff;\r\n  background-color: transparent;\r\n}\r\n.navbar-inverse .navbar-text {\r\n  color: #9d9d9d;\r\n}\r\n.navbar-inverse .navbar-nav > li > a {\r\n  color: #9d9d9d;\r\n}\r\n.navbar-inverse .navbar-nav > li > a:hover,\r\n.navbar-inverse .navbar-nav > li > a:focus {\r\n  color: #fff;\r\n  background-color: transparent;\r\n}\r\n.navbar-inverse .navbar-nav > .active > a,\r\n.navbar-inverse .navbar-nav > .active > a:hover,\r\n.navbar-inverse .navbar-nav > .active > a:focus {\r\n  color: #fff;\r\n  background-color: #080808;\r\n}\r\n.navbar-inverse .navbar-nav > .disabled > a,\r\n.navbar-inverse .navbar-nav > .disabled > a:hover,\r\n.navbar-inverse .navbar-nav > .disabled > a:focus {\r\n  color: #444;\r\n  background-color: transparent;\r\n}\r\n.navbar-inverse .navbar-toggle {\r\n  border-color: #333;\r\n}\r\n.navbar-inverse .navbar-toggle:hover,\r\n.navbar-inverse .navbar-toggle:focus {\r\n  background-color: #333;\r\n}\r\n.navbar-inverse .navbar-toggle .icon-bar {\r\n  background-color: #fff;\r\n}\r\n.navbar-inverse .navbar-collapse,\r\n.navbar-inverse .navbar-form {\r\n  border-color: #101010;\r\n}\r\n.navbar-inverse .navbar-nav > .open > a,\r\n.navbar-inverse .navbar-nav > .open > a:hover,\r\n.navbar-inverse .navbar-nav > .open > a:focus {\r\n  color: #fff;\r\n  background-color: #080808;\r\n}\r\n@media (max-width: 767px) {\r\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .dropdown-header {\r\n    border-color: #080808;\r\n  }\r\n  .navbar-inverse .navbar-nav .open .dropdown-menu .divider {\r\n    background-color: #080808;\r\n  }\r\n  .navbar-inverse .navbar-nav .open .dropdown-menu > li > a {\r\n    color: #9d9d9d;\r\n  }\r\n  .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:hover,\r\n  .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:focus {\r\n    color: #fff;\r\n    background-color: transparent;\r\n  }\r\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a,\r\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a:hover,\r\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a:focus {\r\n    color: #fff;\r\n    background-color: #080808;\r\n  }\r\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a,\r\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:hover,\r\n  .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:focus {\r\n    color: #444;\r\n    background-color: transparent;\r\n  }\r\n}\r\n.navbar-inverse .navbar-link {\r\n  color: #9d9d9d;\r\n}\r\n.navbar-inverse .navbar-link:hover {\r\n  color: #fff;\r\n}\r\n.navbar-inverse .btn-link {\r\n  color: #9d9d9d;\r\n}\r\n.navbar-inverse .btn-link:hover,\r\n.navbar-inverse .btn-link:focus {\r\n  color: #fff;\r\n}\r\n.navbar-inverse .btn-link[disabled]:hover,\r\nfieldset[disabled] .navbar-inverse .btn-link:hover,\r\n.navbar-inverse .btn-link[disabled]:focus,\r\nfieldset[disabled] .navbar-inverse .btn-link:focus {\r\n  color: #444;\r\n}\r\n.breadcrumb {\r\n  padding: 8px 15px;\r\n  margin-bottom: 20px;\r\n  list-style: none;\r\n  background-color: #f5f5f5;\r\n  border-radius: 4px;\r\n}\r\n.breadcrumb > li {\r\n  display: inline-block;\r\n}\r\n.breadcrumb > li + li:before {\r\n  padding: 0 5px;\r\n  color: #ccc;\r\n  content: \"/\\A0\";\r\n}\r\n.breadcrumb > .active {\r\n  color: #777;\r\n}\r\n.pagination {\r\n  display: inline-block;\r\n  padding-left: 0;\r\n  margin: 20px 0;\r\n  border-radius: 4px;\r\n}\r\n.pagination > li {\r\n  display: inline;\r\n}\r\n.pagination > li > a,\r\n.pagination > li > span {\r\n  position: relative;\r\n  float: left;\r\n  padding: 6px 12px;\r\n  margin-left: -1px;\r\n  line-height: 1.42857143;\r\n  color: #337ab7;\r\n  text-decoration: none;\r\n  background-color: #fff;\r\n  border: 1px solid #ddd;\r\n}\r\n.pagination > li:first-child > a,\r\n.pagination > li:first-child > span {\r\n  margin-left: 0;\r\n  border-top-left-radius: 4px;\r\n  border-bottom-left-radius: 4px;\r\n}\r\n.pagination > li:last-child > a,\r\n.pagination > li:last-child > span {\r\n  border-top-right-radius: 4px;\r\n  border-bottom-right-radius: 4px;\r\n}\r\n.pagination > li > a:hover,\r\n.pagination > li > span:hover,\r\n.pagination > li > a:focus,\r\n.pagination > li > span:focus {\r\n  color: #23527c;\r\n  background-color: #eee;\r\n  border-color: #ddd;\r\n}\r\n.pagination > .active > a,\r\n.pagination > .active > span,\r\n.pagination > .active > a:hover,\r\n.pagination > .active > span:hover,\r\n.pagination > .active > a:focus,\r\n.pagination > .active > span:focus {\r\n  z-index: 2;\r\n  color: #fff;\r\n  cursor: default;\r\n  background-color: #337ab7;\r\n  border-color: #337ab7;\r\n}\r\n.pagination > .disabled > span,\r\n.pagination > .disabled > span:hover,\r\n.pagination > .disabled > span:focus,\r\n.pagination > .disabled > a,\r\n.pagination > .disabled > a:hover,\r\n.pagination > .disabled > a:focus {\r\n  color: #777;\r\n  cursor: not-allowed;\r\n  background-color: #fff;\r\n  border-color: #ddd;\r\n}\r\n.pagination-lg > li > a,\r\n.pagination-lg > li > span {\r\n  padding: 10px 16px;\r\n  font-size: 18px;\r\n}\r\n.pagination-lg > li:first-child > a,\r\n.pagination-lg > li:first-child > span {\r\n  border-top-left-radius: 6px;\r\n  border-bottom-left-radius: 6px;\r\n}\r\n.pagination-lg > li:last-child > a,\r\n.pagination-lg > li:last-child > span {\r\n  border-top-right-radius: 6px;\r\n  border-bottom-right-radius: 6px;\r\n}\r\n.pagination-sm > li > a,\r\n.pagination-sm > li > span {\r\n  padding: 5px 10px;\r\n  font-size: 12px;\r\n}\r\n.pagination-sm > li:first-child > a,\r\n.pagination-sm > li:first-child > span {\r\n  border-top-left-radius: 3px;\r\n  border-bottom-left-radius: 3px;\r\n}\r\n.pagination-sm > li:last-child > a,\r\n.pagination-sm > li:last-child > span {\r\n  border-top-right-radius: 3px;\r\n  border-bottom-right-radius: 3px;\r\n}\r\n.pager {\r\n  padding-left: 0;\r\n  margin: 20px 0;\r\n  text-align: center;\r\n  list-style: none;\r\n}\r\n.pager li {\r\n  display: inline;\r\n}\r\n.pager li > a,\r\n.pager li > span {\r\n  display: inline-block;\r\n  padding: 5px 14px;\r\n  background-color: #fff;\r\n  border: 1px solid #ddd;\r\n  border-radius: 15px;\r\n}\r\n.pager li > a:hover,\r\n.pager li > a:focus {\r\n  text-decoration: none;\r\n  background-color: #eee;\r\n}\r\n.pager .next > a,\r\n.pager .next > span {\r\n  float: right;\r\n}\r\n.pager .previous > a,\r\n.pager .previous > span {\r\n  float: left;\r\n}\r\n.pager .disabled > a,\r\n.pager .disabled > a:hover,\r\n.pager .disabled > a:focus,\r\n.pager .disabled > span {\r\n  color: #777;\r\n  cursor: not-allowed;\r\n  background-color: #fff;\r\n}\r\n.label {\r\n  display: inline;\r\n  padding: .2em .6em .3em;\r\n  font-size: 75%;\r\n  font-weight: bold;\r\n  line-height: 1;\r\n  color: #fff;\r\n  text-align: center;\r\n  white-space: nowrap;\r\n  vertical-align: baseline;\r\n  border-radius: .25em;\r\n}\r\na.label:hover,\r\na.label:focus {\r\n  color: #fff;\r\n  text-decoration: none;\r\n  cursor: pointer;\r\n}\r\n.label:empty {\r\n  display: none;\r\n}\r\n.btn .label {\r\n  position: relative;\r\n  top: -1px;\r\n}\r\n.label-default {\r\n  background-color: #777;\r\n}\r\n.label-default[href]:hover,\r\n.label-default[href]:focus {\r\n  background-color: #5e5e5e;\r\n}\r\n.label-primary {\r\n  background-color: #337ab7;\r\n}\r\n.label-primary[href]:hover,\r\n.label-primary[href]:focus {\r\n  background-color: #286090;\r\n}\r\n.label-success {\r\n  background-color: #5cb85c;\r\n}\r\n.label-success[href]:hover,\r\n.label-success[href]:focus {\r\n  background-color: #449d44;\r\n}\r\n.label-info {\r\n  background-color: #5bc0de;\r\n}\r\n.label-info[href]:hover,\r\n.label-info[href]:focus {\r\n  background-color: #31b0d5;\r\n}\r\n.label-warning {\r\n  background-color: #f0ad4e;\r\n}\r\n.label-warning[href]:hover,\r\n.label-warning[href]:focus {\r\n  background-color: #ec971f;\r\n}\r\n.label-danger {\r\n  background-color: #d9534f;\r\n}\r\n.label-danger[href]:hover,\r\n.label-danger[href]:focus {\r\n  background-color: #c9302c;\r\n}\r\n.badge {\r\n  display: inline-block;\r\n  min-width: 10px;\r\n  padding: 3px 7px;\r\n  font-size: 12px;\r\n  font-weight: bold;\r\n  line-height: 1;\r\n  color: #fff;\r\n  text-align: center;\r\n  white-space: nowrap;\r\n  vertical-align: baseline;\r\n  background-color: #777;\r\n  border-radius: 10px;\r\n}\r\n.badge:empty {\r\n  display: none;\r\n}\r\n.btn .badge {\r\n  position: relative;\r\n  top: -1px;\r\n}\r\n.btn-xs .badge,\r\n.btn-group-xs > .btn .badge {\r\n  top: 0;\r\n  padding: 1px 5px;\r\n}\r\na.badge:hover,\r\na.badge:focus {\r\n  color: #fff;\r\n  text-decoration: none;\r\n  cursor: pointer;\r\n}\r\n.list-group-item.active > .badge,\r\n.nav-pills > .active > a > .badge {\r\n  color: #337ab7;\r\n  background-color: #fff;\r\n}\r\n.list-group-item > .badge {\r\n  float: right;\r\n}\r\n.list-group-item > .badge + .badge {\r\n  margin-right: 5px;\r\n}\r\n.nav-pills > li > a > .badge {\r\n  margin-left: 3px;\r\n}\r\n.jumbotron {\r\n  padding: 30px 15px;\r\n  margin-bottom: 30px;\r\n  color: inherit;\r\n  background-color: #eee;\r\n}\r\n.jumbotron h1,\r\n.jumbotron .h1 {\r\n  color: inherit;\r\n}\r\n.jumbotron p {\r\n  margin-bottom: 15px;\r\n  font-size: 21px;\r\n  font-weight: 200;\r\n}\r\n.jumbotron > hr {\r\n  border-top-color: #d5d5d5;\r\n}\r\n.container .jumbotron,\r\n.container-fluid .jumbotron {\r\n  border-radius: 6px;\r\n}\r\n.jumbotron .container {\r\n  max-width: 100%;\r\n}\r\n@media screen and (min-width: 768px) {\r\n  .jumbotron {\r\n    padding: 48px 0;\r\n  }\r\n  .container .jumbotron,\r\n  .container-fluid .jumbotron {\r\n    padding-right: 60px;\r\n    padding-left: 60px;\r\n  }\r\n  .jumbotron h1,\r\n  .jumbotron .h1 {\r\n    font-size: 63px;\r\n  }\r\n}\r\n.thumbnail {\r\n  display: block;\r\n  padding: 4px;\r\n  margin-bottom: 20px;\r\n  line-height: 1.42857143;\r\n  background-color: #fff;\r\n  border: 1px solid #ddd;\r\n  border-radius: 4px;\r\n  -webkit-transition: border .2s ease-in-out;\r\n       -o-transition: border .2s ease-in-out;\r\n          transition: border .2s ease-in-out;\r\n}\r\n.thumbnail > img,\r\n.thumbnail a > img {\r\n  margin-right: auto;\r\n  margin-left: auto;\r\n}\r\na.thumbnail:hover,\r\na.thumbnail:focus,\r\na.thumbnail.active {\r\n  border-color: #337ab7;\r\n}\r\n.thumbnail .caption {\r\n  padding: 9px;\r\n  color: #333;\r\n}\r\n.alert {\r\n  padding: 15px;\r\n  margin-bottom: 20px;\r\n  border: 1px solid transparent;\r\n  border-radius: 4px;\r\n}\r\n.alert h4 {\r\n  margin-top: 0;\r\n  color: inherit;\r\n}\r\n.alert .alert-link {\r\n  font-weight: bold;\r\n}\r\n.alert > p,\r\n.alert > ul {\r\n  margin-bottom: 0;\r\n}\r\n.alert > p + p {\r\n  margin-top: 5px;\r\n}\r\n.alert-dismissable,\r\n.alert-dismissible {\r\n  padding-right: 35px;\r\n}\r\n.alert-dismissable .close,\r\n.alert-dismissible .close {\r\n  position: relative;\r\n  top: -2px;\r\n  right: -21px;\r\n  color: inherit;\r\n}\r\n.alert-success {\r\n  color: #3c763d;\r\n  background-color: #dff0d8;\r\n  border-color: #d6e9c6;\r\n}\r\n.alert-success hr {\r\n  border-top-color: #c9e2b3;\r\n}\r\n.alert-success .alert-link {\r\n  color: #2b542c;\r\n}\r\n.alert-info {\r\n  color: #31708f;\r\n  background-color: #d9edf7;\r\n  border-color: #bce8f1;\r\n}\r\n.alert-info hr {\r\n  border-top-color: #a6e1ec;\r\n}\r\n.alert-info .alert-link {\r\n  color: #245269;\r\n}\r\n.alert-warning {\r\n  color: #8a6d3b;\r\n  background-color: #fcf8e3;\r\n  border-color: #faebcc;\r\n}\r\n.alert-warning hr {\r\n  border-top-color: #f7e1b5;\r\n}\r\n.alert-warning .alert-link {\r\n  color: #66512c;\r\n}\r\n.alert-danger {\r\n  color: #a94442;\r\n  background-color: #f2dede;\r\n  border-color: #ebccd1;\r\n}\r\n.alert-danger hr {\r\n  border-top-color: #e4b9c0;\r\n}\r\n.alert-danger .alert-link {\r\n  color: #843534;\r\n}\r\n@-webkit-keyframes progress-bar-stripes {\r\n  from {\r\n    background-position: 40px 0;\r\n  }\r\n  to {\r\n    background-position: 0 0;\r\n  }\r\n}\r\n@-o-keyframes progress-bar-stripes {\r\n  from {\r\n    background-position: 40px 0;\r\n  }\r\n  to {\r\n    background-position: 0 0;\r\n  }\r\n}\r\n@keyframes progress-bar-stripes {\r\n  from {\r\n    background-position: 40px 0;\r\n  }\r\n  to {\r\n    background-position: 0 0;\r\n  }\r\n}\r\n.progress {\r\n  height: 20px;\r\n  margin-bottom: 20px;\r\n  overflow: hidden;\r\n  background-color: #f5f5f5;\r\n  border-radius: 4px;\r\n  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);\r\n          box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);\r\n}\r\n.progress-bar {\r\n  float: left;\r\n  width: 0;\r\n  height: 100%;\r\n  font-size: 12px;\r\n  line-height: 20px;\r\n  color: #fff;\r\n  text-align: center;\r\n  background-color: #337ab7;\r\n  -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .15);\r\n          box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .15);\r\n  -webkit-transition: width .6s ease;\r\n       -o-transition: width .6s ease;\r\n          transition: width .6s ease;\r\n}\r\n.progress-striped .progress-bar,\r\n.progress-bar-striped {\r\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n  background-image:      -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n  background-image:         linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n  -webkit-background-size: 40px 40px;\r\n          background-size: 40px 40px;\r\n}\r\n.progress.active .progress-bar,\r\n.progress-bar.active {\r\n  -webkit-animation: progress-bar-stripes 2s linear infinite;\r\n       -o-animation: progress-bar-stripes 2s linear infinite;\r\n          animation: progress-bar-stripes 2s linear infinite;\r\n}\r\n.progress-bar-success {\r\n  background-color: #5cb85c;\r\n}\r\n.progress-striped .progress-bar-success {\r\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n  background-image:      -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n  background-image:         linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n}\r\n.progress-bar-info {\r\n  background-color: #5bc0de;\r\n}\r\n.progress-striped .progress-bar-info {\r\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n  background-image:      -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n  background-image:         linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n}\r\n.progress-bar-warning {\r\n  background-color: #f0ad4e;\r\n}\r\n.progress-striped .progress-bar-warning {\r\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n  background-image:      -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n  background-image:         linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n}\r\n.progress-bar-danger {\r\n  background-color: #d9534f;\r\n}\r\n.progress-striped .progress-bar-danger {\r\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n  background-image:      -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n  background-image:         linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);\r\n}\r\n.media {\r\n  margin-top: 15px;\r\n}\r\n.media:first-child {\r\n  margin-top: 0;\r\n}\r\n.media,\r\n.media-body {\r\n  overflow: hidden;\r\n  zoom: 1;\r\n}\r\n.media-body {\r\n  width: 10000px;\r\n}\r\n.media-object {\r\n  display: block;\r\n}\r\n.media-right,\r\n.media > .pull-right {\r\n  padding-left: 10px;\r\n}\r\n.media-left,\r\n.media > .pull-left {\r\n  padding-right: 10px;\r\n}\r\n.media-left,\r\n.media-right,\r\n.media-body {\r\n  display: table-cell;\r\n  vertical-align: top;\r\n}\r\n.media-middle {\r\n  vertical-align: middle;\r\n}\r\n.media-bottom {\r\n  vertical-align: bottom;\r\n}\r\n.media-heading {\r\n  margin-top: 0;\r\n  margin-bottom: 5px;\r\n}\r\n.media-list {\r\n  padding-left: 0;\r\n  list-style: none;\r\n}\r\n.list-group {\r\n  padding-left: 0;\r\n  margin-bottom: 20px;\r\n}\r\n.list-group-item {\r\n  position: relative;\r\n  display: block;\r\n  padding: 10px 15px;\r\n  margin-bottom: -1px;\r\n  background-color: #fff;\r\n  border: 1px solid #ddd;\r\n}\r\n.list-group-item:first-child {\r\n  border-top-left-radius: 4px;\r\n  border-top-right-radius: 4px;\r\n}\r\n.list-group-item:last-child {\r\n  margin-bottom: 0;\r\n  border-bottom-right-radius: 4px;\r\n  border-bottom-left-radius: 4px;\r\n}\r\na.list-group-item {\r\n  color: #555;\r\n}\r\na.list-group-item .list-group-item-heading {\r\n  color: #333;\r\n}\r\na.list-group-item:hover,\r\na.list-group-item:focus {\r\n  color: #555;\r\n  text-decoration: none;\r\n  background-color: #f5f5f5;\r\n}\r\n.list-group-item.disabled,\r\n.list-group-item.disabled:hover,\r\n.list-group-item.disabled:focus {\r\n  color: #777;\r\n  cursor: not-allowed;\r\n  background-color: #eee;\r\n}\r\n.list-group-item.disabled .list-group-item-heading,\r\n.list-group-item.disabled:hover .list-group-item-heading,\r\n.list-group-item.disabled:focus .list-group-item-heading {\r\n  color: inherit;\r\n}\r\n.list-group-item.disabled .list-group-item-text,\r\n.list-group-item.disabled:hover .list-group-item-text,\r\n.list-group-item.disabled:focus .list-group-item-text {\r\n  color: #777;\r\n}\r\n.list-group-item.active,\r\n.list-group-item.active:hover,\r\n.list-group-item.active:focus {\r\n  z-index: 2;\r\n  color: #fff;\r\n  background-color: #337ab7;\r\n  border-color: #337ab7;\r\n}\r\n.list-group-item.active .list-group-item-heading,\r\n.list-group-item.active:hover .list-group-item-heading,\r\n.list-group-item.active:focus .list-group-item-heading,\r\n.list-group-item.active .list-group-item-heading > small,\r\n.list-group-item.active:hover .list-group-item-heading > small,\r\n.list-group-item.active:focus .list-group-item-heading > small,\r\n.list-group-item.active .list-group-item-heading > .small,\r\n.list-group-item.active:hover .list-group-item-heading > .small,\r\n.list-group-item.active:focus .list-group-item-heading > .small {\r\n  color: inherit;\r\n}\r\n.list-group-item.active .list-group-item-text,\r\n.list-group-item.active:hover .list-group-item-text,\r\n.list-group-item.active:focus .list-group-item-text {\r\n  color: #c7ddef;\r\n}\r\n.list-group-item-success {\r\n  color: #3c763d;\r\n  background-color: #dff0d8;\r\n}\r\na.list-group-item-success {\r\n  color: #3c763d;\r\n}\r\na.list-group-item-success .list-group-item-heading {\r\n  color: inherit;\r\n}\r\na.list-group-item-success:hover,\r\na.list-group-item-success:focus {\r\n  color: #3c763d;\r\n  background-color: #d0e9c6;\r\n}\r\na.list-group-item-success.active,\r\na.list-group-item-success.active:hover,\r\na.list-group-item-success.active:focus {\r\n  color: #fff;\r\n  background-color: #3c763d;\r\n  border-color: #3c763d;\r\n}\r\n.list-group-item-info {\r\n  color: #31708f;\r\n  background-color: #d9edf7;\r\n}\r\na.list-group-item-info {\r\n  color: #31708f;\r\n}\r\na.list-group-item-info .list-group-item-heading {\r\n  color: inherit;\r\n}\r\na.list-group-item-info:hover,\r\na.list-group-item-info:focus {\r\n  color: #31708f;\r\n  background-color: #c4e3f3;\r\n}\r\na.list-group-item-info.active,\r\na.list-group-item-info.active:hover,\r\na.list-group-item-info.active:focus {\r\n  color: #fff;\r\n  background-color: #31708f;\r\n  border-color: #31708f;\r\n}\r\n.list-group-item-warning {\r\n  color: #8a6d3b;\r\n  background-color: #fcf8e3;\r\n}\r\na.list-group-item-warning {\r\n  color: #8a6d3b;\r\n}\r\na.list-group-item-warning .list-group-item-heading {\r\n  color: inherit;\r\n}\r\na.list-group-item-warning:hover,\r\na.list-group-item-warning:focus {\r\n  color: #8a6d3b;\r\n  background-color: #faf2cc;\r\n}\r\na.list-group-item-warning.active,\r\na.list-group-item-warning.active:hover,\r\na.list-group-item-warning.active:focus {\r\n  color: #fff;\r\n  background-color: #8a6d3b;\r\n  border-color: #8a6d3b;\r\n}\r\n.list-group-item-danger {\r\n  color: #a94442;\r\n  background-color: #f2dede;\r\n}\r\na.list-group-item-danger {\r\n  color: #a94442;\r\n}\r\na.list-group-item-danger .list-group-item-heading {\r\n  color: inherit;\r\n}\r\na.list-group-item-danger:hover,\r\na.list-group-item-danger:focus {\r\n  color: #a94442;\r\n  background-color: #ebcccc;\r\n}\r\na.list-group-item-danger.active,\r\na.list-group-item-danger.active:hover,\r\na.list-group-item-danger.active:focus {\r\n  color: #fff;\r\n  background-color: #a94442;\r\n  border-color: #a94442;\r\n}\r\n.list-group-item-heading {\r\n  margin-top: 0;\r\n  margin-bottom: 5px;\r\n}\r\n.list-group-item-text {\r\n  margin-bottom: 0;\r\n  line-height: 1.3;\r\n}\r\n.panel {\r\n  margin-bottom: 20px;\r\n  background-color: #fff;\r\n  border: 1px solid transparent;\r\n  border-radius: 4px;\r\n  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);\r\n          box-shadow: 0 1px 1px rgba(0, 0, 0, .05);\r\n}\r\n.panel-body {\r\n  padding: 15px;\r\n}\r\n.panel-heading {\r\n  padding: 10px 15px;\r\n  border-bottom: 1px solid transparent;\r\n  border-top-left-radius: 3px;\r\n  border-top-right-radius: 3px;\r\n}\r\n.panel-heading > .dropdown .dropdown-toggle {\r\n  color: inherit;\r\n}\r\n.panel-title {\r\n  margin-top: 0;\r\n  margin-bottom: 0;\r\n  font-size: 16px;\r\n  color: inherit;\r\n}\r\n.panel-title > a,\r\n.panel-title > small,\r\n.panel-title > .small,\r\n.panel-title > small > a,\r\n.panel-title > .small > a {\r\n  color: inherit;\r\n}\r\n.panel-footer {\r\n  padding: 10px 15px;\r\n  background-color: #f5f5f5;\r\n  border-top: 1px solid #ddd;\r\n  border-bottom-right-radius: 3px;\r\n  border-bottom-left-radius: 3px;\r\n}\r\n.panel > .list-group,\r\n.panel > .panel-collapse > .list-group {\r\n  margin-bottom: 0;\r\n}\r\n.panel > .list-group .list-group-item,\r\n.panel > .panel-collapse > .list-group .list-group-item {\r\n  border-width: 1px 0;\r\n  border-radius: 0;\r\n}\r\n.panel > .list-group:first-child .list-group-item:first-child,\r\n.panel > .panel-collapse > .list-group:first-child .list-group-item:first-child {\r\n  border-top: 0;\r\n  border-top-left-radius: 3px;\r\n  border-top-right-radius: 3px;\r\n}\r\n.panel > .list-group:last-child .list-group-item:last-child,\r\n.panel > .panel-collapse > .list-group:last-child .list-group-item:last-child {\r\n  border-bottom: 0;\r\n  border-bottom-right-radius: 3px;\r\n  border-bottom-left-radius: 3px;\r\n}\r\n.panel-heading + .list-group .list-group-item:first-child {\r\n  border-top-width: 0;\r\n}\r\n.list-group + .panel-footer {\r\n  border-top-width: 0;\r\n}\r\n.panel > .table,\r\n.panel > .table-responsive > .table,\r\n.panel > .panel-collapse > .table {\r\n  margin-bottom: 0;\r\n}\r\n.panel > .table caption,\r\n.panel > .table-responsive > .table caption,\r\n.panel > .panel-collapse > .table caption {\r\n  padding-right: 15px;\r\n  padding-left: 15px;\r\n}\r\n.panel > .table:first-child,\r\n.panel > .table-responsive:first-child > .table:first-child {\r\n  border-top-left-radius: 3px;\r\n  border-top-right-radius: 3px;\r\n}\r\n.panel > .table:first-child > thead:first-child > tr:first-child,\r\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child,\r\n.panel > .table:first-child > tbody:first-child > tr:first-child,\r\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child {\r\n  border-top-left-radius: 3px;\r\n  border-top-right-radius: 3px;\r\n}\r\n.panel > .table:first-child > thead:first-child > tr:first-child td:first-child,\r\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:first-child,\r\n.panel > .table:first-child > tbody:first-child > tr:first-child td:first-child,\r\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:first-child,\r\n.panel > .table:first-child > thead:first-child > tr:first-child th:first-child,\r\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:first-child,\r\n.panel > .table:first-child > tbody:first-child > tr:first-child th:first-child,\r\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:first-child {\r\n  border-top-left-radius: 3px;\r\n}\r\n.panel > .table:first-child > thead:first-child > tr:first-child td:last-child,\r\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:last-child,\r\n.panel > .table:first-child > tbody:first-child > tr:first-child td:last-child,\r\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:last-child,\r\n.panel > .table:first-child > thead:first-child > tr:first-child th:last-child,\r\n.panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:last-child,\r\n.panel > .table:first-child > tbody:first-child > tr:first-child th:last-child,\r\n.panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:last-child {\r\n  border-top-right-radius: 3px;\r\n}\r\n.panel > .table:last-child,\r\n.panel > .table-responsive:last-child > .table:last-child {\r\n  border-bottom-right-radius: 3px;\r\n  border-bottom-left-radius: 3px;\r\n}\r\n.panel > .table:last-child > tbody:last-child > tr:last-child,\r\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child,\r\n.panel > .table:last-child > tfoot:last-child > tr:last-child,\r\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child {\r\n  border-bottom-right-radius: 3px;\r\n  border-bottom-left-radius: 3px;\r\n}\r\n.panel > .table:last-child > tbody:last-child > tr:last-child td:first-child,\r\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:first-child,\r\n.panel > .table:last-child > tfoot:last-child > tr:last-child td:first-child,\r\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:first-child,\r\n.panel > .table:last-child > tbody:last-child > tr:last-child th:first-child,\r\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:first-child,\r\n.panel > .table:last-child > tfoot:last-child > tr:last-child th:first-child,\r\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:first-child {\r\n  border-bottom-left-radius: 3px;\r\n}\r\n.panel > .table:last-child > tbody:last-child > tr:last-child td:last-child,\r\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:last-child,\r\n.panel > .table:last-child > tfoot:last-child > tr:last-child td:last-child,\r\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:last-child,\r\n.panel > .table:last-child > tbody:last-child > tr:last-child th:last-child,\r\n.panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:last-child,\r\n.panel > .table:last-child > tfoot:last-child > tr:last-child th:last-child,\r\n.panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:last-child {\r\n  border-bottom-right-radius: 3px;\r\n}\r\n.panel > .panel-body + .table,\r\n.panel > .panel-body + .table-responsive,\r\n.panel > .table + .panel-body,\r\n.panel > .table-responsive + .panel-body {\r\n  border-top: 1px solid #ddd;\r\n}\r\n.panel > .table > tbody:first-child > tr:first-child th,\r\n.panel > .table > tbody:first-child > tr:first-child td {\r\n  border-top: 0;\r\n}\r\n.panel > .table-bordered,\r\n.panel > .table-responsive > .table-bordered {\r\n  border: 0;\r\n}\r\n.panel > .table-bordered > thead > tr > th:first-child,\r\n.panel > .table-responsive > .table-bordered > thead > tr > th:first-child,\r\n.panel > .table-bordered > tbody > tr > th:first-child,\r\n.panel > .table-responsive > .table-bordered > tbody > tr > th:first-child,\r\n.panel > .table-bordered > tfoot > tr > th:first-child,\r\n.panel > .table-responsive > .table-bordered > tfoot > tr > th:first-child,\r\n.panel > .table-bordered > thead > tr > td:first-child,\r\n.panel > .table-responsive > .table-bordered > thead > tr > td:first-child,\r\n.panel > .table-bordered > tbody > tr > td:first-child,\r\n.panel > .table-responsive > .table-bordered > tbody > tr > td:first-child,\r\n.panel > .table-bordered > tfoot > tr > td:first-child,\r\n.panel > .table-responsive > .table-bordered > tfoot > tr > td:first-child {\r\n  border-left: 0;\r\n}\r\n.panel > .table-bordered > thead > tr > th:last-child,\r\n.panel > .table-responsive > .table-bordered > thead > tr > th:last-child,\r\n.panel > .table-bordered > tbody > tr > th:last-child,\r\n.panel > .table-responsive > .table-bordered > tbody > tr > th:last-child,\r\n.panel > .table-bordered > tfoot > tr > th:last-child,\r\n.panel > .table-responsive > .table-bordered > tfoot > tr > th:last-child,\r\n.panel > .table-bordered > thead > tr > td:last-child,\r\n.panel > .table-responsive > .table-bordered > thead > tr > td:last-child,\r\n.panel > .table-bordered > tbody > tr > td:last-child,\r\n.panel > .table-responsive > .table-bordered > tbody > tr > td:last-child,\r\n.panel > .table-bordered > tfoot > tr > td:last-child,\r\n.panel > .table-responsive > .table-bordered > tfoot > tr > td:last-child {\r\n  border-right: 0;\r\n}\r\n.panel > .table-bordered > thead > tr:first-child > td,\r\n.panel > .table-responsive > .table-bordered > thead > tr:first-child > td,\r\n.panel > .table-bordered > tbody > tr:first-child > td,\r\n.panel > .table-responsive > .table-bordered > tbody > tr:first-child > td,\r\n.panel > .table-bordered > thead > tr:first-child > th,\r\n.panel > .table-responsive > .table-bordered > thead > tr:first-child > th,\r\n.panel > .table-bordered > tbody > tr:first-child > th,\r\n.panel > .table-responsive > .table-bordered > tbody > tr:first-child > th {\r\n  border-bottom: 0;\r\n}\r\n.panel > .table-bordered > tbody > tr:last-child > td,\r\n.panel > .table-responsive > .table-bordered > tbody > tr:last-child > td,\r\n.panel > .table-bordered > tfoot > tr:last-child > td,\r\n.panel > .table-responsive > .table-bordered > tfoot > tr:last-child > td,\r\n.panel > .table-bordered > tbody > tr:last-child > th,\r\n.panel > .table-responsive > .table-bordered > tbody > tr:last-child > th,\r\n.panel > .table-bordered > tfoot > tr:last-child > th,\r\n.panel > .table-responsive > .table-bordered > tfoot > tr:last-child > th {\r\n  border-bottom: 0;\r\n}\r\n.panel > .table-responsive {\r\n  margin-bottom: 0;\r\n  border: 0;\r\n}\r\n.panel-group {\r\n  margin-bottom: 20px;\r\n}\r\n.panel-group .panel {\r\n  margin-bottom: 0;\r\n  border-radius: 4px;\r\n}\r\n.panel-group .panel + .panel {\r\n  margin-top: 5px;\r\n}\r\n.panel-group .panel-heading {\r\n  border-bottom: 0;\r\n}\r\n.panel-group .panel-heading + .panel-collapse > .panel-body,\r\n.panel-group .panel-heading + .panel-collapse > .list-group {\r\n  border-top: 1px solid #ddd;\r\n}\r\n.panel-group .panel-footer {\r\n  border-top: 0;\r\n}\r\n.panel-group .panel-footer + .panel-collapse .panel-body {\r\n  border-bottom: 1px solid #ddd;\r\n}\r\n.panel-default {\r\n  border-color: #ddd;\r\n}\r\n.panel-default > .panel-heading {\r\n  color: #333;\r\n  background-color: #f5f5f5;\r\n  border-color: #ddd;\r\n}\r\n.panel-default > .panel-heading + .panel-collapse > .panel-body {\r\n  border-top-color: #ddd;\r\n}\r\n.panel-default > .panel-heading .badge {\r\n  color: #f5f5f5;\r\n  background-color: #333;\r\n}\r\n.panel-default > .panel-footer + .panel-collapse > .panel-body {\r\n  border-bottom-color: #ddd;\r\n}\r\n.panel-primary {\r\n  border-color: #337ab7;\r\n}\r\n.panel-primary > .panel-heading {\r\n  color: #fff;\r\n  background-color: #337ab7;\r\n  border-color: #337ab7;\r\n}\r\n.panel-primary > .panel-heading + .panel-collapse > .panel-body {\r\n  border-top-color: #337ab7;\r\n}\r\n.panel-primary > .panel-heading .badge {\r\n  color: #337ab7;\r\n  background-color: #fff;\r\n}\r\n.panel-primary > .panel-footer + .panel-collapse > .panel-body {\r\n  border-bottom-color: #337ab7;\r\n}\r\n.panel-success {\r\n  border-color: #d6e9c6;\r\n}\r\n.panel-success > .panel-heading {\r\n  color: #3c763d;\r\n  background-color: #dff0d8;\r\n  border-color: #d6e9c6;\r\n}\r\n.panel-success > .panel-heading + .panel-collapse > .panel-body {\r\n  border-top-color: #d6e9c6;\r\n}\r\n.panel-success > .panel-heading .badge {\r\n  color: #dff0d8;\r\n  background-color: #3c763d;\r\n}\r\n.panel-success > .panel-footer + .panel-collapse > .panel-body {\r\n  border-bottom-color: #d6e9c6;\r\n}\r\n.panel-info {\r\n  border-color: #bce8f1;\r\n}\r\n.panel-info > .panel-heading {\r\n  color: #31708f;\r\n  background-color: #d9edf7;\r\n  border-color: #bce8f1;\r\n}\r\n.panel-info > .panel-heading + .panel-collapse > .panel-body {\r\n  border-top-color: #bce8f1;\r\n}\r\n.panel-info > .panel-heading .badge {\r\n  color: #d9edf7;\r\n  background-color: #31708f;\r\n}\r\n.panel-info > .panel-footer + .panel-collapse > .panel-body {\r\n  border-bottom-color: #bce8f1;\r\n}\r\n.panel-warning {\r\n  border-color: #faebcc;\r\n}\r\n.panel-warning > .panel-heading {\r\n  color: #8a6d3b;\r\n  background-color: #fcf8e3;\r\n  border-color: #faebcc;\r\n}\r\n.panel-warning > .panel-heading + .panel-collapse > .panel-body {\r\n  border-top-color: #faebcc;\r\n}\r\n.panel-warning > .panel-heading .badge {\r\n  color: #fcf8e3;\r\n  background-color: #8a6d3b;\r\n}\r\n.panel-warning > .panel-footer + .panel-collapse > .panel-body {\r\n  border-bottom-color: #faebcc;\r\n}\r\n.panel-danger {\r\n  border-color: #ebccd1;\r\n}\r\n.panel-danger > .panel-heading {\r\n  color: #a94442;\r\n  background-color: #f2dede;\r\n  border-color: #ebccd1;\r\n}\r\n.panel-danger > .panel-heading + .panel-collapse > .panel-body {\r\n  border-top-color: #ebccd1;\r\n}\r\n.panel-danger > .panel-heading .badge {\r\n  color: #f2dede;\r\n  background-color: #a94442;\r\n}\r\n.panel-danger > .panel-footer + .panel-collapse > .panel-body {\r\n  border-bottom-color: #ebccd1;\r\n}\r\n.embed-responsive {\r\n  position: relative;\r\n  display: block;\r\n  height: 0;\r\n  padding: 0;\r\n  overflow: hidden;\r\n}\r\n.embed-responsive .embed-responsive-item,\r\n.embed-responsive iframe,\r\n.embed-responsive embed,\r\n.embed-responsive object,\r\n.embed-responsive video {\r\n  position: absolute;\r\n  top: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n  border: 0;\r\n}\r\n.embed-responsive-16by9 {\r\n  padding-bottom: 56.25%;\r\n}\r\n.embed-responsive-4by3 {\r\n  padding-bottom: 75%;\r\n}\r\n.well {\r\n  min-height: 20px;\r\n  padding: 19px;\r\n  margin-bottom: 20px;\r\n  background-color: #f5f5f5;\r\n  border: 1px solid #e3e3e3;\r\n  border-radius: 4px;\r\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);\r\n          box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);\r\n}\r\n.well blockquote {\r\n  border-color: #ddd;\r\n  border-color: rgba(0, 0, 0, .15);\r\n}\r\n.well-lg {\r\n  padding: 24px;\r\n  border-radius: 6px;\r\n}\r\n.well-sm {\r\n  padding: 9px;\r\n  border-radius: 3px;\r\n}\r\n.close {\r\n  float: right;\r\n  font-size: 21px;\r\n  font-weight: bold;\r\n  line-height: 1;\r\n  color: #000;\r\n  text-shadow: 0 1px 0 #fff;\r\n  filter: alpha(opacity=20);\r\n  opacity: .2;\r\n}\r\n.close:hover,\r\n.close:focus {\r\n  color: #000;\r\n  text-decoration: none;\r\n  cursor: pointer;\r\n  filter: alpha(opacity=50);\r\n  opacity: .5;\r\n}\r\nbutton.close {\r\n  -webkit-appearance: none;\r\n  padding: 0;\r\n  cursor: pointer;\r\n  background: transparent;\r\n  border: 0;\r\n}\r\n.modal-open {\r\n  overflow: hidden;\r\n}\r\n.modal {\r\n  position: fixed;\r\n  top: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  z-index: 1050;\r\n  display: none;\r\n  overflow: hidden;\r\n  -webkit-overflow-scrolling: touch;\r\n  outline: 0;\r\n}\r\n.modal.fade .modal-dialog {\r\n  -webkit-transition: -webkit-transform .3s ease-out;\r\n       -o-transition:      -o-transform .3s ease-out;\r\n          transition:         transform .3s ease-out;\r\n  -webkit-transform: translate(0, -25%);\r\n      -ms-transform: translate(0, -25%);\r\n       -o-transform: translate(0, -25%);\r\n          transform: translate(0, -25%);\r\n}\r\n.modal.in .modal-dialog {\r\n  -webkit-transform: translate(0, 0);\r\n      -ms-transform: translate(0, 0);\r\n       -o-transform: translate(0, 0);\r\n          transform: translate(0, 0);\r\n}\r\n.modal-open .modal {\r\n  overflow-x: hidden;\r\n  overflow-y: auto;\r\n}\r\n.modal-dialog {\r\n  position: relative;\r\n  width: auto;\r\n  margin: 10px;\r\n}\r\n.modal-content {\r\n  position: relative;\r\n  background-color: #fff;\r\n  -webkit-background-clip: padding-box;\r\n          background-clip: padding-box;\r\n  border: 1px solid #999;\r\n  border: 1px solid rgba(0, 0, 0, .2);\r\n  border-radius: 6px;\r\n  outline: 0;\r\n  -webkit-box-shadow: 0 3px 9px rgba(0, 0, 0, .5);\r\n          box-shadow: 0 3px 9px rgba(0, 0, 0, .5);\r\n}\r\n.modal-backdrop {\r\n  position: fixed;\r\n  top: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  z-index: 1040;\r\n  background-color: #000;\r\n}\r\n.modal-backdrop.fade {\r\n  filter: alpha(opacity=0);\r\n  opacity: 0;\r\n}\r\n.modal-backdrop.in {\r\n  filter: alpha(opacity=50);\r\n  opacity: .5;\r\n}\r\n.modal-header {\r\n  min-height: 16.42857143px;\r\n  padding: 15px;\r\n  border-bottom: 1px solid #e5e5e5;\r\n}\r\n.modal-header .close {\r\n  margin-top: -2px;\r\n}\r\n.modal-title {\r\n  margin: 0;\r\n  line-height: 1.42857143;\r\n}\r\n.modal-body {\r\n  position: relative;\r\n  padding: 15px;\r\n}\r\n.modal-footer {\r\n  padding: 15px;\r\n  text-align: right;\r\n  border-top: 1px solid #e5e5e5;\r\n}\r\n.modal-footer .btn + .btn {\r\n  margin-bottom: 0;\r\n  margin-left: 5px;\r\n}\r\n.modal-footer .btn-group .btn + .btn {\r\n  margin-left: -1px;\r\n}\r\n.modal-footer .btn-block + .btn-block {\r\n  margin-left: 0;\r\n}\r\n.modal-scrollbar-measure {\r\n  position: absolute;\r\n  top: -9999px;\r\n  width: 50px;\r\n  height: 50px;\r\n  overflow: scroll;\r\n}\r\n@media (min-width: 768px) {\r\n  .modal-dialog {\r\n    width: 600px;\r\n    margin: 30px auto;\r\n  }\r\n  .modal-content {\r\n    -webkit-box-shadow: 0 5px 15px rgba(0, 0, 0, .5);\r\n            box-shadow: 0 5px 15px rgba(0, 0, 0, .5);\r\n  }\r\n  .modal-sm {\r\n    width: 300px;\r\n  }\r\n}\r\n@media (min-width: 992px) {\r\n  .modal-lg {\r\n    width: 900px;\r\n  }\r\n}\r\n.tooltip {\r\n  position: absolute;\r\n  z-index: 1070;\r\n  display: block;\r\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\r\n  font-size: 12px;\r\n  font-weight: normal;\r\n  line-height: 1.4;\r\n  filter: alpha(opacity=0);\r\n  opacity: 0;\r\n}\r\n.tooltip.in {\r\n  filter: alpha(opacity=90);\r\n  opacity: .9;\r\n}\r\n.tooltip.top {\r\n  padding: 5px 0;\r\n  margin-top: -3px;\r\n}\r\n.tooltip.right {\r\n  padding: 0 5px;\r\n  margin-left: 3px;\r\n}\r\n.tooltip.bottom {\r\n  padding: 5px 0;\r\n  margin-top: 3px;\r\n}\r\n.tooltip.left {\r\n  padding: 0 5px;\r\n  margin-left: -3px;\r\n}\r\n.tooltip-inner {\r\n  max-width: 200px;\r\n  padding: 3px 8px;\r\n  color: #fff;\r\n  text-align: center;\r\n  text-decoration: none;\r\n  background-color: #000;\r\n  border-radius: 4px;\r\n}\r\n.tooltip-arrow {\r\n  position: absolute;\r\n  width: 0;\r\n  height: 0;\r\n  border-color: transparent;\r\n  border-style: solid;\r\n}\r\n.tooltip.top .tooltip-arrow {\r\n  bottom: 0;\r\n  left: 50%;\r\n  margin-left: -5px;\r\n  border-width: 5px 5px 0;\r\n  border-top-color: #000;\r\n}\r\n.tooltip.top-left .tooltip-arrow {\r\n  right: 5px;\r\n  bottom: 0;\r\n  margin-bottom: -5px;\r\n  border-width: 5px 5px 0;\r\n  border-top-color: #000;\r\n}\r\n.tooltip.top-right .tooltip-arrow {\r\n  bottom: 0;\r\n  left: 5px;\r\n  margin-bottom: -5px;\r\n  border-width: 5px 5px 0;\r\n  border-top-color: #000;\r\n}\r\n.tooltip.right .tooltip-arrow {\r\n  top: 50%;\r\n  left: 0;\r\n  margin-top: -5px;\r\n  border-width: 5px 5px 5px 0;\r\n  border-right-color: #000;\r\n}\r\n.tooltip.left .tooltip-arrow {\r\n  top: 50%;\r\n  right: 0;\r\n  margin-top: -5px;\r\n  border-width: 5px 0 5px 5px;\r\n  border-left-color: #000;\r\n}\r\n.tooltip.bottom .tooltip-arrow {\r\n  top: 0;\r\n  left: 50%;\r\n  margin-left: -5px;\r\n  border-width: 0 5px 5px;\r\n  border-bottom-color: #000;\r\n}\r\n.tooltip.bottom-left .tooltip-arrow {\r\n  top: 0;\r\n  right: 5px;\r\n  margin-top: -5px;\r\n  border-width: 0 5px 5px;\r\n  border-bottom-color: #000;\r\n}\r\n.tooltip.bottom-right .tooltip-arrow {\r\n  top: 0;\r\n  left: 5px;\r\n  margin-top: -5px;\r\n  border-width: 0 5px 5px;\r\n  border-bottom-color: #000;\r\n}\r\n.popover {\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  z-index: 1060;\r\n  display: none;\r\n  max-width: 276px;\r\n  padding: 1px;\r\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\r\n  font-size: 14px;\r\n  font-weight: normal;\r\n  line-height: 1.42857143;\r\n  text-align: left;\r\n  white-space: normal;\r\n  background-color: #fff;\r\n  -webkit-background-clip: padding-box;\r\n          background-clip: padding-box;\r\n  border: 1px solid #ccc;\r\n  border: 1px solid rgba(0, 0, 0, .2);\r\n  border-radius: 6px;\r\n  -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, .2);\r\n          box-shadow: 0 5px 10px rgba(0, 0, 0, .2);\r\n}\r\n.popover.top {\r\n  margin-top: -10px;\r\n}\r\n.popover.right {\r\n  margin-left: 10px;\r\n}\r\n.popover.bottom {\r\n  margin-top: 10px;\r\n}\r\n.popover.left {\r\n  margin-left: -10px;\r\n}\r\n.popover-title {\r\n  padding: 8px 14px;\r\n  margin: 0;\r\n  font-size: 14px;\r\n  background-color: #f7f7f7;\r\n  border-bottom: 1px solid #ebebeb;\r\n  border-radius: 5px 5px 0 0;\r\n}\r\n.popover-content {\r\n  padding: 9px 14px;\r\n}\r\n.popover > .arrow,\r\n.popover > .arrow:after {\r\n  position: absolute;\r\n  display: block;\r\n  width: 0;\r\n  height: 0;\r\n  border-color: transparent;\r\n  border-style: solid;\r\n}\r\n.popover > .arrow {\r\n  border-width: 11px;\r\n}\r\n.popover > .arrow:after {\r\n  content: \"\";\r\n  border-width: 10px;\r\n}\r\n.popover.top > .arrow {\r\n  bottom: -11px;\r\n  left: 50%;\r\n  margin-left: -11px;\r\n  border-top-color: #999;\r\n  border-top-color: rgba(0, 0, 0, .25);\r\n  border-bottom-width: 0;\r\n}\r\n.popover.top > .arrow:after {\r\n  bottom: 1px;\r\n  margin-left: -10px;\r\n  content: \" \";\r\n  border-top-color: #fff;\r\n  border-bottom-width: 0;\r\n}\r\n.popover.right > .arrow {\r\n  top: 50%;\r\n  left: -11px;\r\n  margin-top: -11px;\r\n  border-right-color: #999;\r\n  border-right-color: rgba(0, 0, 0, .25);\r\n  border-left-width: 0;\r\n}\r\n.popover.right > .arrow:after {\r\n  bottom: -10px;\r\n  left: 1px;\r\n  content: \" \";\r\n  border-right-color: #fff;\r\n  border-left-width: 0;\r\n}\r\n.popover.bottom > .arrow {\r\n  top: -11px;\r\n  left: 50%;\r\n  margin-left: -11px;\r\n  border-top-width: 0;\r\n  border-bottom-color: #999;\r\n  border-bottom-color: rgba(0, 0, 0, .25);\r\n}\r\n.popover.bottom > .arrow:after {\r\n  top: 1px;\r\n  margin-left: -10px;\r\n  content: \" \";\r\n  border-top-width: 0;\r\n  border-bottom-color: #fff;\r\n}\r\n.popover.left > .arrow {\r\n  top: 50%;\r\n  right: -11px;\r\n  margin-top: -11px;\r\n  border-right-width: 0;\r\n  border-left-color: #999;\r\n  border-left-color: rgba(0, 0, 0, .25);\r\n}\r\n.popover.left > .arrow:after {\r\n  right: 1px;\r\n  bottom: -10px;\r\n  content: \" \";\r\n  border-right-width: 0;\r\n  border-left-color: #fff;\r\n}\r\n.carousel {\r\n  position: relative;\r\n}\r\n.carousel-inner {\r\n  position: relative;\r\n  width: 100%;\r\n  overflow: hidden;\r\n}\r\n.carousel-inner > .item {\r\n  position: relative;\r\n  display: none;\r\n  -webkit-transition: .6s ease-in-out left;\r\n       -o-transition: .6s ease-in-out left;\r\n          transition: .6s ease-in-out left;\r\n}\r\n.carousel-inner > .item > img,\r\n.carousel-inner > .item > a > img {\r\n  line-height: 1;\r\n}\r\n@media all and (transform-3d), (-webkit-transform-3d) {\r\n  .carousel-inner > .item {\r\n    -webkit-transition: -webkit-transform .6s ease-in-out;\r\n         -o-transition:      -o-transform .6s ease-in-out;\r\n            transition:         transform .6s ease-in-out;\r\n\r\n    -webkit-backface-visibility: hidden;\r\n            backface-visibility: hidden;\r\n    -webkit-perspective: 1000;\r\n            perspective: 1000;\r\n  }\r\n  .carousel-inner > .item.next,\r\n  .carousel-inner > .item.active.right {\r\n    left: 0;\r\n    -webkit-transform: translate3d(100%, 0, 0);\r\n            transform: translate3d(100%, 0, 0);\r\n  }\r\n  .carousel-inner > .item.prev,\r\n  .carousel-inner > .item.active.left {\r\n    left: 0;\r\n    -webkit-transform: translate3d(-100%, 0, 0);\r\n            transform: translate3d(-100%, 0, 0);\r\n  }\r\n  .carousel-inner > .item.next.left,\r\n  .carousel-inner > .item.prev.right,\r\n  .carousel-inner > .item.active {\r\n    left: 0;\r\n    -webkit-transform: translate3d(0, 0, 0);\r\n            transform: translate3d(0, 0, 0);\r\n  }\r\n}\r\n.carousel-inner > .active,\r\n.carousel-inner > .next,\r\n.carousel-inner > .prev {\r\n  display: block;\r\n}\r\n.carousel-inner > .active {\r\n  left: 0;\r\n}\r\n.carousel-inner > .next,\r\n.carousel-inner > .prev {\r\n  position: absolute;\r\n  top: 0;\r\n  width: 100%;\r\n}\r\n.carousel-inner > .next {\r\n  left: 100%;\r\n}\r\n.carousel-inner > .prev {\r\n  left: -100%;\r\n}\r\n.carousel-inner > .next.left,\r\n.carousel-inner > .prev.right {\r\n  left: 0;\r\n}\r\n.carousel-inner > .active.left {\r\n  left: -100%;\r\n}\r\n.carousel-inner > .active.right {\r\n  left: 100%;\r\n}\r\n.carousel-control {\r\n  position: absolute;\r\n  top: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  width: 15%;\r\n  font-size: 20px;\r\n  color: #fff;\r\n  text-align: center;\r\n  text-shadow: 0 1px 2px rgba(0, 0, 0, .6);\r\n  filter: alpha(opacity=50);\r\n  opacity: .5;\r\n}\r\n.carousel-control.left {\r\n  background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, .5) 0%, rgba(0, 0, 0, .0001) 100%);\r\n  background-image:      -o-linear-gradient(left, rgba(0, 0, 0, .5) 0%, rgba(0, 0, 0, .0001) 100%);\r\n  background-image: -webkit-gradient(linear, left top, right top, from(rgba(0, 0, 0, .5)), to(rgba(0, 0, 0, .0001)));\r\n  background-image:         linear-gradient(to right, rgba(0, 0, 0, .5) 0%, rgba(0, 0, 0, .0001) 100%);\r\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#80000000', endColorstr='#00000000', GradientType=1);\r\n  background-repeat: repeat-x;\r\n}\r\n.carousel-control.right {\r\n  right: 0;\r\n  left: auto;\r\n  background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, .0001) 0%, rgba(0, 0, 0, .5) 100%);\r\n  background-image:      -o-linear-gradient(left, rgba(0, 0, 0, .0001) 0%, rgba(0, 0, 0, .5) 100%);\r\n  background-image: -webkit-gradient(linear, left top, right top, from(rgba(0, 0, 0, .0001)), to(rgba(0, 0, 0, .5)));\r\n  background-image:         linear-gradient(to right, rgba(0, 0, 0, .0001) 0%, rgba(0, 0, 0, .5) 100%);\r\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#80000000', GradientType=1);\r\n  background-repeat: repeat-x;\r\n}\r\n.carousel-control:hover,\r\n.carousel-control:focus {\r\n  color: #fff;\r\n  text-decoration: none;\r\n  filter: alpha(opacity=90);\r\n  outline: 0;\r\n  opacity: .9;\r\n}\r\n.carousel-control .icon-prev,\r\n.carousel-control .icon-next,\r\n.carousel-control .glyphicon-chevron-left,\r\n.carousel-control .glyphicon-chevron-right {\r\n  position: absolute;\r\n  top: 50%;\r\n  z-index: 5;\r\n  display: inline-block;\r\n}\r\n.carousel-control .icon-prev,\r\n.carousel-control .glyphicon-chevron-left {\r\n  left: 50%;\r\n  margin-left: -10px;\r\n}\r\n.carousel-control .icon-next,\r\n.carousel-control .glyphicon-chevron-right {\r\n  right: 50%;\r\n  margin-right: -10px;\r\n}\r\n.carousel-control .icon-prev,\r\n.carousel-control .icon-next {\r\n  width: 20px;\r\n  height: 20px;\r\n  margin-top: -10px;\r\n  font-family: serif;\r\n  line-height: 1;\r\n}\r\n.carousel-control .icon-prev:before {\r\n  content: '\\2039';\r\n}\r\n.carousel-control .icon-next:before {\r\n  content: '\\203A';\r\n}\r\n.carousel-indicators {\r\n  position: absolute;\r\n  bottom: 10px;\r\n  left: 50%;\r\n  z-index: 15;\r\n  width: 60%;\r\n  padding-left: 0;\r\n  margin-left: -30%;\r\n  text-align: center;\r\n  list-style: none;\r\n}\r\n.carousel-indicators li {\r\n  display: inline-block;\r\n  width: 10px;\r\n  height: 10px;\r\n  margin: 1px;\r\n  text-indent: -999px;\r\n  cursor: pointer;\r\n  background-color: #000 \\9;\r\n  background-color: rgba(0, 0, 0, 0);\r\n  border: 1px solid #fff;\r\n  border-radius: 10px;\r\n}\r\n.carousel-indicators .active {\r\n  width: 12px;\r\n  height: 12px;\r\n  margin: 0;\r\n  background-color: #fff;\r\n}\r\n.carousel-caption {\r\n  position: absolute;\r\n  right: 15%;\r\n  bottom: 20px;\r\n  left: 15%;\r\n  z-index: 10;\r\n  padding-top: 20px;\r\n  padding-bottom: 20px;\r\n  color: #fff;\r\n  text-align: center;\r\n  text-shadow: 0 1px 2px rgba(0, 0, 0, .6);\r\n}\r\n.carousel-caption .btn {\r\n  text-shadow: none;\r\n}\r\n@media screen and (min-width: 768px) {\r\n  .carousel-control .glyphicon-chevron-left,\r\n  .carousel-control .glyphicon-chevron-right,\r\n  .carousel-control .icon-prev,\r\n  .carousel-control .icon-next {\r\n    width: 30px;\r\n    height: 30px;\r\n    margin-top: -15px;\r\n    font-size: 30px;\r\n  }\r\n  .carousel-control .glyphicon-chevron-left,\r\n  .carousel-control .icon-prev {\r\n    margin-left: -15px;\r\n  }\r\n  .carousel-control .glyphicon-chevron-right,\r\n  .carousel-control .icon-next {\r\n    margin-right: -15px;\r\n  }\r\n  .carousel-caption {\r\n    right: 20%;\r\n    left: 20%;\r\n    padding-bottom: 30px;\r\n  }\r\n  .carousel-indicators {\r\n    bottom: 20px;\r\n  }\r\n}\r\n.clearfix:before,\r\n.clearfix:after,\r\n.dl-horizontal dd:before,\r\n.dl-horizontal dd:after,\r\n.container:before,\r\n.container:after,\r\n.container-fluid:before,\r\n.container-fluid:after,\r\n.row:before,\r\n.row:after,\r\n.form-horizontal .form-group:before,\r\n.form-horizontal .form-group:after,\r\n.btn-toolbar:before,\r\n.btn-toolbar:after,\r\n.btn-group-vertical > .btn-group:before,\r\n.btn-group-vertical > .btn-group:after,\r\n.nav:before,\r\n.nav:after,\r\n.navbar:before,\r\n.navbar:after,\r\n.navbar-header:before,\r\n.navbar-header:after,\r\n.navbar-collapse:before,\r\n.navbar-collapse:after,\r\n.pager:before,\r\n.pager:after,\r\n.panel-body:before,\r\n.panel-body:after,\r\n.modal-footer:before,\r\n.modal-footer:after {\r\n  display: table;\r\n  content: \" \";\r\n}\r\n.clearfix:after,\r\n.dl-horizontal dd:after,\r\n.container:after,\r\n.container-fluid:after,\r\n.row:after,\r\n.form-horizontal .form-group:after,\r\n.btn-toolbar:after,\r\n.btn-group-vertical > .btn-group:after,\r\n.nav:after,\r\n.navbar:after,\r\n.navbar-header:after,\r\n.navbar-collapse:after,\r\n.pager:after,\r\n.panel-body:after,\r\n.modal-footer:after {\r\n  clear: both;\r\n}\r\n.center-block {\r\n  display: block;\r\n  margin-right: auto;\r\n  margin-left: auto;\r\n}\r\n.pull-right {\r\n  float: right !important;\r\n}\r\n.pull-left {\r\n  float: left !important;\r\n}\r\n.hide {\r\n  display: none !important;\r\n}\r\n.show {\r\n  display: block !important;\r\n}\r\n.invisible {\r\n  visibility: hidden;\r\n}\r\n.text-hide {\r\n  font: 0/0 a;\r\n  color: transparent;\r\n  text-shadow: none;\r\n  background-color: transparent;\r\n  border: 0;\r\n}\r\n.hidden {\r\n  display: none !important;\r\n}\r\n.affix {\r\n  position: fixed;\r\n}\r\n@-ms-viewport {\r\n  width: device-width;\r\n}\r\n.visible-xs,\r\n.visible-sm,\r\n.visible-md,\r\n.visible-lg {\r\n  display: none !important;\r\n}\r\n.visible-xs-block,\r\n.visible-xs-inline,\r\n.visible-xs-inline-block,\r\n.visible-sm-block,\r\n.visible-sm-inline,\r\n.visible-sm-inline-block,\r\n.visible-md-block,\r\n.visible-md-inline,\r\n.visible-md-inline-block,\r\n.visible-lg-block,\r\n.visible-lg-inline,\r\n.visible-lg-inline-block {\r\n  display: none !important;\r\n}\r\n@media (max-width: 767px) {\r\n  .visible-xs {\r\n    display: block !important;\r\n  }\r\n  table.visible-xs {\r\n    display: table;\r\n  }\r\n  tr.visible-xs {\r\n    display: table-row !important;\r\n  }\r\n  th.visible-xs,\r\n  td.visible-xs {\r\n    display: table-cell !important;\r\n  }\r\n}\r\n@media (max-width: 767px) {\r\n  .visible-xs-block {\r\n    display: block !important;\r\n  }\r\n}\r\n@media (max-width: 767px) {\r\n  .visible-xs-inline {\r\n    display: inline !important;\r\n  }\r\n}\r\n@media (max-width: 767px) {\r\n  .visible-xs-inline-block {\r\n    display: inline-block !important;\r\n  }\r\n}\r\n@media (min-width: 768px) and (max-width: 991px) {\r\n  .visible-sm {\r\n    display: block !important;\r\n  }\r\n  table.visible-sm {\r\n    display: table;\r\n  }\r\n  tr.visible-sm {\r\n    display: table-row !important;\r\n  }\r\n  th.visible-sm,\r\n  td.visible-sm {\r\n    display: table-cell !important;\r\n  }\r\n}\r\n@media (min-width: 768px) and (max-width: 991px) {\r\n  .visible-sm-block {\r\n    display: block !important;\r\n  }\r\n}\r\n@media (min-width: 768px) and (max-width: 991px) {\r\n  .visible-sm-inline {\r\n    display: inline !important;\r\n  }\r\n}\r\n@media (min-width: 768px) and (max-width: 991px) {\r\n  .visible-sm-inline-block {\r\n    display: inline-block !important;\r\n  }\r\n}\r\n@media (min-width: 992px) and (max-width: 1199px) {\r\n  .visible-md {\r\n    display: block !important;\r\n  }\r\n  table.visible-md {\r\n    display: table;\r\n  }\r\n  tr.visible-md {\r\n    display: table-row !important;\r\n  }\r\n  th.visible-md,\r\n  td.visible-md {\r\n    display: table-cell !important;\r\n  }\r\n}\r\n@media (min-width: 992px) and (max-width: 1199px) {\r\n  .visible-md-block {\r\n    display: block !important;\r\n  }\r\n}\r\n@media (min-width: 992px) and (max-width: 1199px) {\r\n  .visible-md-inline {\r\n    display: inline !important;\r\n  }\r\n}\r\n@media (min-width: 992px) and (max-width: 1199px) {\r\n  .visible-md-inline-block {\r\n    display: inline-block !important;\r\n  }\r\n}\r\n@media (min-width: 1200px) {\r\n  .visible-lg {\r\n    display: block !important;\r\n  }\r\n  table.visible-lg {\r\n    display: table;\r\n  }\r\n  tr.visible-lg {\r\n    display: table-row !important;\r\n  }\r\n  th.visible-lg,\r\n  td.visible-lg {\r\n    display: table-cell !important;\r\n  }\r\n}\r\n@media (min-width: 1200px) {\r\n  .visible-lg-block {\r\n    display: block !important;\r\n  }\r\n}\r\n@media (min-width: 1200px) {\r\n  .visible-lg-inline {\r\n    display: inline !important;\r\n  }\r\n}\r\n@media (min-width: 1200px) {\r\n  .visible-lg-inline-block {\r\n    display: inline-block !important;\r\n  }\r\n}\r\n@media (max-width: 767px) {\r\n  .hidden-xs {\r\n    display: none !important;\r\n  }\r\n}\r\n@media (min-width: 768px) and (max-width: 991px) {\r\n  .hidden-sm {\r\n    display: none !important;\r\n  }\r\n}\r\n@media (min-width: 992px) and (max-width: 1199px) {\r\n  .hidden-md {\r\n    display: none !important;\r\n  }\r\n}\r\n@media (min-width: 1200px) {\r\n  .hidden-lg {\r\n    display: none !important;\r\n  }\r\n}\r\n.visible-print {\r\n  display: none !important;\r\n}\r\n@media print {\r\n  .visible-print {\r\n    display: block !important;\r\n  }\r\n  table.visible-print {\r\n    display: table;\r\n  }\r\n  tr.visible-print {\r\n    display: table-row !important;\r\n  }\r\n  th.visible-print,\r\n  td.visible-print {\r\n    display: table-cell !important;\r\n  }\r\n}\r\n.visible-print-block {\r\n  display: none !important;\r\n}\r\n@media print {\r\n  .visible-print-block {\r\n    display: block !important;\r\n  }\r\n}\r\n.visible-print-inline {\r\n  display: none !important;\r\n}\r\n@media print {\r\n  .visible-print-inline {\r\n    display: inline !important;\r\n  }\r\n}\r\n.visible-print-inline-block {\r\n  display: none !important;\r\n}\r\n@media print {\r\n  .visible-print-inline-block {\r\n    display: inline-block !important;\r\n  }\r\n}\r\n@media print {\r\n  .hidden-print {\r\n    display: none !important;\r\n  }\r\n}\r\n", ""]);

// exports


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "html {\n  overflow-y: scroll;\n}\nbody {\n  padding-top: 0px;\n  background: #f3f3f3;\n  font-family: 'Raleway', sans-serif !important;\n  color: #333333 !important;\n}\n.row {\n  margin-left: 0 !important;\n  margin-right: 0 !important;\n}\n.row > div {\n  margin-bottom: 15px;\n}\n", ""]);

// exports


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports
exports.push([module.i, "@import url(//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-glyphicons.css);", ""]);

// module
exports.push([module.i, "\n", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".validation-success {\n  opacity: 1;\n  display: block;\n  position: absolute;\n  right: 7.2px;\n  bottom: -35.2px;\n  font-size: 20.8px;\n  width: 36px;\n  height: 36px;\n  line-height: 36px;\n  text-align: center;\n  border-radius: 36px;\n  color: #62b14c;\n  z-index: 999999990;\n  transition: all ease-out 1.262s;\n}\n.validation-success.ng-hide {\n  transition-delay: 0s;\n  transition: all ease-out 0.12s;\n  opacity: 0;\n  transform: rotate(360deg);\n}\n.validation-success:after {\n  display: block;\n  content: \"*\";\n  font-family: 'Glyphicons Halflings';\n}\n.ng-hide-remove li {\n  opacity: 0;\n}\n.validation {\n  color: #fff;\n  margin: 0;\n  position: relative;\n  font-size: 14px;\n  overflow: visible;\n  background: #c00640;\n}\n.validation ul {\n  display: block;\n  overflow: hidden;\n}\n.validation li {\n  display: block;\n  line-height: 1;\n  background: #c00640;\n  position: absolute;\n  right: -4px;\n  top: -20px !important;\n  text-align: center;\n  font-weight: bold;\n  padding: 2px 10px;\n  color: #fff;\n  transform: rotate(0deg);\n  transition: all ease-in 0.2s;\n  opacity: 1;\n  transition-delay: 0s;\n}\n.validation li.ng-enter {\n  opacity: 0;\n  top: 0;\n}\n.validation li.ng-leave {\n  transition: all ease-in 0s;\n  opacity: 0;\n}\n*:focus + .validation li {\n  background-color: #63bff8 !important;\n}\ninput.ng-touched.ng-invalid:not(.ng-valid),\ntextarea.ng-touched.ng-invalid:not(.ng-valid),\nselect.ng-touched.ng-invalid:not(.ng-valid) {\n  border-color: #06C03E;\n}\ninput:focus,\ninput:focus.ng-touched.ng-invalid:not(.ng-valid),\ntextarea:focus,\ntextarea:focus.ng-touched.ng-invalid:not(.ng-valid),\nselect:focus,\nselect:focus.ng-touched.ng-invalid:not(.ng-valid) {\n  border-color: #63bff8;\n}\ninput.ng-valid-required.ng-valid:not(.ng-invalid),\ntextarea.ng-valid-required.ng-valid:not(.ng-invalid),\nselect.ng-valid-required.ng-valid:not(.ng-invalid) {\n  border-color: #62b14c;\n}\nform[class*=\"ng-invalid\"] button.btn {\n  background: #63bff8;\n  transition: none;\n}\nform button.btn {\n  transition: all ease-in 0.5s;\n  background: #62b14c;\n}\n.form-group .help-block.form-group-inline-message {\n  padding-top: 5px;\n}\ndiv.input-mask {\n  padding-top: 7px;\n}\n", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".errorMessage {\n  min-height: 20px;\n  padding: 19px;\n  margin-bottom: 19px;\n  background: #B92A2A;\n  color: white !important;\n}\n.successMessage {\n  min-height: 20px;\n  padding: 19px;\n  margin-bottom: 19px;\n  color: white;\n  background: #4CEC4C !Important;\n}\n.strike {\n  text-decoration: line-through;\n}\n.bold {\n  font-weight: bold;\n}\n.red {\n  color: #FF00C8;\n}\n.has-error {\n  color: #00FF73;\n  background-color: yellow;\n}\n.orange {\n  color: orange;\n}\n", ""]);

// exports


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "/**\n * Hamburg Menu\n * When the class of 'hamburg' is applied to the body tag of the document, \n * the sidebar changes it's style to attempt to mimic a menu on a phone app,\n * where the content is overlaying the content, rather than push it.\n */\n@media only screen and (max-width: 560px) {\n  body.hamburg #page-wrapper {\n    padding-left: 0;\n  }\n  body.hamburg #page-wrapper:not(.open) #sidebar-wrapper {\n    position: absolute;\n  }\n  body.hamburg #page-wrapper:not(.open) ul.sidebar .sidebar-title.separator {\n    display: none;\n  }\n}\n/**\n   * Header\n   */\n.row.header {\n  height: 60px;\n  background: #fff;\n  margin-bottom: 15px;\n}\n.row.header > div:last-child {\n  padding-right: 0;\n}\n.row.header .meta .page {\n  font-size: 17px;\n  padding-top: 11px;\n}\n.row.header .meta .breadcrumb-links {\n  font-size: 10px;\n}\n.row.header .meta div {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.row.header .login a {\n  padding: 18px;\n  display: block;\n}\n.row.header .user {\n  min-width: 130px;\n}\n.row.header .user > .item {\n  width: 65px;\n  height: 60px;\n  float: right;\n  display: inline-block;\n  text-align: center;\n  vertical-align: middle;\n}\n.row.header .user > .item a {\n  color: #919191;\n  display: block;\n}\n.row.header .user > .item i {\n  font-size: 20px;\n  line-height: 55px;\n}\n.row.header .user > .item img {\n  width: 40px;\n  height: 40px;\n  margin-top: 10px;\n  border-radius: 2px;\n}\n.row.header .user > .item ul.dropdown-menu {\n  border-radius: 2px;\n  -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);\n  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);\n}\n.row.header .user > .item ul.dropdown-menu .dropdown-header {\n  text-align: center;\n}\n.row.header .user > .item ul.dropdown-menu li.link {\n  text-align: left;\n}\n.row.header .user > .item ul.dropdown-menu li.link a {\n  padding-left: 7px;\n  padding-right: 7px;\n}\n.row.header .user > .item ul.dropdown-menu:before {\n  position: absolute;\n  top: -7px;\n  right: 23px;\n  display: inline-block;\n  border-right: 7px solid transparent;\n  border-bottom: 7px solid rgba(0, 0, 0, 0.2);\n  border-left: 7px solid transparent;\n  content: '';\n}\n.row.header .user > .item ul.dropdown-menu:after {\n  position: absolute;\n  top: -6px;\n  right: 24px;\n  display: inline-block;\n  border-right: 6px solid transparent;\n  border-bottom: 6px solid #ffffff;\n  border-left: 6px solid transparent;\n  content: '';\n}\n.loading {\n  width: 40px;\n  height: 40px;\n  position: relative;\n  margin: 100px auto;\n}\n.double-bounce1,\n.double-bounce2 {\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  background-color: #333;\n  opacity: 0.6;\n  position: absolute;\n  top: 0;\n  left: 0;\n  -webkit-animation: bounce 2s infinite ease-in-out;\n  animation: bounce 2s infinite ease-in-out;\n}\n.double-bounce2 {\n  -webkit-animation-delay: -1s;\n  animation-delay: -1s;\n}\n@-webkit-keyframes bounce {\n  0%,\n  100% {\n    -webkit-transform: scale(0);\n  }\n  50% {\n    -webkit-transform: scale(1);\n  }\n}\n@keyframes bounce {\n  0%,\n  100% {\n    transform: scale(0);\n    -webkit-transform: scale(0);\n  }\n  50% {\n    transform: scale(1);\n    -webkit-transform: scale(1);\n  }\n}\n.alerts-container .alert:last-child {\n  margin-bottom: 0;\n}\n", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, "/* #592727 RED */\n/* #2f5927 GREEN */\n/* #30426a BLUE (default)*/\n/* Sidebar background color */\n/* Sidebar header and footer color */\n/* Sidebar title text colour */\n/* Sidebar menu item hover color */\n/**\n * Sidebar\n */\n#sidebar-wrapper {\n  background: #79589F;\n}\nul.sidebar .sidebar-main a,\n.sidebar-footer,\nul.sidebar .sidebar-list a:hover,\n#page-wrapper:not(.open) ul.sidebar .sidebar-title.separator {\n  /* Sidebar header and footer color */\n  background: #79589F;\n}\nul.sidebar {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  text-indent: 20px;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\nul.sidebar li a {\n  color: #fff;\n  display: block;\n  float: left;\n  text-decoration: none;\n  width: 250px;\n}\nul.sidebar .sidebar-main {\n  height: 65px;\n}\nul.sidebar .sidebar-main a {\n  font-size: 18px;\n  line-height: 60px;\n}\nul.sidebar .sidebar-main a:hover {\n  cursor: pointer;\n}\nul.sidebar .sidebar-main .menu-icon {\n  float: right;\n  font-size: 18px;\n  padding-right: 28px;\n  line-height: 60px;\n}\nul.sidebar .sidebar-title {\n  color: #738bc0;\n  font-size: 12px;\n  height: 35px;\n  line-height: 40px;\n  text-transform: uppercase;\n  transition: all .6s ease 0s;\n}\nul.sidebar .sidebar-list {\n  height: 40px;\n}\nul.sidebar .sidebar-list a {\n  text-indent: 25px;\n  font-size: 15px;\n  color: #b2bfdc;\n  line-height: 40px;\n}\nul.sidebar .sidebar-list a:hover {\n  color: #fff;\n  border-left: 3px solid #e99d1a;\n  text-indent: 22px;\n}\nul.sidebar .sidebar-list a:hover .menu-icon {\n  text-indent: 25px;\n}\nul.sidebar .sidebar-list .menu-icon {\n  float: right;\n  padding-right: 29px;\n  line-height: 40px;\n  width: 70px;\n}\n#page-wrapper:not(.open) ul.sidebar {\n  bottom: 0;\n}\n#page-wrapper:not(.open) ul.sidebar .sidebar-title {\n  display: none;\n  height: 0px;\n  text-indent: -100px;\n}\n#page-wrapper:not(.open) ul.sidebar .sidebar-title.separator {\n  display: block;\n  height: 2px;\n  margin: 13px 0;\n}\n#page-wrapper:not(.open) ul.sidebar .sidebar-list a:hover span {\n  border-left: 3px solid #e99d1a;\n  text-indent: 22px;\n}\n#page-wrapper:not(.open) .sidebar-footer {\n  display: none;\n}\n.sidebar-footer {\n  position: absolute;\n  height: 40px;\n  bottom: 0;\n  width: 100%;\n  padding: 0;\n  margin: 0;\n  transition: all .6s ease 0s;\n  text-align: center;\n}\n.sidebar-footer div a {\n  color: #b2bfdc;\n  font-size: 12px;\n  line-height: 43px;\n}\n.sidebar-footer div a:hover {\n  color: #ffffff;\n  text-decoration: none;\n}\n#page-wrapper,\n#sidebar-wrapper {\n  transition: all .4s ease 0s;\n}\n#sidebar-wrapper {\n  margin-left: -150px;\n  left: -30px;\n  width: 250px;\n  position: fixed;\n  height: 100%;\n  z-index: 999;\n}\n#page-wrapper {\n  padding-left: 0px;\n  height: 100%;\n}\n#content-wrapper {\n  padding-left: 0;\n  margin-left: 0;\n  width: 100%;\n  height: auto;\n}\n@media only screen and (min-width: 561px) {\n  #page-wrapper.open {\n    padding-left: 120px;\n  }\n}\n@media only screen and (max-width: 560px) {\n  #page-wrapper.open {\n    padding-left: 120px;\n  }\n}\n#page-wrapper.open #sidebar-wrapper {\n  left: 150px;\n}\n", ""]);

// exports


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".ace_editor {\n  height: 200px;\n}\n", ""]);

// exports


/***/ }),
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(24);
__webpack_require__(25);
__webpack_require__(26);
__webpack_require__(27);
__webpack_require__(28);
__webpack_require__(29);
__webpack_require__(30);
__webpack_require__(31);
__webpack_require__(32);


angular.module('my-angular-components', [ 'ngAnimate',
'ngSanitize',

//angular ui
'ui.ace',
'ui.bootstrap',
'ui.select',
'ngFabForm',
'ui.grid']);

__webpack_require__(33);

__webpack_require__(34);
__webpack_require__(36);
__webpack_require__(38)

__webpack_require__(40);
__webpack_require__(42);
__webpack_require__(44)
__webpack_require__(46);

__webpack_require__(48);
__webpack_require__(50);
__webpack_require__(52);
__webpack_require__(54);

__webpack_require__(55);
__webpack_require__(57);
__webpack_require__(59);
__webpack_require__(61);
__webpack_require__(63);
__webpack_require__(65);
__webpack_require__(67);

__webpack_require__(69);
__webpack_require__(71);

__webpack_require__(73);
__webpack_require__(75);
__webpack_require__(77);
__webpack_require__(79);
__webpack_require__(81);

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(3);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(3, function() {
			var newContent = __webpack_require__(3);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(4, function() {
			var newContent = __webpack_require__(4);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(5, function() {
			var newContent = __webpack_require__(5);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(6, function() {
			var newContent = __webpack_require__(6);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(7, function() {
			var newContent = __webpack_require__(7);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(8);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(8, function() {
			var newContent = __webpack_require__(8);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(9, function() {
			var newContent = __webpack_require__(9);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(10);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(10, function() {
			var newContent = __webpack_require__(10);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(11, function() {
			var newContent = __webpack_require__(11);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 33 */
/***/ (function(module, exports) {

var cssClassService =  function () {
    

     var getlabelClass = function (horizontal, labelWidth) {
            if (horizontal === "true") {
                return "control-label col-sm-" + labelWidth;
            } else {
                return "";
            }
        };

        var getInputClass = function (horizontal, inputWidth) {
            if (horizontal)
                return  "col-sm-" + inputWidth;
            else
                return "";
        };


    return {
        getlabelClass: getlabelClass,
        getInputClass: getInputClass
    };
};

angular.module("my-angular-components").factory("cssClassService", cssClassService);

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var myButton = {
    bindings: {
        id: '@',
        text: '@',
        click: '&',
        theme: '@',
        preset: '@',
        size: '@'
    },
    controllerAs: 'vm',
    controller: function ($scope) {
        var vm = this;

        vm.$onInit = function () {
            //default options
            vm.id = '';
            vm.text = '';
            vm.icon = '';
            vm.size = '';
            vm.theme = 'btn btn-success';
        };

        vm.getClass = function () {
            var cssClass = 'btn ';

            if (vm.preset !== '' & vm.text === '') {
                switch (vm.preset) {
                    case 'Create':
                        cssClass += ' btn-success ';
                        break;
                    case 'Delete':
                        cssClass += ' btn-danger '
                        break;
                    case 'Edit':
                        cssClass += ' btn-primary '
                        break;
                    default:
                        cssClass += ' btn-success '
                        break;
                }
            }
            else{
                 cssClass += ' btn-success '
            }


            return cssClass;
        }


        vm.getSizeClass = function () {
            var cssClass = 'btn ';

            if (vm.size !== '') {
                switch (vm.size) {
                    case 'Small':
                        cssClass += ' btn-sm ';
                    case 'Large':
                        cssClass += ' btn-lg ';

                }
            }

            return cssClass;
        }

        vm.getText = function () {

            if (vm.preset !== '' & vm.text === '') {
                switch (vm.preset) {
                    case 'Create':
                        return ' Create ';
                    case 'Delete':
                        return ' Delete '
                    case 'Edit':
                        return ' Edit '
                    default:
                        ''
                }
            } else {
                return vm.text;
            }
        };

        vm.getIcon = function () {

            if (vm.preset !== '' & vm.icon === '') {
                switch (vm.preset) {
                    case 'Create':
                        return ' fa fa-plus ';
                    case 'Delete':
                        return ' fa fa-times '
                    case 'Edit':
                        return ' fa fa-bars '
                    default:
                        ''
                }
            } else {
                return 'fa fa-' + vm.icon + ' ';
            }
        };

        vm.getId = function () {
            if (vm.isError === 'true')
                return "errorMessage";
            else
                return "successMessage";
        };




    },
    template : __webpack_require__(35)
};

angular.module('my-angular-components').component('myButton', myButton);


/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = "<div class='{{vm.getClass()}} {{vm.getSizeClass()}}' id='{{vm.id}}' ng-click='vm.click()'>\r\n    <!--Button Inner Text-->\r\n    {{vm.getText()}}\r\n    <!--Font Awesome Icon-->\r\n    <i style=\"margin-left:15px\" class='{{vm.getIcon()}}'></i>\r\n</div>"

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var mySpinnerButton = {
    bindings: {
        buttonText:'@',
        saving: '=',
        isDisabled:'='
    },
    controllerAs: 'vm',
    controller: function(){
        var vm = this;
      
        vm.$onInit = function () {
            //default options
            // vm.id = 'spinnerButton';
            // vm.ngModel = 'Cliock';
            // vm.icon = 'fa fa-circle-o-notch';
            // vm.cssClass = 'btn btn-success';
             vm.saving = false;
             vm.isDisabled = false;
        };       
    },
    template:__webpack_require__(37)
};


angular.module('my-angular-components').component('mySpinnerButton', mySpinnerButton);





/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = "<button id='{{vm.id}}' class=\"btn btn-success\" ng-click='vm.click()'  ng-disabled=\"vm.isDisabled\">\r\n     <!--Button Inner Text-->\r\n     {{vm.buttonText}}  \r\n      <!--Font Awesome Icon-->\r\n     <i class='fa fa-circle-o-notch fa-spin' ng-if=\"vm.saving\"></i>\r\n</div>\r\n"

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * 
 * @type {
 
  */
var myCategorySelect = {
    bindings: {
        selected: '=',
        items: '=',
        fieldName: '@',
        fieldLabel: '@',
        categoryField: '@'
    },
    controllerAs: 'vm',
    controller: function ($scope) {
        'use strict';

        var vm = this;
        vm.cats = [];
 // todo:tidy this
        vm.init = function () {
            if(vm.fieldLabel === undefined){
                vm.fieldLabel = 'Category';
            }

            if(vm.categoryField === undefined){
                vm.categoryField = 'Category';
            }
        };

       


        


        var isJson = function isJson(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        var getCats = function (tags) {

            if (isJson(tags)) {
                return angular.fromJson(tags);
            }
            else {
                return tags.split(',');
            }

        };


var buildList = function () {

            //create a temporary list for building the list
            var catsList = [];


            // loop through all the tags in the list
            angular.forEach(vm.items, function (key, value) {

                // separate out tags
                var cats = getCats(key[vm.categoryField]);
                                
                //add unique values to the temporary list
                angular.forEach(cats, function (key, value) {
                    if (catsList.indexOf(key.trim()) === -1) {
                        catsList.push(key.trim());
                    }
                });

            });

            // copy sorted list to the main category list*/
            vm.cats = catsList.sort();

            //add an All option to the first item in the list
            vm.cats.unshift('All');

            // set the default option to All
            vm.selected = 'All';
        };

        // watch for changes
        $scope.$watch('vm.items', function () {

            if (vm.items !== undefined) {
                buildList();
            }
        });


        vm.init();

    },
    template:__webpack_require__(39)
    
};

myCategorySelect.$inject = ['$scope'];

angular.module('my-angular-components').component('myCategorySelect', myCategorySelect);

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = "<div class='form-group'>\r\n    <label class='control-label' style='min-width: 110px; text-align: left'>{{vm.fieldLabel}}</label>\r\n    <select ng-model='vm.selected' class='form-control'>\r\n            <option ng-repeat='category in vm.cats'   value='{{category}}' >{{category}}</option>\r\n        </select>\r\n</div>\r\n"

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var myFilterTextbox = {
    bindings: {
        placeholder: '@',
        ngModel: '=',
        fieldName: '@'
    },
    controllerAs: 'vm',
    controller: function () {
        var vm = this;

        vm.$onInit = function () {
            vm.fieldName = 'filterTextBox';
            vm.placeholder = 'Filter';
        };


    },
    template:__webpack_require__(41)
};


angular.module('my-angular-components').component('myFilterTextbox', myFilterTextbox);


/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = "<div class='input-group' style='display: flex'>\r\n    <input type='text' ng-model='vm.ngModel' placeholder='{{vm.placeholder}}' id='{{vm.fieldName}}' class='form-control' />\r\n    <button class='btn btn-default' class='input-group-btn' id='searchFilter'> \r\n     <i class='glyphicon glyphicon-search'></i> </button>\r\n</div>"

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var myPageTitle = {
    transclude: "true",
    bindings: {
        icon: "@",
        text: "@"
    },
    controllerAs: 'vm',
    controller: function () {
        var vm = this;
        
        vm.getIcon = function() {
            console.log(vm.icon)
            return " " + vm.icon;
        };
    },
    template:__webpack_require__(43)    
};

angular.module('my-angular-components').component('myPageTitle', myPageTitle);


/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = "<H1 id='pageTitle'>\r\n    <i class=\"fa fa-users\"></i>\r\n    {{vm.text}}\r\n</H1>\r\n<hr>"

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Date field component with Field Label, Date Popup, Help Popup
 */
var myDateField = {
    bindings: {
        ngModel: '=',
        fieldName: '@',
        fieldLabel: '@',
        tooltip: '@',
        dateOptions: '@',
        helpText: '@',
        readOnly: '@',
        horizontal: '@'
    },
    controllerAs: 'vm',
    controller: function (cssClassService) {
        'use strict';
        var vm = this;
        vm.cssClassService= cssClassService;
        vm.$onInit = function () {

            //defaults
            vm.fieldLabel = "Date";
            vm.locale = 'en-GB';
            vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            vm.format = vm.formats[0];
            vm.isOpened = false;
            vm.readOnly = false;
            vm.tooltip = "";
            vm.horizontal = false;
            vm.dateOptions = {
                formatYear: 'yy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1
            };
        };



        // open the date popup
        vm.open = function () {
            vm.isOpened = true;
        };

    },
    template:__webpack_require__(45)    
};

myDateField.$inject = ['cssClassService'];

var app = angular.module('my-angular-components')
    .component('myDateField', myDateField);


/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = "<style>\r\n    .popover {\r\n        min-width: 200px;\r\n    }\r\n    \r\n    .input-group {\r\n        width: 40% !important;\r\n    }\r\n\r\n</style>\r\n<div class=\"form-group\">\r\n    <!--field label-->\r\n    <label ng-class=\"vm.cssClassService.getlabelClass(vm.horizontal, vm.labelWidth)\" for=\"vm.fieldName\">{{vm.fieldLabel}}</label>\r\n    <div ng-class=\"vm.cssClassService.getInputClass(vm.horizontal, vm.inputWidth)\">\r\n        <!--Input-->\r\n        <div ng-if=\"!vm.readOnly\" class=\"input-group\">\r\n            <!--DatePicker-->\r\n            <input type=\"text\" class=\"form-control\" uib-datepicker-popup=\"{{vm.format}}\" ng-model=\"vm.ngModel\" is-open=\"vm.isOpened\"\r\n                datepicker-options=\"vm.dateOptions\" ng-required=\"true\" close-text=\"Close\" alt-input-formats=\"altInputFormats\"\r\n            />\r\n            <!--DatePicker Open Button-->\r\n            <span class=\"input-group-btn\">\r\n                <button type=\"button\" class=\"btn btn-default\" ng-click=\"vm.open()\"><i class=\"fa fa-bars\"></i></button>\r\n            </span>\r\n            <!--ToolTip-->\r\n            <span ng-show=\"vm.tooltip!==''\" class=\"input-group-addon\" uib-popover=\"{{vm.tooltip}}\" popover-title=\"Info\" popover-class=\"popover\"\r\n                popover-trigger=\"'mouseenter'\"><i class=\"fa fa-info\"></i>\r\n            </span>\r\n        </div>\r\n        <!--Read Only display-->\r\n        <div ng-show=\"vm.readOnly\">\r\n            {{vm.ngModel | date}}\r\n        </div>\r\n        <!--HelpText-->\r\n        <p class=\"help-block\">{{vm.helpText}}</p>\r\n    </div>\r\n</div>\r\n"

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Date field component with Field Label, Date Popup, Help Popup
 */
var myDateTimeDifferenceField = {
    bindings: {
        ngModel: '=',
        fieldName: '@',
        fieldLabel: '@',
        tooltip: '@',
        dateOptions: '@',
        helpText: '@',
        readOnly: '@',
        horizontal: '@'
    },
    controllerAs: 'vm',
    controller: function () {
        'use strict';
        var vm = this;
        vm.hourStep = 1;
        vm.minStep = 15;
        vm.fromDate = new Date();
        vm.toDate = new Date();
        vm.showMeridian = true;

        vm.$onInit = function () {

        };


        vm.fromTimeChanged = function(){
            
        }

        vm.toTimeChanged = function(){

        }

    },
    template:__webpack_require__(47)        
};


angular.module('my-angular-components').component('myDateTimeDifferenceField', myDateTimeDifferenceField);


/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = "<my-input-field input-type=\"time\" field-label=\"From\"  ng-model=\"vm.fromDate\" ng-change=\"vm.fromTimeChanged()\" hour-step=\"vm.hourStep\" minute-step=\"vm.minStep\" show-meridian=\"vm.showMeridian\"></my-input-field>\r\n\r\n<my-input-field input-type=\"time\" field-label=\"To\"  ng-model=\"vm.toDate\" ng-change=\"vm.toTimeChanged()\" hour-step=\"vm.hourStep\" minute-step=\"vm.minStep\" show-meridian=\"vm.showMeridian\"></my-input-field>\r\n"

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var myInputField = {
    bindings: {

        // timePicker
        hourStep: '@',
        minStep: '@',
        showMeridian: '@',

        // common
        ngModel: '=',
        inputType: '@',
        readOnly: '@',
        horizontal: '@',
        placeholder: '@',
        required: '@',
        tooltip: '@',
        helpText: '@',
        fieldLabel: '@',
        fieldName: '@',
        labelWidth: '@',
        inputWidth: "@",
    },
    controllerAs: 'vm',
    controller: function (cssClassService) {
        var vm = this;

        vm.cssClassService = cssClassService;


        vm.$onInit = function () {

            //defaults
            if (!angular.isDefined(vm.fieldName)) {
                vm.fieldName = vm.fieldLabel.replace(" ", "").toLowerCase();
            }

            vm.inputType = 'textbox';

            vm.required = false;
            vm.horizontal = false;
            vm.labelWidth = 3;
            vm.inputWidth = 9;
            vm.readOnly = false;
            vm.horizontal = false;
            vm.tooltip = "";
            vm.placeholder = "";
            vm.helpText = "";

            //defaults
            vm.fieldLabel = "Date";
            vm.locale = 'en-GB';
            vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            vm.format = vm.formats[0];
            vm.isOpened = false;
            vm.dateOptions = {
                formatYear: 'yy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1
            };

            // Time options
            vm.hourStep = 1;
            vm.minStep = 15;           
            vm.showMeridian = true;
        };

        // open the date popup
        vm.open = function () {
            vm.isOpened = true;
        };


    },
    template:__webpack_require__(49)            
};

myInputField.$inject = ['cssClassService'];

angular.module('my-angular-components').component('myInputField', myInputField);


/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = "<style>\r\n    .popover {\r\n        min-width: 200px;\r\n    }\r\n    \r\n    .input-group {\r\n        width: 100% !important;\r\n    }\r\n    \r\n    .input-group .form-control {\r\n        z-index: 100;\r\n    }\r\n</style>\r\n<div class=\"form-group\">\r\n    <!--field label-->\r\n    <label ng-class=\"vm.cssClassService.getlabelClass(vm.horizontal, vm.labelWidth)\" for=\"vm.fieldName\">{{vm.fieldLabel}}       \r\n    </label>\r\n    <div ng-class=\"vm.cssClassService.getInputClass(vm.horizontal, vm.inputWidth)\">\r\n        <!--Input Types-->\r\n        <div ng-if=\"!vm.readOnly\" class=\"input-group\">\r\n            <!--TextBox-->\r\n            <input ng-if=\"vm.inputType==='textbox'\" ng-model=\"vm.ngModel\" type=\"text\" class=\"form-control\" id=\"{{vm.fieldName}}\" placeholder=\"{{vm.placeholder}}\"\r\n                required=\"true\">\r\n             <!--Number-->\r\n            <input  ng-if=\"vm.inputType==='number'\" ng-model=\"vm.ngModel\" type=\"number\"  class=\"form-control\" id=\"{{vm.fieldName}}\"               required=\"true\">\r\n            <!--Email-->\r\n            <input ng-if=\"vm.inputType==='email'\" type=\"email\" class=\"form-control\" id=\"vm.fieldName\" placeholder=\"{{vm.placeholder}}\">\r\n            <!--TextArea-->\r\n            <textarea ng-if=\"vm.inputType==='textarea'\" class=\"form-control\" id=\"vm.fieldName\" ng-model=\"vm.ngModel\" placeholder=\"{{vm.placeholder}}\"></textarea>\r\n            <!--CheckBox-->\r\n            <input ng-if=\"vm.inputType==='checkbox'\" type=\"checkbox\" id=\"vm.fieldName\" ng-model=\"vm.ngModel\" />\r\n            <!--Time-->\r\n            <div ng-if=\"vm.inputType==='time'\" uib-timepicker ng-model=\"vm.ngModel\"  id=\"vm.fieldName\"    ng-change=\"vm.changed()\" hour-step=\"vm.hourStep\" minute-step=\"vm.minStep\" show-meridian=\"vm.showMeridian\">\r\n            <!--Date-->\r\n            <span ng-if=\"vm.inputType==='datepopup'\">\r\n                <input type=\"text\" class=\"form-control\" uib-datepicker-popup=\"{{vm.format}}\"\r\n                 ng-model=\"vm.ngModel\" is-open=\"vm.isOpened\" style=\"width: 82%\"\r\n                datepicker-options=\"vm.dateOptions\" ng-required=\"true\" close-text=\"Close\" alt-input-formats=\"altInputFormats\">\r\n                 <span class=\"btn btn-default\" ng-click=\"vm.open()\"><i class=\"fa fa-bars\"></i></span>\r\n            </span>\r\n            <!--DatePicker Open Button-->\r\n            </span>\r\n            <span ng-show=\"vm.tooltip!==''\" class=\"input-group-addon\" uib-popover=\"{{vm.tooltip}}\" popover-title=\"Info\" popover-class=\"popover\"\r\n                popover-trigger=\"'mouseenter'\"><i class=\"fa fa-info\"></i>\r\n            </span>\r\n        </div>\r\n        <!--Read Only display-->\r\n        <div ng-show=\"vm.readOnly\">\r\n            <p ng-if=\"vm.inputType!=='checkbox'\">{{vm.ngModel}}</p>\r\n            <i ng-if=\"vm.inputType==='checkbox'\" ng-show='vm.ngModel' class='fa fa-check fa-2x'></i>\r\n        </div>\r\n        <!--HelpText-->\r\n        <p class=\"help-block\">{{vm.helpText}}</p>\r\n    </div>\r\n</div>\r\n"

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var mySelectField = {
    bindings: {
        fieldLabel: '@',
        fieldName: '@',
        labelWidth: '@',
        SelectWidth: "@",
        ngModel: '=',
        required: '@',
        tooltip: '@',
        helpText: '@',
        readOnly: '@',
        horizontal: '@',
        items: '=',
        inputType: '@',
        size: "@",
        multiSelect: "@"
    },
    controllerAs: 'vm',
    controller: function (cssClassService) {
        var vm = this;

        vm.cssClassService = cssClassService;



        vm.$onInit = function () {

            //defaults
            vm.inputType = "tags";
            vm.required = false;
            vm.horizontal = false;
            vm.labelWidth = 3;
            vm.inputWidth = 9;
            vm.readOnly = false;
            vm.horizontal = false;
            vm.tooltip = "";
            vm.placeholder = "";
            vm.helpText = "";
            vm.multiSelect = false;

        };




    },
    template:__webpack_require__(51)        
};

mySelectField.$inject = ['cssClassService'];

angular.module('my-angular-components').component('mySelectField', mySelectField);



/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = "<style>\r\n    .popover {\r\n        min-width: 200px;\r\n    }\r\n    \r\n    .input-group {\r\n        width: 100% !important;\r\n    }\r\n\r\n</style>\r\n<div class=\"form-group\">\r\n{{vm.cssClassService.getlabelClass(vm.horizontal, vm.labelWidth)}}\r\n\r\n    <!--field label-->\r\n    <label ng-class=\"vm.cssClassService.getlabelClass(vm.horizontal, vm.labelWidth)\" for=\"vm.fieldName\">{{vm.fieldLabel}}</label>\r\n    <div ng-class=\"vm.cssClassService.getInputClass(vm.horizontal, vm.inputWidth)\">\r\n        <!--Input Types-->\r\n        <div ng-if=\"!vm.readOnly\" class=\"input-group\">\r\n            <ui-select ng-if=\"vm.inputType==='tags'\" multiple ng-model=\"vm.ngModel\" theme=\"bootstrap\">\r\n                <ui-select-match placeholder=\"Select a Tag...\">{{$item.name}}</ui-select-match>\r\n                <ui-select-choices repeat=\"item in (vm.items | filter: $select.search) track by item.id\">\r\n                    <span ng-bind=\"item.name\"></span>\r\n                </ui-select-choices>\r\n            </ui-select>\r\n            <select ng-if=\"vm.inputType==='combobox'\" size=\"vm.size\" multiple=\"vm.multiSelect\" ng-model='vm.ngModel' class='form-control'\r\n                id='{{vm.fieldName}}'>\r\n                <option ng-repeat='option in vm.items' ng-value='{{option.id}}'>{{option.name}}</option>\r\n            </select>\r\n            <span ng-show=\"vm.tooltip!==''\" class=\"input-group-addon\" uib-popover=\"{{vm.tooltip}}\" popover-title=\"Info\" popover-class=\"popover\"\r\n                popover-trigger=\"'mouseenter'\"><i class=\"fa fa-info\"></i>\r\n            </span>\r\n        </div>\r\n        <!--Read Only display-->\r\n        <div ng-show=\"vm.readOnly\">\r\n            <span ng-repeat=\"tag in vm.items\" class=\"badge\">\r\n                {{tag.name}}\r\n            <span>\r\n        </div>\r\n \r\n        <!--HelpText-->\r\n        <p class=\"help-block\">{{vm.helpText}}</p>\r\n    </div>\r\n</div>\r\n\r\n"

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var myRichTextEditor = {
    bindings: {
        ngModel: '=',
    },
    controllerAs: 'vm',
    controller: function () {
        var vm = this;

        vm.options = {
            useWrapMode: true,
            showGutter: false,
            mode: 'markdown',
            firstLineNumber: 5,
        };
    },
    template:__webpack_require__(53)            
};


angular.module('my-angular-components').component('myRichTextEditor', myRichTextEditor);


/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = "<div ui-ace=\"vm.options\" ng-model=\"vm.ngModel\">\r\n</div>\r\n\r\n"

/***/ }),
/* 54 */
/***/ (function(module, exports) {

angular.module('my-angular-components').directive('markdown', function () {
    var converter = new showdown.Converter();


    var link = function (scope, element, attrs) {
        attrs.$observe('markdown', function (value) {
            var markup = converter.makeHtml(value);
            element.html(markup);
        });
    };

    return {
        restrict: 'A',
        link: link
    };
});


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var adminLayout = {
    transclude: true,
    bindings: {
        title: '@',
        theme: '@',
        sideMenuItems: '=',
        userMenuItems: '=',
        alertMenuItems: '=',
        footerLinks: '=',
        userName:'@'
    },
    controllerAs: 'vm',
    controller: function ($scope) {
        'use strict';

        var vm = this;
        vm.colapsed = false;
     

        vm.userName = "";
    
        var currentWidth = 65;
        var mobileView = 992;

        vm.getWidth = function () {
            return window.innerWidth;
        };
      

        //Css Class Helpers
        vm.getState = function () {
            if (vm.colapsed)
                return "open";
            else
                return "";
        };
        vm.getViewCssClass= function(){
            if (vm.colapsed == true)
                return "uiViewColapsed";
            else
                return "uiView";
        };
    },
    template:__webpack_require__(56)       
};

adminLayout.$inject = ['$scope'];

angular.module('my-angular-components').component('adminLayout', adminLayout);


/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = "<style>\r\n.uiViewColapsed{\r\n    margin-right:20px;\r\n    margin-left:23px;\r\n    padding-left:200px;\r\n    padding-right:10px;\r\n}\r\n.uiView{\r\n    margin-right:20px;\r\n    margin-left:2px;\r\n    padding-left:10px;\r\n    padding-right:15px;\r\n}\r\n</style>\r\n<div id=\"page-wrapper\" ng-cloak ng-class=\"vm.getState()\">\r\n    <!-- Sidebar -->\r\n    <div id=\"sidebar-wrapper\">\r\n        <admin-side-menu colapsed=\"vm.colapsed\" footer-links=\"vm.footerLinks\" side-menu-items=\"vm.sideMenuItems\"></admin-side-menu>\r\n    </div>\r\n    <div id=\"content-wrapper\">\r\n        <div class=\"page-content\">\r\n           \r\n            <admin-header-bar title=\"Timebanking\" alert-menu-items=\"vm.alertMenuItems\" user-menu-items=\"vm.userMenuItems\" user-name=\"{{vm.userName}}\">\r\n            </admin-header-bar> \r\n\r\n            <div ng-class=\"vm.getViewCssClass()\">\r\n                <ng-transclude></ng-transclude>\r\n            </div>\r\n            \r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var alertsDropDownMenu = {
    bindings: {
        menuItems:'=',
    },
    controllerAs: 'vm',
    template:__webpack_require__(58)       
};


angular.module('my-angular-components').component('alertsDropDownMenu', alertsDropDownMenu);


/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = "<div class=\"item dropdown\" uib-dropdown>\r\n    <a href=\"#\" class=\"dropdown-toggle\" uib-dropdown-toggle>\r\n        <i class=\"fa fa-bell\"></i>\r\n    </a>\r\n    <ul class=\"dropdown-menu dropdown-menu-right\">\r\n        <li class=\"dropdown-header\">\r\n            Alerts\r\n        </li>\r\n        <li class=\"divider\"></li>\r\n        <li ng-repeat=\"item in vm.menuItems\">\r\n            <div class=\"row\">\r\n                <i class=\"fa fa-{{item.icon}} col-md-3\" style=\"margin:0\"></i>\r\n                <a ui-sref=\"{{item.state}}\" class=\"col-md-8\">                \r\n                    {{item.linkText}}  \r\n                </a>\r\n            </div>\r\n        </li>\r\n    </ul>\r\n</div>\r\n"

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var adminHeaderBar = {
    transclude: true,
    bindings: {
        title: '@',
        theme: '@',
        userMenuItems: "=",
        alertMenuItems: "=",
        userName: '@'
    },
    controllerAs: 'vm',
    template:__webpack_require__(60)           
};


angular.module('my-angular-components').component('adminHeaderBar', adminHeaderBar);

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = "<style>\r\n.uiViewColapsed{\r\n    margin-left:10px;\r\n}\r\n.uiView{\r\n    margin-left:120px;\r\n}\r\n</style>\r\n<div class=\"row header\">\r\n    <div class=\"col-xs-12\">\r\n        <div class=\"user pull-right\">\r\n            <div class=\"item dropdown\" uib-dropdown>\r\n                <user-options-drop-down-menu menu-items=\"vm.userMenuItems\" user-name=\"{{vm.userName}}\"></user-options-drop-down-menu>\r\n            </div>-->\r\n            <!-- <!--<div class=\"item dropdown\" uib-dropdown>\r\n                <alerts-drop-down-menu menu-items=\"vm.alertMenuItems\"></alerts-drop-down-menu>\r\n            </div> -->\r\n        </div>\r\n        <div class=\"meta\">\r\n            <div class=\"page\">\r\n                {{vm.title}}\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var userOptionsDropDownMenu = {
    bindings: {
        menuItems:'=',
        userName: '@'
    },
    controllerAs: 'vm',
    controller: function () {
        'use strict';

        var vm = this;
        
       

    },
    template:__webpack_require__(62)           
};


angular.module('my-angular-components').component('userOptionsDropDownMenu', userOptionsDropDownMenu);


/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = "<div class=\"item dropdown\" uib-dropdown>\r\n    <a href=\"#\" class=\"dropdown-toggle\" uib-dropdown-toggle>\r\n        <i class=\"fa fa-user\"></i>\r\n    </a>\r\n    <ul class=\"dropdown-menu dropdown-menu-right\">\r\n        <li class=\"dropdown-header\">\r\n            {{vm.userName}}\r\n        </li>\r\n        <li class=\"divider\"></li>\r\n        <li ng-repeat=\"item in vm.menuItems\">\r\n            <div class=\"row\">\r\n                <i class=\"fa fa-{{item.icon}} col-md-3\" style=\"margin:0\"></i>\r\n                <a ui-sref=\"{{item.state}}\" class=\"col-md-8\">                \r\n                    {{item.linkText}}  \r\n                </a>\r\n            </div>\r\n        </li>\r\n    </ul>\r\n</div>\r\n"

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var adminSideMenu = {
    transclude: true,
    bindings: {
        colapsed: '=',
        sideMenuItems:'=',
        footerLinks: '='
    },
    controllerAs: 'vm',
    controller: function () {
        'use strict';

        var vm = this;
        
        vm.$onInit = function () {
            vm.colapsed = true;
        };

        vm.toggleSidebar = function () {
            vm.colapsed = !vm.colapsed;
            //todo: Add to local storage
            // $cookieStore.put('toggle', $scope.toggle);
        };

    },
    template:__webpack_require__(64)       
};


angular.module('my-angular-components').component('adminSideMenu', adminSideMenu);


/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = "<ul class=\"sidebar\">\r\n    <li class=\"sidebar-main\">\r\n        <a ng-click=\"vm.toggleSidebar()\">\r\n            Dashboard\r\n            <span class=\"fa fa-switch\"></span>\r\n          </a>\r\n    </li>\r\n    <admin-side-menu-items menu-items=\"vm.sideMenuItems\"></admin-side-menu-items>\r\n</ul>\r\n<side-menu-footer links=\"vm.footerLinks\"></side-menu-footer>\r\n"

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var sideMenuFooter = {
    bindings: {
        links: '='
    },
    controllerAs: 'vm',
    template:__webpack_require__(66)       
};


angular.module('my-angular-components').component('sideMenuFooter', sideMenuFooter);


/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = "<div class=\"sidebar-footer\">\r\n    <div class=\"col-xs-4\">\r\n        <a state=\"vm.links[0].state\" >\r\n            {{vm.links[0].linkText}}\r\n          </a>\r\n    </div>\r\n    <div class=\"col-xs-4\">\r\n        <a state=\"vm.links[1].state\" >\r\n            {{vm.links[1].linkText}}\r\n          </a>\r\n    </div>\r\n    <div class=\"col-xs-4\">\r\n         <a state=\"vm.links[2].state\" >\r\n            {{vm.links[2].linkText}}\r\n          </a>\r\n    </div>\r\n</div>"

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var adminSideMenuItems = {
    bindings: {
        menuItems: '='
    },
    controllerAs: 'vm',
    controller: function ($rootScope) {
        var vm = this;

        vm.isAuthenticated = $rootScope.isAuthenticated;

        vm.showItem = function (item) {
            if (item.requiresLogin) {
                if (vm.isAuthenticated) {
                    return true;
                }
            } else
                return true;

        };
    },
    template:__webpack_require__(68)          
};

adminSideMenuItems.$inject = ['$rootScope'];

angular.module('my-angular-components').component('adminSideMenuItems', adminSideMenuItems);


/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = "<li class=\"sidebar-list\" ng-repeat=\"item in vm.menuItems\">\r\n    <a ui-sref=\"{{item.state}}\" ng-if=\"vm.showItem(item)\">{{item.linkText}}\r\n        <span class=\"menu-icon fa fa-{{item.icon}}\"></span>\r\n    </a>\r\n</li>"

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var myModalButtons = {
    bindings: {
        save: '&',
        close: '&',
        saveText: '@',
        saveVisible: '@',
        closeVisible: '@',
    },
    controllerAs: 'vm',
    controller: function () {
        var vm = this;

        vm.$onInit = function () {
            //defaults        
            vm.saveText = 'Save';

            if(!angular.isDefined(vm.closeText) && vm.closeText != ''){
                vm.closeText = 'Close';
            }
            

            vm.saveVisible = true;
            vm.closeVisible = true;
        };

    },
    template:__webpack_require__(70)          
};

angular.module('my-angular-components').component('myModalButtons', myModalButtons);


/***/ }),
/* 70 */
/***/ (function(module, exports) {

module.exports = "<div class='modal-footer'>\r\n    <span>\r\n    <!--Save Button-->\r\n    <button class='btn btn-primary btn-large pull-left'\r\n            ng-if='vm.saveVisible'\r\n            id='save'\r\n            ng-click='vm.save()'\r\n            type='submit'>{{vm.saveText}}</button>\r\n    <!--Close Button-->\r\n    <button class='btn btn-default pull-left'\r\n            ng-if='vm.closeVisible'\r\n            id='close'\r\n            ng-click='vm.close()'\r\n            type='button'>{{vm.closeText}}</button>\r\n  </span>\r\n</div>\r\n"

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

//Todo: Allow customize header size
var myModalHeader = {
    bindings: {
        id: '@',
        title: '@'
    },
    controllerAs: 'vm',
    controller: function () {
        var vm = this;

        vm.$onInit = function () {
            //defaults
            vm.title = 'Set this text using the title property';
            vm.id = 'modalHeader';
        };


    },
    template:__webpack_require__(72)    
};


var app = angular.module('my-angular-components').component('myModalHeader', myModalHeader);


/***/ }),
/* 72 */
/***/ (function(module, exports) {

module.exports = "<div class='modal-header' id='vm.id'>\r\n    <h3 class='modal-title'>{{vm.title}}</h3>\r\n</div>\r\n"

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var myInfoPanel = {
    bindings: {
        infoText: '@',
        icon: '@',
        color: '@'
    },
    controllerAs: 'vm',
    controller: function () {
        var vm = this;

        vm.$onInit = function () {
            //deafults
            vm.ngModel = "Set this Text using ngModel";
            vm.icon = 'fa fa-info fa-2x ';
            vm.color = '#FFFFF';
        };

        vm.getIcon = function () {
            return "fa fa-info "
        }

        //TODO: Improve this
        vm.getStyle = function () {
            return ' border-left: 5px solid #64518A;' +
                ' border-radius: 0 15px 15px 0; !important; ' +
                ' padding: 1rem 1rem;   !important; ' +
                ' background: ' + vm.color + ' !important;' +
                ' font-size: 1.65rem; !important; margin: 0;  !important; ' +
                ' color: ' + vm.color + ' !important;';
        };

        
    },
    template:__webpack_require__(74)  
};


angular.module('my-angular-components').component('myInfoPanel', myInfoPanel);


/***/ }),
/* 74 */
/***/ (function(module, exports) {

module.exports = "<div class='well' style=\"{{vm.getStyle()}}\">\r\n    <i class='vm.getIcon()'></i> {{vm.infoText}}\r\n    <ul class='on-page-nav'></ul>\r\n</div>\r\n"

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var myMoreLessButton = {
    bindings: {
        id: '@',
        buttonText: '@',
        click: '&',
        cssClass: '@',
        isCollapsed: '='
    },
    controllerAs: 'vm',
    controller: function () {
        'use strict';
        var vm = this;


        vm.$onInit = function () {
            //defaults
            vm.buttonText = 'More Search Options';
        };


        vm.getButtonText = function () {
            if (vm.isCollapsed) {
                return 'More Search Options';
            } else {
                return 'Fewer Search Options';
            }
        };

        vm.getButtonIcon = function () {
            if (vm.isCollapsed) {
                return 'fa fa-arrow-down';
            } else {
                return 'fa fa-arrow-up';
            }
        };
    },
    template:__webpack_require__(76)      
};

angular.module('my-angular-components').component('myMoreLessButton', myMoreLessButton);


/***/ }),
/* 76 */
/***/ (function(module, exports) {

module.exports = "<button type='button' class='{{vm.cssClass}' id=\"{{vm.id}}\" ng-click='vm.isCollapsed = !vm.isCollapsed'>\r\n<!--icon -->\r\n<i ng-class='vm.getButtonIcon()' aria-hidden='true'></i>\r\n<!--button text-->\r\n{{vm.getButtonText() }} \r\n</button>\r\n"

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var myMorelessPanel = {
    transclude: true,
    bindings: {
        isCollapsed: '@',
        buttonText: '@',
        expandButtonText: '@',
        collapseButtonText: '@'
    },
    controllerAs: 'vm',
    controller: function () {
        'use strict';

        var vm = this;

        vm.$onInit = function () {
            vm.buttonText = '';
            vm.isCollapsed = true;
            vm.collapseButtonText = "Less";
            vm.expandButtonText = "More";
        };


        //TODO: Allow chaning of Button text
        vm.getButtonText = function () {
            if (vm.isCollapsed) {
                return vm.expandButtonText;
            } else {
                return vm.collapseButtonText;
            }
        };

        //TODO: Allow changing of icon;
        vm.getButtonIcon = function () {
            if (vm.isCollapsed) {
                return 'fa fa-arrow-down';
            } else {
                return 'fa fa-arrow-up';
            }
        };



        // TODO: don't like this tidy
        // Returs a constructed style
        vm.getPanelStyle = function () {
            return 'overflow-y: ' + vm.getScrollBarVisibility(vm.showVerticalScrollBar);
        };

        vm.getPanelHeadingStyle = function () {
            if (vm.smallHeading !== undefined) {
                return 'padding: 3px 5px !important; ';
            }
            return 'padding: 10px 15px';
        };

        vm.getPanelContentStyle = function () {
            return 'overflow-y: auto;';
        };


        vm.getScrollBarVisibility = function (showVerticalScrollBar) {
            if (showVerticalScrollBar) {
                return 'scroll';
            } else {
                return 'hidden';
            }
        };

        //TODO: allow customization here
        vm.getButtonStyle = function () {
            if (vm.smallHeading !== undefined) {
                return 'margin-left: 5px; padding: 3px;';
            }
            return 'margin-left: 5px; padding: 10px;';
        };



    },
    template:__webpack_require__(78)      
};


angular.module('my-angular-components').component("myMorelessPanel", myMorelessPanel);


/***/ }),
/* 78 */
/***/ (function(module, exports) {

module.exports = "<div uib-collapse=\"vm.isCollapsed\">\r\n    <div class='panel-body' ng-transclude></div>\r\n</div>\r\n<button type=\"button\" class=\"btn btn-default\" ng-click=\"vm.isCollapsed = !vm.isCollapsed\">{{vm.getButtonText()}}</button>\r\n"

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var myPanel = {
    transclude: true,
    bindings: {
        title: '@',
        fieldName: '@',
        theme: '@',
        icon: '@',
        iconSize: '@',
        smallHeading: '@',
        showAddButton: '@',
        showEditButton: '@',
        addButtonId: '@',
        editButtonId: '@',
        add: '&',
        edit: '&',
        showFooter: '@',
        footerLeftLabel: '@',
        footerRightLabel: '@',
        height: '@',
        showVerticalScrollBar: '@'
    },
    controllerAs: 'vm',
    controller: function () {
        'use strict';

        var vm = this;
        

         vm.$onInit = function() {
             vm.height = 150;
            vm.showVerticalScrollBar = false;
            vm.showAddButton = false;
            vm.showEditButton = false;
            vm.editButtonId = 'panelEditButton';
            vm.addButtonId = 'panelAddButton';
            vm.showFooter = false;
            vm.footerLeftLabel = '';
            vm.footerRightLabel = '';
            vm.theme = "success";
        };

        
     


        vm.getPanelStyle = function () {

            //var s = 'overflow-y: ' + vm.getScrollBarVisibility(vm.showVerticalScrollBar) ;
          //  console.log(s);
            
            return ''//overflow-y: ' + vm.getScrollBarVisibility(vm.showVerticalScrollBar) ;
            
        };
        
        vm.getPanelHeadingStyle = function () {
           if (vm.smallHeading !== undefined) {
                return ''//  'padding: 3px 5px !important; ';
            }
            return '' // 'padding: 10px 15px';
        };

        vm.getPanelContentStyle = function () {
            return ''//overflow-y: auto;';
        };

        
        vm.getScrollBarVisibility = function (showVerticalScrollBar) {
            if(showVerticalScrollBar){
                return 'scroll';
            }
            else {
                return 'hidden';
            }
        };

        vm.getButtonStyle = function () {
            if (vm.smallHeading !== undefined) {
                return '';
            }
            return '';
        };


    },
    template:__webpack_require__(80)      
};


angular.module('my-angular-components').component('myPanel', myPanel);

/***/ }),
/* 80 */
/***/ (function(module, exports) {

module.exports = "<div class='panel panel-{{vm.theme}}' ng-style='{{vm.getPanelStyle()}}'>\r\n    <!--Header-->\r\n    <div class='panel-heading' ng-style='{{vm.getPanelHeadingStyle()}}' id='{{vm.fieldName}}'><i class='fa fa-glyphicon glyphicon-plus'></i>\r\n        <!--Title-->\r\n        <span style='padding-left: 10px; font-weight: 700' ng-style='{{vm.getTitleStyle()}}'>{{vm.title}}</span>\r\n        <!--Add BUtton-->\r\n        <div ng-show='vm.showAddButton' id='{{vm.addButtonId}}' ng-click='vm.add()' ng-style='{{vm.getButtonStyle()}}' class='btn btn-default pull-right'\r\n            style='padding: 3px;'><i class='glyphicon glyphicon-plus'></i> </div>\r\n        <!--Edit BUtton-->\r\n        <div ng-show='vm.showEditButton' id='{{vm.editButtonId}}' ng-click='vm.edit()' ng-style='{{vm.getButtonStyle()}}' class='btn btn-default pull-right'\r\n            style='padding: 3px;'><i class='glyphicon glyphicon-plus'></i> </div>\r\n    </div>\r\n    <!--Content-->\r\n    <div class='panel-body' ng-transclude ng-style='{{vm.getPanelContentStyle()}}'></div>\r\n    <!--Footer-->\r\n    <div class='panel-footer' ng-if='vm.showFooter' ng-style='{{vm.getPanelStyle()}}'>\r\n        <div class='row'>\r\n            <div class='col-md-6'><span class='pull-left'>{{vm.footerLeftLabel}}</span></div>\r\n            <div class='col-md-6'><span class='pull-right'>{{vm.footerRightLabel}}</span></div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var myStatusAlert = {
    bindings: {
           successMessage: "@",
        errorMessage: "@",
        message: "@",
        isError: "@"
    },
    controllerAs: 'vm',
    controller: function () {
        var vm = this;


        vm.$onInit = function () {
            vm.errorMessage = "";
            vm.successMessage = "";
            vm.isError = false;
        };


        vm.getMessage = function () {
            return vm.message;           
        };

        vm.getClass = function () {
            if (vm.isError === 'true')
                return " errorMessage";
            else
                return " successMessage";
        };

        vm.getIcon = function () {
            if (vm.isError === 'true')
                return " fa fa-warning fa-2x";
            else
                return " fa fa-check fa-2x";
        };

        vm.getId = function () {
            if (vm.isError === 'true')
                return "errorMessage";
            else
                return "successMessage";
        };
       


    },
    template:__webpack_require__(82)      
};


angular.module('my-angular-components').component('myStatusAlert', myStatusAlert);


/***/ }),
/* 82 */
/***/ (function(module, exports) {

module.exports = "<div class=\"{{vm.getClass()}}\" >\r\n    \r\n    <div>\r\n        <i class='{{vm.getIcon()}}'></i>\r\n         {{vm.getMessage()}}\r\n        <div style=\"font-size:0.9em\">qwewqe</div>\r\n    </div>\r\n</div>\r\n"

/***/ })
/******/ ]);