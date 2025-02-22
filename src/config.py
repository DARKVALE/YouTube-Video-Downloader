from pydantic import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    # Base paths
    BASE_DIR: Path = Path(__file__).parent.parent
    DOWNLOAD_DIR: Path = BASE_DIR / 'downloads'
    VIDEO_DIR: Path = DOWNLOAD_DIR / 'video'
    AUDIO_DIR: Path = DOWNLOAD_DIR / 'audio'
    
    # Download settings
    DEFAULT_FORMAT: str = 'video'
    DEFAULT_QUALITY: str = 'high'
    MAX_RETRIES: int = 3
    TIMEOUT: int = 30
    
    # File patterns
    INVALID_CHARS: str = '<>:"/\\|?*'
    
    class Config:
        case_sensitive = False

settings = Settings()
