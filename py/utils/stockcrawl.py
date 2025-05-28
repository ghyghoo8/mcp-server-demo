import requests,json,timeit,os,logging

# 配置logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def load_all_quote_symbol():
    """
    从新浪财经API加载所有股票代码和名称。
    """
    logging.info("load_all_quote_symbol start...")
    start_time = timeit.default_timer()
    all_quotes = []
    all_quotes_url = 'http://money.finance.sina.com.cn/d/api/openapi_proxy.php'
    count = 1
    try:
        while count < 100:
            para_val = f'[["hq","hs_a","",0,{count},500]]'
            r_params = {'__s': para_val}
            try:
                r = requests.get(all_quotes_url, params=r_params, timeout=10)  # 添加超时
                r.raise_for_status()  # 检查HTTP请求是否成功
                data = r.json()
            except (requests.exceptions.RequestException, json.JSONDecodeError) as e:
                logging.error(f"请求或解析JSON失败: {e}")
                break

            if not data or not data[0]['items']:
                logging.info("没有更多数据，退出循环。")
                break

            for item in data[0]['items']:
                code = item[0]
                name = item[2]

                # 转换股票代码
                # if 'sh' in code:
                #     code = code[2:] + '.SS'
                # elif 'sz' in code:
                #     code = code[2:] + '.SZ'

                quote = {'Symbol': code, 'Name': name}
                all_quotes.append(quote)

            count += 1

    except Exception as e:
        logging.error(f"加载股票代码时发生错误: {e}")

    end_time = timeit.default_timer()
    time_cost = round(end_time - start_time, 2)
    logging.info(f"load_all_quote_symbol end... time cost: {time_cost}s")
    logging.info(f"total {len(all_quotes)} quotes are loaded...")
    return all_quotes

def data_export(export_path, all_quotes, file_name):
    """
    将股票数据导出到JSON文件。
    """
    logging.info("data_export start...")
    start_time = timeit.default_timer()

    if not os.path.exists(export_path):
        os.makedirs(export_path)
        logging.info(f"创建目录: {export_path}")

    if not all_quotes:
        logging.warning("没有数据导出。")
        return

    file_path = os.path.join(export_path, f'{file_name}.json')
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(all_quotes, f, ensure_ascii=False, indent=4)  # 使用indent使JSON更易读
        logging.info(f"成功导出数据到: {file_path}")
    except IOError as e:
        logging.error(f"导出到JSON文件时发生错误: {e}")

    end_time = timeit.default_timer()
    time_cost = round(end_time - start_time, 2)
    logging.info(f"export is complete... time cost: {time_cost}s")

if __name__ == '__main__':
    all_quotes = load_all_quote_symbol()
    export_path = os.path.join(os.path.expanduser('.'), 'tmp', 'stock_export')
    data_export(export_path, all_quotes, file_name='result')