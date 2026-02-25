import os
import re
import urllib.parse

# Path to the project
project_path = r"c:\Users\ThinkPad\AppData\Local\Temp\antigravity-scratch\muhammadfaza16.github.io"
# Wait, I should use the absolute path from the workspace info
project_path = r"c:\Users\ThinkPad\.gemini\antigravity\scratch\muhammadfaza16.github.io"

audio_dir = os.path.join(project_path, "public", "audio")
audio_context_path = os.path.join(project_path, "src", "components", "AudioContext.tsx")

# List files in public/audio
files = os.listdir(audio_dir)
files_set = set(files)

# Extract PLAYLIST from AudioContext.tsx
with open(audio_context_path, "r", encoding="utf-8") as f:
    content = f.read()

# Match patterns like: { title: "...", audioUrl: "/audio/..." }
pattern = re.compile(r'audioUrl:\s*"/audio/(.*?)"\s*}')
matches = pattern.findall(content)

print(f"Checking {len(matches)} songs from PLAYLIST...")

missing = []
for match in matches:
    # URL decode the filename
    decoded_name = urllib.parse.unquote(match)
    if decoded_name not in files_set:
        missing.append((match, decoded_name))

if missing:
    print(f"Found {len(missing)} missing files:")
    for m in missing:
        print(f"  URL: {m[0]}")
        print(f"  Expected Filename: {m[1]}")
else:
    print("All files in PLAYLIST exist in public/audio.")
