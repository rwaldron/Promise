"use strict";

export var tests = {

    "should be asynchronous for already-fulfilled promises" (test, done) {
    
        var ticks = 0;
        
        process.nextTick(() => { ++ticks });

        test.Promise.when(null).then(val => {
        
            test.assert(ticks > 0);
            done();
        });  
    },
    
    "should be asynchronous for already-rejected promises" (test, done) {
    
        var ticks = 0;
        
        process.nextTick(() => { ++ticks });

        test.Promise.failure().then(null, err => {
        
            test.assert(ticks > 0);
            done();
        });
    },
    
    "should be asynchronous for eventually-fulfilled promises" (test, done) {
    
        var ticks = 0;
        
        process.nextTick(() => { ++ticks });

        var tuple = new test.Promise;
        
        tuple.future.then(val => {
        
            test.assert(ticks > 0);
            done();
        });

        tuple.resolve(null);
    },
    
    "should be asynchronous for eventually-rejected promises" (test, done) {
    
        var ticks = 0;
        
        process.nextTick(() => { ++ticks });

        var tuple = new test.Promise;
        
        tuple.future.then(null, err => {
        
            test.assert(ticks > 0);
            done();
        });

        tuple.reject();
    }
    
};

