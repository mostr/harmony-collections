var tap = require("tap");
var test = tap.test;
var WM;
var map;
var secrets = ['secrets'];

var methods = ['get', 'set', 'has', 'delete'];

test('load', function(t){
  t.ok(WM = require('../').WeakMap, 'WeakMap loaded');
  t.similar(Object.getOwnPropertyNames(WM.prototype).sort(), [
    'constructor','delete','get', 'has','set','toString'
  ], 'has all expected prototype properties');
  t.same(WM.name, 'WeakMap', 'check name');
  t.same(WM+'', 'function WeakMap() { [native code] }', 'check toString');
  t.same(WM.prototype+'', '[object WeakMap]', 'check brand');

  t.end();
});


test('basic usage', function(t){
  t.ok(map = new WM, 'create instance');
  t.same(Object.getPrototypeOf(map), WM.prototype, 'instance of WeakMap.prototype');
  t.similar(Object.getOwnPropertyNames(map), [], 'no observable properties on the instance');
  t.same(map.get(WM), undefined, 'retreiving non-existant key returns undefined');
  t.same(map.set(WM, secrets), secrets, 'set works and returns given val');
  t.same(map.get(WM), secrets, 'retreiving works');
  t.same(map.set(WM, 'overwrite'), 'overwrite', 'primitive value set works');
  t.same(map.get(WM), 'overwrite', 'overwriting works');
  t.same(map.has(WM), true, 'has returns true');
  t.same(map.delete(WM), true, 'delete returns true');
  t.same(map.has(WM), false, 'has returns false');
  t.same(map.get(WM), undefined, 'retreiving deleted item returns undefined');
  t.end();
});

test('errors', function(t){
  methods.forEach(function(method){
    t.throws(function(){ map[method]('string', secrets) }, 'primitive key in '+method+' throws');
    t.throws(function(){ map[method].call({}, {}) }, 'using '+method+' on a non-weakmap throws');
  });
  t.end();
});


function MemoryReading(name, time){
  this.name = name;
  this.timing = process.hrtime(time);
  this.time = Date.now();
  var reading = process.memoryUsage();
  this.rss = reading.rss;
  this.total = reading.heapTotal;
  this.used = reading.heapUsed;
}

var reading = MemoryReading.reading = function(readings){
  return function reading(name){
    if (name in readings) {
      var result = readings[name].compare(new MemoryReading(name + '-end'));
      delete readings[name];
      return result;
    } else {
      readings[name] = new MemoryReading(name);
    }
  }
}({});

MemoryReading.prototype = {
  constructor: MemoryReading,
  compare: function compare(other){
    if (other.time > this.time) {
      var first = this;
      var last = other;
    } else {
      var first = other;
      var last = this;
    }
    return {
      start: forst,
      end: last,
      timespan: last.time - first.time,
      rss: first.rss - last.rss,
      total: first.total - last.total,
      used: first.total - last.total
    }
  }
};

test('garbage collection', function(t){
  console.log(process.memoryUsage())
  t.end();
});

// test('reif