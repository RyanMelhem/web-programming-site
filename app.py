"""
Web Programming — Flask application (Week 4).

Download this file from e-learning and REPLACE all the contents of your existing
app.py with it. Then run your app as usual.

WHAT THIS FILE DOES (the "black box" for this week)
---------------------------------------------------
It adds the "Engineering Student Profile" form. You do NOT need to understand this
code yet — server-side form handling is taught in a later session. For now:

  GET  /submit-profile   -> shows your form   (you build templates/profile_form.html)
  POST /submit-profile   -> reads the submitted data and shows your profile page
                            (renders templates/profile.html, which extends your
                             base.html so it appears in YOUR design / CSS)

HOW THE DATA REACHES THE PROFILE PAGE
-------------------------------------
When the form is submitted, this route reads every field the form sends and hands
it to profile.html. Three variables are available inside profile.html:

  data      -> a dictionary of all single-value fields, keyed by the field `name`,
               e.g. data['fullname'], data['student_id'], data['email'],
               data['major'], data['gpa'], data['project_title'], ...
  skills    -> a LIST of the ticked "skills" checkboxes
  software  -> a LIST of the selected "software" options (from the multiple <select>)

Note: `skills` and `software` can hold several values, so they are read as lists.
Every other field is a single value inside `data`.

Example inside profile.html (which extends your base.html):

  <h1>{{ data['fullname'] }}</h1>
  <p>{{ data['major'] }}</p>
  <p>Skills: {{ skills | join(', ') }}</p>
  <p>Software: {{ software | join(', ') }}</p>
"""

import os
import base64
import hashlib

from flask import Flask, render_template, request
from validators import validate_profile, HEXCOLOR

app = Flask(__name__)


# ---- Security headers (Week 11: defence in depth) --------------------------
# The two quiz pages use small inline onclick="..." handlers. Instead of allowing
# ALL inline JavaScript, the CSP allows only these exact handlers, by their hash.
_ALLOWED_HANDLERS = ["goFirst()", "goPrevious()", "goNext()", "goLast()", "submitQuiz()"]
_HANDLER_HASHES = " ".join(
    "'sha256-" + base64.b64encode(hashlib.sha256(h.encode()).digest()).decode() + "'"
    for h in _ALLOWED_HANDLERS
)
CSP = (
    "default-src 'self'; "
    "script-src 'self' 'unsafe-hashes' " + _HANDLER_HASHES + "; "
    "style-src 'self' 'unsafe-inline'; "     # the pages use inline style="" / <style>
    "img-src 'self' data:; "
    "object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
)


@app.after_request
def add_security_headers(response):
    response.headers["Content-Security-Policy"] = CSP
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-Frame-Options"] = "DENY"
    # Browsers only apply HSTS over HTTPS (Render); it is ignored on http://127.0.0.1.
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

from quiz_api import init_quiz
init_quiz(app)

# Links shown on the home page and on the plain Week 1 page.
WEEKLY_WORK = [
    {"week": 1, "title": "Original portfolio home page (plain HTML)", "url": "/week1"},
    {"week": 2, "title": "History of the Internet", "url": "/internet-history"},
    {"week": 2, "title": "History of the Web", "url": "/web-history"},
    {"week": 2, "title": "History of the Internet (AI)", "url": "/internet-history-ai"},
    {"week": 2, "title": "History of the Web (AI)", "url": "/web-history-ai"},
    {"week": 3, "title": "Templates and Responsive Design", "url": "/week3"},
    {"week": 4, "title": "Engineering Student Profile", "url": "/submit-profile"},
    {"week": 5, "title": "JavaScript app", "url": "/quiz"},
    {"week": 6, "title": "Student Profile with Review Step", "url": "/profile-review"},
    {"week": 7, "title": "Live Quiz with Fetch", "url": "/live-quiz"},
    {"week": 8, "title": "Validate the Profile Form on the Server", "url": "/profile-validated"},
]


@app.route("/")
def home():
    """Serve the portfolio home page."""
    return render_template("index.html", weekly_work=WEEKLY_WORK)


@app.route("/week1")
def week1():
    """Week 1: the original plain-HTML home page, with no CSS."""
    return render_template("week1.html", weekly_work=WEEKLY_WORK)


@app.route("/week3")
def week3():
    """Week 3: base.html template inheritance and the responsive design system."""
    return render_template("week3.html")


@app.route("/internet-history")
def internet_history():
    return render_template("internet-history.html")


@app.route("/web-history")
def web_history():
    return render_template("web-history.html")


@app.route("/internet-history-ai")
def internet_history_ai():
    return render_template("internet-history-ai.html")


@app.route("/web-history-ai")
def web_history_ai():
    return render_template("web-history-ai.html")


@app.route("/submit-profile", methods=["GET", "POST"])
def submit_profile():
    """
    GET  -> show the profile form (you build templates/profile_form.html).
    POST -> read the submitted fields and show the profile page
            (templates/profile.html, which extends your base.html).
    """
    if request.method == "POST":
        data = request.form.to_dict()                   # all single-value fields
        # Week 11 fix: profile.html puts the colour inside a <style> block, where
        # HTML escaping is not enough (CSS injection). Only allow a real #rrggbb colour.
        if "project_color" in data and not HEXCOLOR.match(data["project_color"]):
            data["project_color"] = "#336699"
        skills = request.form.getlist("skills")         # checkboxes -> list
        software = request.form.getlist("software")     # multiple <select> -> list
        return render_template(
            "profile.html", data=data, skills=skills, software=software
        )

    # First visit (GET): just show the empty form.
    return render_template("profile-form.html")

@app.route("/profile-review")
def profile_review():
    """Week 6: the same profile form, with the JavaScript review step."""
    return render_template("profile-form-review.html")

@app.route("/profile-validated", methods=["GET", "POST"])
def profile_validated():
    """Week 8: the profile form, validated on the server."""
    if request.method == "POST":
        errors, cleaned = validate_profile(request.form)
        if errors:
            # something's wrong -> re-show the FORM with errors + what was typed
            return render_template(
                "profile-form-validated.html",
                errors=errors,
                data=request.form,
                sel_skills=request.form.getlist("skills"),
                sel_software=request.form.getlist("software"),
            )
        # all good -> show the profile
        return render_template("profile.html", data=cleaned,
                               skills=cleaned.get("skills", []),
                               software=cleaned.get("software", []))
    # first visit (GET): empty form
    return render_template("profile-form-validated.html",
                           errors={}, data={}, sel_skills=[], sel_software=[])


@app.route("/quiz", methods=["GET", "POST"])
def quiz():
    return render_template("quiz.html")


if __name__ == "__main__":
    # Week 11 fix: debug only when FLASK_DEBUG=1 is set (locally), never hard-coded.
    debug = os.environ.get("FLASK_DEBUG") == "1"
    app.run(host="127.0.0.1", port=5000, debug=debug)