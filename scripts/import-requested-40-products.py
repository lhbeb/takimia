#!/usr/bin/env python3
"""Import the requested 16 coffee products plus 24 Zimgoody best sellers."""

from __future__ import annotations

import hashlib
import html
import json
import mimetypes
import os
import re
import sys
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup


SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
BUCKET = "product-images"
IMPORT_TAG = "requested-import-2026-09-16"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

EXPLICIT_URLS = [
    "https://www.bestbuy.com/product/ninja-luxe-cafe-mini-espresso-machine-drip-coffee-maker-with-built-in-grinder-manual-steam-wand-black/JXJVXLXK68/sku/6681798",
    "https://www.target.com/p/mr-coffee-5c-programmable-drip-coffee-maker-black/-/A-91863921",
    "https://www.cuisinart.com/14-cup-programmable-coffee-maker/DCC-3200NAS.html",
    "https://www.williams-sonoma.com/products/delonghi-all-in-one-combination-coffee-maker-2/",
    "https://us.moccamaster.com/products/kbgt",
    "https://www.williams-sonoma.com/products/jura-z10-gen-2-fully-automatic-espresso-machine/",
    "https://shopjura.com/giga-10-diamond-black-naa.html",
    "https://www.wayfair.com/JURA--JURA-E6-Fully-Automatic-Coffee-and-Espresso-Machine-15-L914-K~IDDL1036.html",
    "https://cowsarofficial.com/products/20-bar-super-fully-automatic-coffee-machine-with-grinder",
    "https://vitcher.com/product/jura-z10-automatic-coffee-machines-2/",
    "https://vitcher.com/product/delonghi-la-specialista-arte-evo-espresso-machine-compact-cold-brew-coffee-maker-with-grinder-milk-steam-wand-frother-tamping-tools-home-barista-kit-for-lattes-cap/",
    "https://vitcher.com/product/jura-j8-twin-automatic-coffee-machines/",
    "https://vitcher.com/product/delonghi-la-specialista-opera-espresso-machine-with-cold-brews/",
    "https://vitcher.com/product/delonghi-magnifica-evo-automatic-espresso-coffee-machine-with-auto-milk-frother-built-in-grinder-auto-clean-function-for-latte-cappuccinos-americano-iced-coffee-eca/",
    "https://vitcher.com/product/fully-automatic-coffee-espresso-machines-with-steaming-wand-black/",
    "https://vitcher.com/product/delonghi-magnifica-start-automatic-espresso-machine-with-manual-milk-frother-built-in-grinder-3-one-touch-recipes-easy-to-clean-home-barista-coffee-maker-for-lattes-cappucc/",
]

