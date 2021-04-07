from pathlib import Path
from flask_login import current_user

ROLEFILES = {
    "unregistered": {
        "html": ["registration_modal/auth_modal.html"],
        "js": ["registration_modal/auth_modal.js"],
    },
    "registered": {"html": [], "js": []},
    "paid_role": {"html": [], "js": []},
}


class FilterLoader:
    FILTER_DIR = Path(".") / "app/controllers/filters"

    def get_filter(self, filter_request):
        """Getting all filter files from folder
        read it content and return as dictionary"""
        current_dir = self.FILTER_DIR / filter_request / current_user.role

        # Check if filter exist
        if not current_dir.is_dir():
            return None

        # iterate throught all js files in directory
        filter_response = {"html": [], "js": []}
        html_dir = current_dir / "html"
        js_dir = current_dir / "js"

        for html in html_dir.glob("*.html"):
            with html.open() as html_file:
                filter_response["html"].append(html_file.read())

        for js in js_dir.glob("*.js"):
            with js.open() as js_file:
                filter_response["js"].append(js_file.read())

        # additional role depend files load
        for html in ROLEFILES[current_user.role]["html"]:
            html = current_dir / html
            with html.open() as html_file:
                filter_response["html"].append(html_file.read())

        for js in ROLEFILES[current_user.role]["js"]:
            js = current_dir / js
            with js.open() as js_file:
                filter_response["js"].append(js_file.read())

        return filter_response


filter_loader = FilterLoader()
