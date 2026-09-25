import json
import os
import urllib.request
import urllib.parse

def main():
    os.makedirs('public/assets', exist_ok=True)
    os.makedirs('public/audio', exist_ok=True)

    with open('template_nodes.json') as f:
        nodes = json.load(f)

    with open('template_meta.json') as f:
        meta = json.load(f)

    # Collect asset URLs
    assets = set()
    for nid, data in nodes.items():
        props = data.get('props', {})
        for k, v in props.items():
            if isinstance(v, str):
                if any(ext in v.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif']):
                    assets.add(v)
                elif 'templates/' in v or 'resources/' in v:
                    assets.add(v)

    # Add audio
    audio_key = meta.get('audioKey')
    if audio_key:
        assets.add(audio_key)

    # Add long thumbnail and thumbnail
    if meta.get('thumbnail'):
        assets.add(meta['thumbnail'])

    # Add map pin
    assets.add('https://cdn.cinelove.me/images/map-pin-heart-dreamy.jpg')

    print(f"Total assets to download: {len(assets)}")

    download_map = {}

    for item in sorted(assets):
        # Clean query parameters for filename
        clean_item = item.split('?')[0]
        filename = os.path.basename(clean_item)
        if not filename:
            continue

        if item.endswith('.mp3') or 'mp3/' in item:
            dest = os.path.join('public/audio', filename)
            local_url = f"/audio/{filename}"
        else:
            dest = os.path.join('public/assets', filename)
            local_url = f"/assets/{filename}"

        download_map[item] = local_url

        if os.path.exists(dest) and os.path.getsize(dest) > 0:
            print(f"Already exists: {dest}")
            continue

        # Form full URL
        if item.startswith('http'):
            full_url = item
        else:
            full_url = f"https://cdn.cinelove.me/{item.lstrip('/')}"

        print(f"Downloading {full_url} -> {dest}")
        try:
            req = urllib.request.Request(full_url, headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
            })
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
                with open(dest, 'wb') as out_f:
                    out_f.write(data)
            print(f"  Saved ({len(data)} bytes)")
        except Exception as e:
            print(f"  Error downloading {full_url}: {e}")

    with open('public/assets_manifest.json', 'w') as mf:
        json.dump(download_map, mf, indent=2)

    print("Asset download completed! Manifest saved to public/assets_manifest.json")

if __name__ == '__main__':
    main()