# Verified fallbacks are used only when a retailer blocks automated page access.
FALLBACKS = {
    "6681798": {
        "title": "Ninja Luxe Café Mini Espresso Machine & Drip Coffee Maker with Built-in Grinder",
        "price": 449.99,
        "brand": "Ninja",
        "description": (
            "A compact espresso and drip coffee system with a built-in conical burr grinder, "
            "integrated scale and manual steam wand. Barista Assist adjusts grind size, dose, "
            "temperature and pressure, while classic, rich and over-ice modes cover hot and iced coffee."
        ),
        "images": ["https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6681/6681798_sd.jpg"],
    },
    "delonghi-all-in-one-combination-coffee-maker-2": {
        "title": "De'Longhi All-in-One Combination Coffee Maker",
        "price": 269.95,
        "brand": "De'Longhi",
        "description": (
            "Combination coffee and espresso machine designed to brew drip coffee and authentic espresso "
            "from one compact appliance. Includes a steam wand for cappuccino and latte drinks and a "
            "programmable drip-coffee side for everyday pots."
        ),
        "images": ["https://pisces.bbystatic.com/prescaled/500/500/image2/BestBuy_US/images/products/fdb82184-7430-4a86-8a6f-ffa37ca632a4.jpg"],
    },
    "jura-z10-gen-2-fully-automatic-espresso-machine": {
        "title": "JURA Z10 Gen 2 Fully Automatic Espresso Machine with Cold Brew",
        "price": 4499.95,
        "brand": "JURA",
        "description": (
            "A premium fully automatic coffee system for hot and cold specialties. It combines precision "
            "grinding, automated milk preparation, guided touchscreen operation and programmable drink settings."
        ),
        "images": ["https://assets.wsimgs.com/wsimgs/rk/images/dp/wcm/202628/0470/img1z.jpg"],
    },
    "IDDL1036": {
        "title": "JURA E6 Fully Automatic Coffee and Espresso Machine",
        "price": 1799.00,
        "brand": "JURA",
        "description": (
            "A fully automatic bean-to-cup machine with one-touch coffee preparation, an integrated grinder, "
            "milk-frothing support and guided cleaning programs for convenient daily use."
        ),
    },
    "91863921": {
        "title": "Mr. Coffee 5-Cup Programmable Coffee Maker",
        "price": 24.99,
        "brand": "Mr. Coffee",
        "description": (
            "A compact programmable drip coffee maker that brews up to 25 fluid ounces. Brew Later scheduling, "
            "Grab-a-Cup Auto Pause, an easy-view water window and two-hour automatic shutoff make it practical "
            "for apartments, offices and smaller kitchens."
        ),
        "images": ["https://target.scene7.com/is/image/Target/GUEST_0053cc62-705b-494d-952b-9de6219bc0fd"],
    },
    "giga-10-diamond-black-naa": {
        "title": "JURA GIGA 10 Automatic Coffee Machine — Diamond Black",
        "price": 5499.00,
        "brand": "JURA",
        "description": (
            "A premium automatic coffee machine with two bean containers, two ceramic disc grinders and a "
            "6.7-inch Panorama Coffee Panel. It prepares 35 hot and cold specialties, supports extensive drink "
            "customization, and includes Wi-Fi connectivity and one-touch milk-system cleaning."
        ),
        "images": ["https://fr.jura.com/-/media/global/images/home-products/giga-line/giga-10/image-gallery/giga_10_diamond_black_ea_image1.jpg"],
    },
}


def slugify(value: str) -> str:
    value = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return value[:100]


def clean_text(value: object) -> str:
    if value is None:
        return ""
    soup = BeautifulSoup(html.unescape(str(value)), "html.parser")
    return re.sub(r"\s+", " ", soup.get_text(" ", strip=True)).strip()


def iter_json(value: object):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from iter_json(child)
    elif isinstance(value, list):
        for child in value:
            yield from iter_json(child)


def product_jsonld(soup: BeautifulSoup) -> dict:
    candidates = []
    for tag in soup.select('script[type="application/ld+json"]'):
        try:
            payload = json.loads(tag.string or tag.get_text())
        except Exception:
            continue
        for item in iter_json(payload):
            item_type = item.get("@type")
            types = item_type if isinstance(item_type, list) else [item_type]
            if "Product" in types or "ProductGroup" in types:
                candidates.append(item)
    return max(candidates, key=lambda item: len(str(item)), default={})


def normalize_images(value: object, page_url: str) -> list[str]:
    if isinstance(value, str):
        values = [value]
    elif isinstance(value, dict):
        values = [value.get("url") or value.get("contentUrl")]
    elif isinstance(value, list):
        values = []
        for item in value:
            if isinstance(item, str):
                values.append(item)
            elif isinstance(item, dict):
                values.append(item.get("url") or item.get("contentUrl"))
    else:
        values = []
    result = []
    for value in values:
        if not value:
            continue
        url = urljoin(page_url, value).replace("http://", "https://")
        if url not in result and url.startswith("https://"):
            result.append(url)
    return result


def offer_price(offers: object) -> float | None:
    entries = offers if isinstance(offers, list) else [offers]
    prices = []
    for offer in entries:
        if not isinstance(offer, dict):
            continue
        value = offer.get("price") or offer.get("lowPrice") or offer.get("highPrice")
        try:
            prices.append(float(str(value).replace(",", "").replace("$", "")))
        except (TypeError, ValueError):
            pass
    return min(prices) if prices else None


def meta_content(soup: BeautifulSoup, *selectors: str) -> str:
    for selector in selectors:
        tag = soup.select_one(selector)
        if tag and tag.get("content"):
            return tag["content"].strip()
    return ""


