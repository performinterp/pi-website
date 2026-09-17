"""Build public/email/venue-listing.eml from public/email/venue-listing.html.

Images are embedded as inline (CID) parts so the email shows them without
"download external images" prompts. Re-run after editing the HTML:
    python3 scripts/build-venue-email-eml.py
"""
import mimetypes
import re
from email.message import EmailMessage
from email.policy import SMTP
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "public" / "email"
BASE = "https://performanceinterpreting.co.uk/email/venue-listing/"
SUBJECT = "Help Deaf audiences find more of your events (free listing on PI Events)"
TEXT = """Hi there,

The PI Events app is a free app where Deaf customers find events with BSL and ISL interpreters.

At the moment, most events only appear in the app once an interpreter has been booked. We'd love to list all of your upcoming events, so Deaf customers can see what's on and ask for an interpreter for the shows they want to go to.

It's completely free for your venue, and every listing is also shared on our Instagram and Facebook.

Events without an interpreter yet are marked "Request Interpreter". Requests go to your access team, with us copied in, and we can arrange the interpreters.

All we need from you:
- Your events page link, or a list of upcoming events
- Your access team's email, for requests
- Whether you hold accessible seats for BSL users

Just reply to this email with your events page link or upcoming dates, and we'll do the rest.

Many thanks,
The Performance Interpreting team
"""

html = (ROOT / "venue-listing.html").read_text()
html = html.replace('<meta name="robots" content="noindex, nofollow">\n', "")
cids = {}
# Simple IDs: some Outlook builds fail to resolve CIDs containing hyphens/dots.
for i, name in enumerate(sorted(set(re.findall(re.escape(BASE) + r"([\w\-.]+)", html))), 1):
    cid = f"img{i}@piemail"
    cids[name] = f"<{cid}>"
    html = html.replace(BASE + name, "cid:" + cid)
if BASE in html:
    raise SystemExit("Unreplaced image URL left in HTML")

msg = EmailMessage()
msg["Subject"] = SUBJECT
msg["X-Unsent"] = "1"  # Outlook for Windows opens this as a new, sendable message
msg.set_content(TEXT)
msg.add_alternative(html, subtype="html")
html_part = msg.get_payload()[1]
for name, cid in cids.items():
    maintype, subtype = mimetypes.guess_type(name)[0].split("/")
    html_part.add_related((ROOT / "venue-listing" / name).read_bytes(), maintype, subtype,
                          cid=cid, filename=name, disposition="inline")

out = ROOT / "venue-listing.eml"
out.write_bytes(msg.as_bytes(policy=SMTP))
print(f"{out} — {len(cids)} images embedded, {out.stat().st_size // 1024} KB")
