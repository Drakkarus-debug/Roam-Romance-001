from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os, logging, uuid, jwt, bcrypt
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

JWT_SECRET = os.environ.get('JWT_SECRET', 'roam-romance-secret-key-2026')
JWT_ALGORITHM = 'HS256'

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# --- Models ---
class UserRegister(BaseModel):
    email: str
    password: str
    name: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = None
    race: Optional[str] = None
    reason: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    interests: Optional[List[str]] = None
    drinking: Optional[str] = None
    smokes: Optional[str] = None
    exercise: Optional[str] = None
    education: Optional[str] = None
    hasPets: Optional[str] = None
    hasKids: Optional[str] = None
    criminalRecord: Optional[str] = None
    weightKg: Optional[str] = None
    weightLbs: Optional[str] = None
    photos: Optional[List[str]] = None
    isProfileComplete: Optional[bool] = None

class SwipeAction(BaseModel):
    targetUserId: str
    direction: str  # 'left' or 'right'

# --- Helpers ---
def create_token(user_id: str, email: str):
    payload = {'user_id': user_id, 'email': email, 'exp': datetime.now(timezone.utc) + timedelta(days=30)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def verify_password(pw: str, hashed: str) -> bool:
    return bcrypt.checkpw(pw.encode(), hashed.encode())

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(401, 'Not authenticated')
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({'id': payload['user_id']}, {'_id': 0})
        if not user:
            raise HTTPException(401, 'User not found')
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, 'Token expired')
    except jwt.InvalidTokenError:
        raise HTTPException(401, 'Invalid token')

# --- Auth Routes ---
@api_router.post("/auth/register")
async def register(data: UserRegister):
    existing = await db.users.find_one({'email': data.email})
    if existing:
        raise HTTPException(400, 'Email already registered')
    user_id = str(uuid.uuid4())
    user = {
        'id': user_id, 'email': data.email, 'password': hash_password(data.password),
        'name': data.name or '', 'subscription': 'free', 'likesRemaining': 5,
        'isProfileComplete': False, 'createdAt': datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user)
    token = create_token(user_id, data.email)
    return {'token': token, 'user': {k: v for k, v in user.items() if k not in ('password', '_id')}}

@api_router.post("/auth/login")
async def login(data: UserLogin):
    user = await db.users.find_one({'email': data.email}, {'_id': 0})
    if not user or not verify_password(data.password, user['password']):
        raise HTTPException(401, 'Invalid credentials')
    token = create_token(user['id'], user['email'])
    return {'token': token, 'user': {k: v for k, v in user.items() if k != 'password'}}

@api_router.get("/auth/me")
async def get_me(user=Depends(get_current_user)):
    return {k: v for k, v in user.items() if k != 'password'}

# --- Profile Routes ---
@api_router.put("/profile")
async def update_profile(data: ProfileUpdate, user=Depends(get_current_user)):
    updates = {k: v for k, v in data.model_dump().items() if v is not None}
    if updates:
        await db.users.update_one({'id': user['id']}, {'$set': updates})
    updated = await db.users.find_one({'id': user['id']}, {'_id': 0, 'password': 0})
    return updated

@api_router.get("/profiles/discover")
async def discover_profiles(user=Depends(get_current_user)):
    swiped = await db.swipes.find({'userId': user['id']}, {'_id': 0}).to_list(1000)
    swiped_ids = {s['targetUserId'] for s in swiped}
    swiped_ids.add(user['id'])
    profiles = await db.users.find(
        {'id': {'$nin': list(swiped_ids)}, 'isProfileComplete': True},
        {'_id': 0, 'password': 0}
    ).to_list(50)
    return profiles

# --- Swipe & Match Routes ---
@api_router.post("/swipe")
async def swipe(data: SwipeAction, user=Depends(get_current_user)):
    swipe_doc = {
        'id': str(uuid.uuid4()), 'userId': user['id'], 'targetUserId': data.targetUserId,
        'direction': data.direction, 'createdAt': datetime.now(timezone.utc).isoformat()
    }
    await db.swipes.insert_one(swipe_doc)
    
    is_match = False
    if data.direction == 'right':
        mutual = await db.swipes.find_one({
            'userId': data.targetUserId, 'targetUserId': user['id'], 'direction': 'right'
        })
        if mutual:
            match_doc = {
                'id': str(uuid.uuid4()),
                'users': sorted([user['id'], data.targetUserId]),
                'createdAt': datetime.now(timezone.utc).isoformat()
            }
            existing_match = await db.matches.find_one({'users': match_doc['users']})
            if not existing_match:
                await db.matches.insert_one(match_doc)
            is_match = True
    return {'match': is_match}

@api_router.get("/matches")
async def get_matches(user=Depends(get_current_user)):
    matches = await db.matches.find({'users': user['id']}, {'_id': 0}).to_list(100)
    result = []
    for match in matches:
        other_id = [u for u in match['users'] if u != user['id']][0]
        other_user = await db.users.find_one({'id': other_id}, {'_id': 0, 'password': 0})
        if other_user:
            result.append({'matchId': match['id'], 'user': other_user, 'createdAt': match['createdAt']})
    return result

# --- Subscription Routes ---
@api_router.get("/subscriptions")
async def get_subscriptions():
    return [
        {'id': 'plus', 'name': 'Roam Plus', 'price': 1.99, 'features': ['feature1','feature2','feature3','feature4','feature5','feature6','feature7']},
        {'id': 'gold', 'name': 'Roam Gold', 'price': 10.99, 'popular': True, 'features': ['feature8','feature9','feature10','feature11','feature12','feature13']},
        {'id': 'platinum', 'name': 'Roam Platinum', 'price': 20.99, 'features': ['feature14','feature15','feature16','feature17','feature18','feature19']},
    ]

@api_router.post("/subscribe/{plan_id}")
async def subscribe(plan_id: str, user=Depends(get_current_user)):
    valid = {'plus', 'gold', 'platinum'}
    if plan_id not in valid:
        raise HTTPException(400, 'Invalid plan')
    await db.users.update_one({'id': user['id']}, {'$set': {'subscription': plan_id, 'likesRemaining': -1}})
    return {'success': True, 'plan': plan_id}

@api_router.get("/")
async def root():
    return {"message": "Roam Romance API"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
