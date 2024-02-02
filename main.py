from fastapi import FastAPI, HTTPException,Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ValidationError
from typing import Any
import sqlite3
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

class Word(BaseModel):
    player: str

def db_connection(database_name):
    try:
        conn = sqlite3.connect(database_name)
        return conn
    except sqlite3.Error as e:
        print(e)
        return None

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#ログイン
@app.post("/signin/email={email}&key={key}&name={name}", response_model=Any)
def register_user(key,name,email:str):
    conn = db_connection("logindata.db")
    cursor = conn.cursor()

    cursor.execute("SELECT email FROM logindata WHERE email=?", (email,))
    existing_email = cursor.fetchone()

    if existing_email:
        raise HTTPException(status_code=400, detail="メール存在しました")

    cursor.execute("SELECT MAX(user_id) FROM logindata")
    existing_userid = cursor.fetchone()[0]

    if existing_userid is not None:
        user_id = existing_userid + 1
    else:
        user_id = 1

    cursor.execute("INSERT INTO logindata (name, email, key, user_id) VALUES (?, ?, ?, ?)", (name, email, key, user_id))
    conn.commit()

    return {"message": "申請完了"}


@app.get("/login/authenticate", response_model=Any)
def authenticate_user(email: str, key: str):
    conn = db_connection("logindata.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM logindata WHERE email=? AND key=?", (email, key))
    data = cursor.fetchone()

    if data is not None:
        return {"detail": "Success"}
    else:
        raise HTTPException(status_code=401, detail="Invalid email or password")


from datetime import datetime
@app.patch("/calories/email={email}&key={key}&calories={calories}", response_model=dict)
def update_or_insert_calory(email: str, key: str, calories: str):
    conn = db_connection("logindata.db")
    cursor = conn.cursor()

    cursor.execute("SELECT user_id FROM logindata WHERE email=? AND key=?", (email, key))
    user_id = cursor.fetchone()

    if user_id is None:
        raise HTTPException(status_code=404, detail="User not found")

    user_id = user_id[0]

    date = datetime.now().strftime("%Y-%m-%d")

    cursor.execute("SELECT calories FROM calories WHERE date=? AND id=?", (date, user_id))
    existing_calories = cursor.fetchone()

    if existing_calories is not None:
        existing_calories = existing_calories[0]
        new_calories = existing_calories + int(calories)
        cursor.execute("UPDATE calories SET calories=? WHERE date=? AND id=?", (new_calories, date, user_id))
    else:
        cursor.execute("INSERT INTO calories (date, id, calories) VALUES (?, ?, ?)", (date, user_id, calories))

    conn.commit()
    return {"message":"カロリ計算完了"}


@app.get("/calories/getall/")
def getall_calory(email: str = Query(...,),
                  key: str = Query(...,)):
    conn = db_connection("logindata.db")
    cursor = conn.cursor()

    
    cursor.execute("SELECT user_id FROM logindata WHERE email=? AND key=?", (email, key))
    user_id = cursor.fetchone()[0]

    
    cursor.execute("SELECT * FROM calories WHERE id=?", (user_id,))
    data = cursor.fetchall()
    
    result = [{
        "date": row[0],
        "user_id": row[1],
        "calories": row[2]
    } for row in data]

    return JSONResponse(content=result)