def detect_brand(title: str, product: dict) -> str:
    brand = product.get("brand")
    if isinstance(brand, dict):
        brand = brand.get("name")
    if brand:
        return clean_text(brand)
    known = ["De'Longhi", "JURA", "Ninja", "Mr. Coffee", "Cuisinart", "Moccamaster", "Cowsar", "Cub Cadet", "EGO", "Backyard Discovery"]
    return next((name for name in known if name.lower() in title.lower()), title.split()[0])


def fallback_for(url: str) -> dict:
    return next((value for key, value in FALLBACKS.items() if key in url), {})


def scrape_product(url: str) -> dict:
    fallback = fallback_for(url)
    soup = BeautifulSoup("", "html.parser")
    try:
        response = requests.get(url, headers=HEADERS, timeout=35)
        if response.ok:
            response.encoding = "utf-8"
            soup = BeautifulSoup(response.text, "html.parser")
    except requests.RequestException:
        pass

    product = product_jsonld(soup)
    title = clean_text(product.get("name")) or meta_content(soup, 'meta[property="og:title"]') or fallback.get("title", "")
    title = re.sub(r"\s*[-|–]\s*(Vitcher LLC|Zimgoody|Best Buy|Target|Cuisinart).*$", "", title, flags=re.I).strip()
    description = clean_text(product.get("description")) or meta_content(soup, 'meta[name="description"]', 'meta[property="og:description"]') or fallback.get("description", "")
    price = offer_price(product.get("offers")) or fallback.get("price")
    images = normalize_images(product.get("image"), url)
    if not images:
        images = normalize_images(meta_content(soup, 'meta[property="og:image"]'), url)
    images.extend(image for image in fallback.get("images", []) if image not in images)

    # Target exposes reliable price and gallery details in rendered text/meta but no JSON-LD.
    if "target.com" in url:
        text = soup.get_text(" ", strip=True)
        match = re.search(r"\$([0-9]+(?:\.[0-9]{2})?)", text)
        if match:
            price = float(match.group(1))
        title = title or clean_text(soup.select_one("h1"))
        description_node = soup.select_one('[data-test="item-details-description"]')
        description = clean_text(description_node) or description

    if not title or not price or not description or not images:
        missing = [key for key, value in (("title", title), ("price", price), ("description", description), ("images", images)) if not value]
        raise ValueError(f"{url}: missing {', '.join(missing)}")

    source_slug = urlparse(url).path.rstrip("/").split("/")[-1]
    slug = slugify(title)
    is_coffee = any(word in title.lower() for word in ("coffee", "espresso", "café", "cafe", "moccamaster", "jura"))
    category = "Coffee & Espresso Machines" if is_coffee else "Outdoor Living"
    if "mower" in title.lower() or "zero turn" in title.lower():
        category = "Lawn Mowers"
    elif "swing set" in title.lower() or "playset" in title.lower():
        category = "Playsets"
    elif "gazebo" in title.lower() or "pergola" in title.lower():
        category = "Gazebos & Pergolas"

    return {
        "id": f"{IMPORT_TAG}-{hashlib.sha1(url.encode()).hexdigest()[:16]}",
        "slug": slug,
        "title": title[:240],
        "description": description,
        "price": round(float(price), 2),
        "images_remote": images[:6],
        "condition": "Brand New",
        "category": category,
        "brand": fallback.get("brand") or detect_brand(title, product),
        "currency": "USD",
        "source_url": url,
        "source_slug": source_slug,
    }


def zimgoody_urls(limit: int = 24) -> list[str]:
    urls = []
    for page in range(1, 8):
        url = f"https://zimgoody.com/shop/page/{page}/?orderby=popularity"
        soup = BeautifulSoup(requests.get(url, headers=HEADERS, timeout=35).text, "html.parser")
        for anchor in soup.select('a[href*="zimgoody.com/product/"]'):
            product_url = anchor.get("href", "").split("?")[0]
            if product_url and product_url not in urls:
                urls.append(product_url)
            if len(urls) >= limit:
                return urls
    return urls


def api_headers(extra: dict | None = None) -> dict:
    values = {"apikey": SERVICE_KEY, "Authorization": f"Bearer {SERVICE_KEY}"}
    values.update(extra or {})
    return values


