/* 
 促销商品三种情况：
 满100减30，满200减80，8折
 */

/* 
 简单的if else实现
 缺点：
 1.priceCalculate 函数随着折扣类型的增多，if-else 判断语句会变得越来越臃肿；
 2.如果增加了新的折扣类型或者折扣类型的算法有所改变，那么需要更改 priceCalculate 函数的实现，这是违反开放-封闭原则的；
 3.可复用性差，如果在其他的地方也有类似这样的算法，但规则不一样，上述代码不能复用。
 */
function priceCalculate(type, price) {
	if (type === 'minus100_30') {
		return price - Math.floor(price / 100) * 30
	}
	if (type === 'minus200_80') {
		return price - Math.floor(price / 200) * 80
	}
	if (type === 'percent80') {
		return price * 0.8
	}
}


/* 通过对象的键值索引调用具体的算法 */
const DiscountMap = {
	minus100_30: function(price) {
		return price - Math.floor(price / 100) * 30
	},
	minus200_80: function(price) {
		return price - Math.floor(price / 200) * 80
	},
	percent80: function(price) {
		return price * 0.8
	}
}
// 新增促销活动
DiscountMap.minus150_40 = function(price) {
	price - Math.floor(price / 150) * 40
}
function priceCalculate2(type, price) {
	return DiscountMap[type](price)
}


/* 使用闭包，使方法更便于扩展 */
const PriceCalculate = (function () {
	// 售价计算方式
	const DiscountMap = {
		minus100_30: function(price) {
			return price - Math.floor(price / 100) * 30
		},
		minus200_80: function(price) { 
			return price - Math.floor(price / 200) * 80
		},
		percent80: function(price) {
			return price * 0.8
		}
	}
	
	return {
		priceCal: function(type, price) {
			return DiscountMap[type](price)
		},
		// 注册新的促销
		addStrategy: function(type, fn) {
			if (DiscountMap[type]) return
			DiscountMap[type] = fn
		}
	}
})()
PriceCalculate.priceCal('minus100_30', 150)
// 新增促销
PriceCalculate.addStrategy('minus150_40', function(price) {
	return price - Math.floor(price / 150) - 40
})


/* 策略模式的通用实现 */
/* 
之前上面的方法，折扣计算方式可以被认为是策略(Strategy)，这些策略直接可以相互替代，
具体折扣的计算过程可以被认为是封装上下文(Context)，封装上下文可以根据需要选择不同的策略。
1.Context：封装上下文，根据需要调用需要的策略，屏蔽外界对策略的直接调用，只对外提供一个接口，
根据需要调用对应策略；
2.Strategy：策略，含具体的算法，其方法的外观相同，因此可以相互代替；
3.StrategyMap：所有策略的合集，供封装上下文调用。
 */
const StrategyMap = {}

function context(type, ...res) {
	return StrategyMap[type](...res)
}
StrategyMap.minus100_30 = function(price) {
	return price - Math.floor(price / 100) * 30
}

context('minus100_30', 270) // 210