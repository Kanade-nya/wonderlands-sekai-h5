const props  = {
    a: 1,
    b: 2,
    c: 3,
}

const {a,...rest} = props;

function test(prop1,...restProps){
    console.log('has prop1')
    return restProps
}

console.log(test(1,2,3,4,5))



console.log(rest)
console.log(a)