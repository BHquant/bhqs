from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse
import pandas as pd, io
from datetime import datetime

app = FastAPI(title="BHQS API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://bhqs.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    ticker: str

class AnalyzeResponse(BaseModel):
    prob_up: float
    prob_flat: float
    prob_down: float
    price_target_pct: float
    model_version: str

@app.post('/analyze', response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest):
    seed = sum(map(ord, req.ticker.upper()))
    up = (seed % 41) + 40
    flat = max(5, 100 - up - ((seed % 21) + 5))
    down = 100 - up - flat
    pt = (seed % 15) - 7
    return {"prob_up": up, "prob_flat": flat, "prob_down": down, "price_target_pct": pt, "model_version": "demo-0.1"}

@app.get('/export/trades.xlsx')
async def export_trades():
    df = pd.DataFrame([{"ticker":"TSLA","decision":"buy","submitted_at": datetime.utcnow()}])
    buf = io.BytesIO()
    with pd.ExcelWriter(buf, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False)
    buf.seek(0)
    return StreamingResponse(buf, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        headers={"Content-Disposition":"attachment; filename=trades.xlsx"})
