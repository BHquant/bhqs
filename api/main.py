from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://bhqs.app", "http://localhost:3000"],
    allow_origin_regex=r"https://.*\.vercel\.app",  # allow any Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
