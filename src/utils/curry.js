export default function curry(fn) {
    return function f1(a) {
        if (arguments.length === 0) {
            return this;
        } else {
            return fn.apply(this, arguments);
        }
    };
}