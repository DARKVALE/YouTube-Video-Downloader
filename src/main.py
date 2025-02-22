import typer
from typing import Optional
from enum import Enum
from rich.console import Console
from .downloader import YouTubeDownloader
from .utils import validate_url

app = typer.Typer(help="Advanced YouTube Downloader")
console = Console()

class Format(str, Enum):
    video = "video"
    audio = "audio"

class Quality(str, Enum):
    high = "high"
    medium = "medium"
    low = "low"

@app.command()
def download(
    url: str = typer.Argument(..., help="YouTube video URL"),
    format_type: Format = typer.Option(Format.video, "--format", "-f", help="Download format"),
    quality: Quality = typer.Option(Quality.high, "--quality", "-q", help="Download quality")
):
    """Download video or audio from YouTube."""
    if not validate_url(url):
        console.print("[red]Error: Invalid YouTube URL[/red]")
        raise typer.Exit(1)
    
    downloader = YouTubeDownloader()
    result = downloader.download(url, format_type=format_type.value, quality=quality.value)
    
    if result['status'] == 'success':
        console.print(f"\n[green]Successfully downloaded:[/green] {result['title']}")
        console.print(f"[blue]Format:[/blue] {result['format']}")
        console.print(f"[blue]Quality:[/blue] {result['quality']}")
        console.print(f"[blue]Saved to:[/blue] {result['path']}")
    else:
        console.print(f"[red]Download failed: {result['error']}[/red]")
        raise typer.Exit(1)

if __name__ == "__main__":
    app()