def database_defaults() -> tuple[str, str | None]:
    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/products?select=payee_email,seller_id&checkout_flow=eq.stripe&limit=1",
        headers=api_headers(), timeout=30,
    )
    response.raise_for_status()
    rows = response.json()
    if not rows:
        raise RuntimeError("Takimia needs at least one Stripe product to provide the existing payee/seller defaults")
    return rows[0].get("payee_email") or "", rows[0].get("seller_id")


def download_image(url: str) -> tuple[bytes, str, str]:
    response = requests.get(url, headers=HEADERS, timeout=45)
    response.raise_for_status()
    content_type = response.headers.get("content-type", "image/jpeg").split(";")[0]
    if not content_type.startswith("image/"):
        raise ValueError(f"Not an image: {url} ({content_type})")
    suffix = mimetypes.guess_extension(content_type) or Path(urlparse(url).path).suffix or ".jpg"
    if suffix == ".jpe":
        suffix = ".jpg"
    return response.content, content_type, suffix


def upload_images(product: dict) -> list[str]:
    public_urls = []
    errors = []
    for index, remote_url in enumerate(product.pop("images_remote")):
        try:
            data, content_type, suffix = download_image(remote_url)
            storage_path = f"{product['slug']}/img{index + 1}{suffix}"
            response = requests.post(
                f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{storage_path}",
                headers=api_headers({"Content-Type": content_type, "x-upsert": "true"}),
                data=data,
                timeout=60,
            )
            response.raise_for_status()
            public_urls.append(f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{storage_path}")
        except Exception as exc:
            errors.append(str(exc))
        if len(public_urls) >= 4:
            break
    if not public_urls:
        raise RuntimeError(f"No image could be uploaded for {product['title']}: {'; '.join(errors)}")
    return public_urls


def upsert(product: dict, payee_email: str, seller_id: str | None) -> None:
    source_url = product.pop("source_url")
    product.pop("source_slug", None)
    product["images"] = upload_images(product)
    product.update({
        "rating": 0,
        "review_count": 0,
        "reviews": [],
        "payee_email": payee_email,
        "checkout_link": "",
        "checkout_flow": "stripe",
        "in_stock": True,
        "is_featured": False,
        "published": True,
        "seller_id": seller_id,
        "collections": ["coffee-machines"] if "Coffee" in product["category"] else [slugify(product["category"])],
        "meta": {
            "published": True,
            "gmc_enabled": False,
            "targetMarket": "us",
            "source": source_url,
            "import_batch": IMPORT_TAG,
        },
    })
    response = requests.post(
        f"{SUPABASE_URL}/rest/v1/products?on_conflict=slug",
        headers=api_headers({"Content-Type": "application/json", "Prefer": "resolution=merge-duplicates,return=minimal"}),
        data=json.dumps(product), timeout=45,
    )
    response.raise_for_status()


def main() -> None:
    if not SUPABASE_URL or not SERVICE_KEY:
        raise RuntimeError("Missing Takimia Supabase environment variables")
    urls = EXPLICIT_URLS + zimgoody_urls(24)
    if len(urls) != 40 or len(set(urls)) != 40:
        raise RuntimeError(f"Expected 40 unique URLs, found {len(set(urls))}")
    products = []
    failures = []
    for index, url in enumerate(urls, 1):
        try:
            product = scrape_product(url)
            products.append(product)
            print(f"scraped {index}/40: {product['title']} — ${product['price']:.2f} — {len(product['images_remote'])} image(s)")
        except Exception as exc:
            failures.append(str(exc))
            print(f"FAILED {index}/40: {exc}", file=sys.stderr)
    if failures:
        Path("data").mkdir(exist_ok=True)
        Path("data/takimia-import-failures.txt").write_text("\n".join(failures), encoding="utf-8")
        raise RuntimeError(f"Scrape validation failed for {len(failures)} product(s)")
    Path("data").mkdir(exist_ok=True)
    Path("data/takimia-requested-40-products.json").write_text(json.dumps(products, indent=2), encoding="utf-8")
    if "--dry-run" in sys.argv:
        print("Dry run complete; no database changes made")
        return
    payee_email, seller_id = database_defaults()
    for index, product in enumerate(products, 1):
        upsert(product, payee_email, seller_id)
        print(f"imported {index}/40: {product['title']}")
        time.sleep(0.05)
    print("Import complete: 40 products, all with GMC disabled")


if __name__ == "__main__":
    main()
