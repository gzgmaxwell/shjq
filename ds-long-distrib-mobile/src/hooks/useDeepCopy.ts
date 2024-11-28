/**
 * 对象深拷贝
 * @param data 传入对象
 * @param hash 内部递归使用，外部调用不需要传入
 * @returns 被深拷贝的对象
 */
export const useDeepCopy = (data: any, hash = new WeakMap()) => {
  if (typeof data !== 'object' || data === null) {
    throw new TypeError('The incoming parameter is not an object')
  }
  // 判断传入的待拷贝对象的引用是否存在于hash中
  if (hash.has(data)) {
    return hash.get(data)
  }
  const newData: any = {}
  const dataKeys = Object.keys(data)
  dataKeys.forEach(value => {
    const currentDataValue = data[value]
    // 基本数据类型的值和函数直接赋值拷贝
    if (typeof currentDataValue !== 'object' || currentDataValue === null) {
      newData[value] = currentDataValue
    } else if (Array.isArray(currentDataValue)) {
      // 实现数组的深拷贝
      newData[value] = [...currentDataValue]
    } else if (currentDataValue instanceof Set) {
      // 实现set数据的深拷贝
      newData[value] = new Set([...currentDataValue])
    } else if (currentDataValue instanceof Map) {
      // 实现map数据的深拷贝
      newData[value] = new Map([...currentDataValue])
    } else {
      // 将这个待拷贝对象的引用存于hash中
      hash.set(data, data)
      // 普通对象则递归赋值
      newData[value] = useDeepCopy(currentDataValue, hash)
    }
  })
  return newData
}
