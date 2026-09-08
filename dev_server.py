#!/usr/bin/env python3
"""Static development server with a lightweight live-reload endpoint."""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse
import json

ROOT = Path(__file__).resolve().parent
WATCHED_SUFFIXES = {".html", ".css", ".js", ".svg", ".jpg", ".jpeg", ".png", ".mov", ".mp4"}


def build_version():
    files = [path for path in ROOT.rglob("*") if path.is_file() and path.suffix.lower() in WATCHED_SUFFIXES]
    return {
        "latest": max((path.stat().st_mtime_ns for path in files), default=0),
        "count": len(files),
        "size": sum(path.stat().st_size for path in files),
    }


class LiveReloadHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        if urlparse(self.path).path == "/__reload":
            body = json.dumps(build_version()).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 4174), LiveReloadHandler)
    print("Live preview running at http://127.0.0.1:4174/", flush=True)
    server.serve_forever()
