from fastapi import FastAPI
from pydantic import BaseModel
from typing import Union
import datetime; 

from  Ashare import *

class Params(BaseModel):
    frequency: str
    count: int
    end_date: Union[str, None] = datetime.datetime.now().strftime('%Y-%m-%d')

app = FastAPI()

@app.post("/query/{code}")
def query_code(code:str, query: Params):
    df=get_price(code, frequency=query.frequency, count=query.count, end_date=query.end_date) 
    data = df.to_dict(orient="records")
    return { "code": 200, "data": data }

@app.get("/")
def read_root():
  return {"code": 200 }