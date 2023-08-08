// let arr = [{
//         id: 1,
//         name: '张三'
//     },
//     {
//         id: 2,
//         name: '李四'
//     }
// ]
// let id = 2;
// console.log(arr.find(item => item.id === id));

/* const a = Object.prototype.toString;
console.log(Object.toString(111));
console.log(a.call(Object)); */

/* let a;
let b = null;
let c = undefined;
const d = [];
const e = {};
if ({}) {
    console.log('undefined和null的布尔值是false,[]和{}是true');
    console.log(d, e, b, a);
    console.log(typeof a); //数组对象null会被认为是object
} */

// //深浅拷贝
// let attr = [{ name: '张三', age: 21, code: [1, 2, 3] }, { name: '李四', age: 1 }]
// let newAttr = { name: '', age: '', code: [] }
//     //这里newAttr浅拷贝了attr[0],如果对newAttr中的code数组进行修改,则attr的数组也会被修改，从而导致bug
//     //因此使用json完成深拷贝,不能直接用attr[0]
// Object.assign(newAttr, JSON.parse(JSON.stringify(attr[0])));
// //以上输出 { name: '张三', age: 21, gender: '' }
// newAttr.code[0] = 111
// console.log(newAttr);
// console.log(attr);
// //使用json解决

// let attr = [{ name: 'zz', age: 1 }]
// let a = JSON.parse(JSON.stringify(attr));
// console.log(a);

//传参   如果不传参则默认传递2
// const pass = (num = 2) => {
//     console.log(num);
// }
// pass(3);

//map属性
// let arr = [{ uname: '张三', upwd: 122 }, { uname: '李四', upwd: 222 }]
// let newArr = arr.map(item => {
//     return {
//         name: item.uname
//     }
// })
// console.log(newArr);

//数组操作 slice不会改变原本的数组  用于截取数组的某一段
// let arr = ['s', 'daw', 'sss', 'tt', 'ytr'];
// let str = 'dawdawddeee'
//按要求划分split

// console.log(str.split('d'));
// console.log(arr.slice(1, 3));
// console.log(arr);
//splice删除从某个节点开始的数组,从0开始,删除1个,会改变原有数组,返回被删除的数组
// console.log(arr.splice(0, 1));
// console.log(arr);

//数组的过滤  不改变原数组
// console.log(arr.filter(item => {
//     return item == 's';
// }));
// console.log(arr);

//every返回布尔类型的值,不改变原数组  若有任何一项不满足，停止操作，返回false
// console.log(arr.every(item => {
//     return item != 'sx'
// }));


// if ('') {
//     console.log(11);
// }

// let arr = ['daw', 'ww', 'ji', 'ni', '12'];
let obj = [{ name: 'jack', country: 'japan', like: 'game' }, { name: 'rose', country: 'usa', like: 'game' }]
const yourName = obj.map(item => {
    return item.name;
})
console.log(yourName);