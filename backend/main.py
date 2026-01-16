from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers.users import router as user_router
from routers.inventory import router as inventory_router
from routers.reports import router as report_router
from routers.order import router as order_router


load_dotenv()

app = FastAPI(
    title="Restaurant Inventory & Waste Management",
    description="A simple full-stack Restaurant Inventory & Waste Management System for Leanring purpose.",
    version="0.1.0",   
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def root_router():
    return "The app is Running! 🚀"

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(user_router)
app.include_router(inventory_router)
app.include_router(report_router)
app.include_router(order_router)