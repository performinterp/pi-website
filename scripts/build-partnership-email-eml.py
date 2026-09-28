"""Build public/email/partnership-intro.eml from public/email/partnership-intro.html.

Images are embedded as inline (CID) parts so the email shows them without
"download external images" prompts. Re-run after editing the HTML:
    python3 scripts/build-partnership-email-eml.py
"""
import mimetypes
import re
from email.message import EmailMessage
from email.policy import SMTP
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "public" / "email"
SITE = "https://performanceinterpreting.co.uk/email/"
# The HTML reuses the venue-listing images alongside its own logo tiles.
FOLDERS = ("venue-listing", "partnership-intro")
SUBJECT = "BSL access for your events, managed from start to finish"
TEXT = """Hi [Name],

I hope you're well.

I'm Christopher Coles, Partnership Manager at Performance Interpreting, and I'm reaching out to explore how we could support [Organisation] with accessible events.

MORE THAN JUST INTERPRETERS
For over 11 years, we've been helping festivals, venues, theatres, arenas and event organisers deliver high-quality BSL access for Deaf audiences across the UK.

We manage the access journey from start to finish, including:
- Specialist performance interpreter sourcing
- Event planning and scheduling
- Liaison with artists, production teams and venues
- Volunteer recruitment and coordination
- Interpreter briefing and preparation
- On-site access management and support
- Post-event feedback and review

You focus on delivering the event. We focus on delivering the access.

WE HELP YOU REACH DEAF AUDIENCES
We have strong connections within the Deaf community and actively promote accessible events through our social channels and our free PI Events customer app, putting your events directly in front of Deaf audiences who might otherwise miss out. The app also includes communication tools that support Deaf customers on the day.

TRUSTED BY LEADING EVENTS & VENUES
Live Nation, The O2, Wembley Stadium, Royal Albert Hall, Southbank Centre, Festival Republic, O2 Academy, Principality Stadium, plus AEG Presents and many more of the UK's major arenas, stadiums, festivals and live entertainment venues.

Most importantly, we're passionate about making sure Deaf audiences feel included, connected and part of the event.

LET'S WORK TOGETHER
Just reply to this email. I'd love a quick conversation about your upcoming events and how we could support you.

Kind regards,
Christopher Coles
Partnership Manager, Performance Interpreting
"""

html = (ROOT / "partnership-intro.html").read_text()
html = html.replace('<meta name="robots" content="noindex, nofollow">\n', "")
files = sorted(set(re.findall(re.escape(SITE) + r"((?:%s)/[\w\-.]+)" % "|".join(FOLDERS), html)))
cids = {}
# Simple IDs: some Outlook builds fail to resolve CIDs containing hyphens/dots.
for i, rel in enumerate(files, 1):
    cid = f"img{i}@piemail"
    cids[rel] = f"<{cid}>"
    html = html.replace(SITE + rel, "cid:" + cid)
if re.search(r'src="https?://', html):
    raise SystemExit("Unreplaced image URL left in HTML")

msg = EmailMessage()
msg["Subject"] = SUBJECT
msg["X-Unsent"] = "1"  # Outlook for Windows opens this as a new, sendable message
msg.set_content(TEXT)
msg.add_alternative(html, subtype="html")
html_part = msg.get_payload()[1]
for rel, cid in cids.items():
    maintype, subtype = mimetypes.guess_type(rel)[0].split("/")
    html_part.add_related((ROOT / rel).read_bytes(), maintype, subtype,
                          cid=cid, filename=Path(rel).name, disposition="inline")

out = ROOT / "partnership-intro.eml"
out.write_bytes(msg.as_bytes(policy=SMTP))
print(f"{out} — {len(cids)} images embedded, {out.stat().st_size // 1024} KB")
