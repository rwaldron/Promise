import Moon = "dep/moonunit.js";
import APlus = "aplus/main.js";
import Promise from "../src/Promise.js";

new Moon
.Runner()
.inject({ Promise })
.run({
    
    "A+ Tests": APlus.tests
    
});
