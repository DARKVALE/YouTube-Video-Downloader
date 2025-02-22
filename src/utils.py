import re
from pathlib import Path
from typing import Optional
import validators
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TaskProgressColumn

console = Console()

def sanitize_filename(filename: str) -> str:
    """Remove invalid characters from filename."""
    # Remove invalid characters
    pattern = r'[<>:"/\\|?*]'
    sanitized = re.sub(pattern, '', filename)
    # Limit length
    return sanitized[:255]

def validate_url(url: str) -> bool:
    """Validate YouTube URL."""
    return bool(validators.url(url) and 'youtube.com' in url or 'youtu.be' in url)

def create_progress() -> Progress:
    """Create a rich progress bar."""
    return Progress(
        SpinnerColumn(),
        TextColumn("[bold blue]{task.description}"),
        BarColumn(),
        TaskProgressColumn(),
        "[bold]{task.fields[size]}",
    )

def format_size(bytes: int) -> str:
    """Format file size in human readable format."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes < 1024:
            return f"{bytes:.1f}{unit}"
        bytes /= 1024
    return f"{bytes:.1f}TB"

def ensure_dir(path: Path) -> None:
    """Ensure directory exists."""
    path.mkdir(parents=True, exist_ok=True)
