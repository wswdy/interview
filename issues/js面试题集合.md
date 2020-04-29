面试题

###### 1.js基本数据类型？常见的假值？
- 基本数据类型：Number、String、Boolean、Object、Null、undefined、Symbol
- js假值：Null、NaN、undefined、0、false、''

********************
###### 2.for in 、for of 、forEach有什么区别？
- for in遍历的是数组的索引（即键名）并且会把数组的可枚举属性全部遍历，更适合遍历对象；
- for of遍历的是数组元素值，适用遍历数/数组对象/字符串/map/set等拥有迭代器对象的集合，可以正确响应break、continue和return语句；
- forEach遍历数组的话，使用break不能中断循环，使用return也不能返回到外层函数。

********************
###### 3.map遍历时修改数组第一个元素对象值后，会得到什么？原数组是否会改变?
- map接受三个参数，map(item, index, arr)，在遍历的时候通过arr[index]修改元素的值，则对应的原数组也会发生变化。

********************
###### 4.reduce方法简介，这个方法的第一个参数是什么？
arr.reduce( callbak, [initValue] ) </br>
1. 第一个参数为回调函数，该函数最后要使用return，给出返回值。</br>
callback接受4个参数：初始值（或者上一次回调函数的返回值），当前元素值，当前索引，抵用reduce的数组。
2. initValue，第一次调用callback的第一个参数。 

**用法：**

- 数组求和、乘积：
```
var arr = [1, 2, 3, 4];
var sum = arr.reduce( (prev, cur) => prev + cur, 0);
var mul = arr.reduce( (prev, cur) => prev * cur, 0 );
```

- 计算数组红每个元素出现的次数：
```
const arr = [1, 2, 3, 4, 1, 1];
const times = arr.reduce( (prev, cur) => {
	if (cur in prev) {
		prev[cur] ++;
	} else {
		prev[cur] = 1;
	}
	return prev;
}, {});
// 输出times为{ 1:3, 2:1, 3:1, 4:1 }
```

- 数组去重
```
const arr = [1, 2, 3, 4, 1, 1];
const newArr = arr.reduce( (prev, cur) => {
    if (prev.includes(cur)) {
        return prev;
    } else {
        retutn [...prev, cur];
        // prev.push(cur);
    }
    return prev;
}, []);
// 输出newArr为[1, 2, 3, 4]
```

