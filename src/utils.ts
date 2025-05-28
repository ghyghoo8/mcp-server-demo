import { stocks } from "stock-api";


type StockItem  = Record<string,string>


async function getCodes(key: string) {
  try {
    const res = await stocks.tencent.searchStocks(key) as StockItem[];
    console.log('use tencent success')
    return res
  } catch (e) {
    console.log('use tencent fail')
    const res1 = await stocks.netease.searchStocks(key) as StockItem[];
    console.log('use netease success')
    return res1
  }
}


// 获取股票组实时数据
export async function searchStocks(searchKey: string) {
  try {
    const res = await getCodes(searchKey)
    const code = res.filter(d => ['SH', 'SZ','XSHG'].includes(d.code.replaceAll(/[0-9]/ig, ''))).map(d => d.code)
    // 取第一个code
    return code[0].toLowerCase()
  } catch (e) {
    console.log('use netease fail')
  }
}

