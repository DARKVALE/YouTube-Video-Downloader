from pytube import YouTube
from pathlib import Path
import re
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TaskProgressColumn

console = Console()

class YouTubeDownloader:
    def __init__(self):
        # Create downloads directories
        self.downloads_dir = Path("downloads")
        self.video_dir = self.downloads_dir / "video"
        self.audio_dir = self.downloads_dir / "audio"
        self.video_dir.mkdir(parents=True, exist_ok=True)
        self.audio_dir.mkdir(parents=True, exist_ok=True)

    def create_progress(self):
        return Progress(
            SpinnerColumn(),
            TextColumn("[bold blue]{task.description}"),
            BarColumn(),
            TaskProgressColumn(),
            "[bold]{task.fields[size]}",
            console=console
        )

    def format_size(self, bytes: int) -> str:
        """Format file size in human readable format."""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if bytes < 1024:
                return f"{bytes:.1f}{unit}"
            bytes /= 1024
        return f"{bytes:.1f}TB"

    def sanitize_filename(self, filename: str) -> str:
        """Remove invalid characters from filename."""
        pattern = r'[<>:"/\\|?*]'
        return re.sub(pattern, '', filename)

    def validate_url(self, url: str) -> bool:
        """Validate if the URL is a valid YouTube URL."""
        return 'youtube.com' in url or 'youtu.be' in url

    def on_progress(self, stream, chunk: bytes, bytes_remaining: int, progress_bar):
        """Update download progress."""
        total_size = stream.filesize
        bytes_downloaded = total_size - bytes_remaining
        progress_bar.update(
            task_id=None,
            completed=bytes_downloaded,
            total=total_size,
            size=self.format_size(total_size)
        )

    def download(self, url: str, format_type: str = 'video', quality: str = 'high'):
        """Download YouTube video or audio."""
        try:
            if not self.validate_url(url):
                console.print("[red]Error: Invalid YouTube URL[/red]")
                return

            with self.create_progress() as progress:
                # Create a progress bar
                task_id = progress.add_task("[cyan]Initializing...", total=None, size="0B")

                # Initialize YouTube object with progress callback
                yt = YouTube(
                    url,
                    on_progress_callback=lambda stream, chunk, bytes_remaining: 
                        self.on_progress(stream, chunk, bytes_remaining, progress),
                    use_oauth=False  # Disable OAuth
                )

                progress.update(task_id, description=f"[cyan]Fetching available streams...")

                # Select appropriate stream
                if format_type == 'audio':
                    # Get highest bitrate audio
                    stream = yt.streams.filter(only_audio=True).order_by('abr').desc().first()
                    output_path = self.audio_dir
                else:
                    if quality == 'high':
                        # Try to get highest quality progressive stream
                        stream = yt.streams.filter(
                            progressive=True,
                            file_extension='mp4'
                        ).order_by('resolution').desc().first()
                    else:
                        # Get lower quality stream
                        stream = yt.streams.filter(
                            progressive=True,
                            file_extension='mp4'
                        ).order_by('resolution').first()
                    output_path = self.video_dir

                if not stream:
                    console.print("[red]Error: No suitable streams found[/red]")
                    return

                # Show stream details
                if format_type == 'video':
                    console.print(f"[blue]Selected Stream: {stream.resolution} - {stream.mime_type}[/blue]")
                else:
                    console.print(f"[blue]Selected Stream: {stream.abr} - {stream.mime_type}[/blue]")

                # Update progress description
                progress.update(task_id, description=f"[cyan]Downloading: {yt.title}")

                # Download the stream
                file_path = stream.download(output_path=output_path)

                console.print(f"\n[green]Successfully downloaded:[/green] {yt.title}")
                console.print(f"[blue]Format:[/blue] {format_type}")
                console.print(f"[blue]Quality:[/blue] {quality}")
                console.print(f"[blue]Saved to:[/blue] {file_path}")

        except Exception as e:
            console.print(f"[red]Error: {str(e)}[/red]")
            console.print("[yellow]Tips:[/yellow]")
            console.print("1. Check if the video is available")
            console.print("2. Try a different video")
            console.print("3. Verify your internet connection")

def main():
    console.print("[bold blue]=== YouTube Downloader ===[/bold blue]\n")
    
    while True:
        # Get URL
        url = console.input("[yellow]Enter YouTube URL (or 'q' to quit):[/yellow] ")
        if url.lower() == 'q':
            break

        # Get format preference
        console.print("\n[yellow]Choose format:[/yellow]")
        console.print("1. Video")
        console.print("2. Audio only")
        format_choice = console.input("[yellow]Enter choice (1 or 2):[/yellow] ")
        format_type = 'video' if format_choice == '1' else 'audio'

        # Get quality preference if video format
        quality = 'high'
        if format_type == 'video':
            console.print("\n[yellow]Choose quality:[/yellow]")
            console.print("1. High")
            console.print("2. Low")
            quality_choice = console.input("[yellow]Enter choice (1 or 2):[/yellow] ")
            quality = 'high' if quality_choice == '1' else 'low'

        # Create downloader and start download
        downloader = YouTubeDownloader()
        downloader.download(url, format_type, quality)
        
        console.print("\n[bold blue]-------------------[/bold blue]\n")

if __name__ == "__main__":
    main()