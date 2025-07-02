import requests
from collections import defaultdict, Counter
from datetime import datetime, timedelta, timezone

def fetch_github_data(username):
    # 1. API Calls
    event_url = f"https://api.github.com/users/{username}/events/public"
    repo_url = f"https://api.github.com/users/{username}/repos"
    events = requests.get(event_url).json()
    repos = requests.get(repo_url).json()

    # 2. Weekly activity
    today = datetime.now(timezone.utc)
    dates = [(today - timedelta(days=i)).date().isoformat() for i in range(7)]

    activity = defaultdict(lambda: {"push": 0, "pr": 0, "issues": 0})
    for event in events:
        date = event['created_at'][:10]
        if date in dates:
            if event['type'] == "PushEvent":
                activity[date]['push'] += 1
            elif event['type'] == "PullRequestEvent":
                activity[date]['pr'] += 1
            elif event['type'] == "IssuesEvent":
                activity[date]['issues'] += 1

    # 3. Language Count
    lang_count = Counter()
    for repo in repos:
        lang = repo.get('language')
        if lang:
            lang_count[lang] += 1

    # 4. Recent Events
    recent = [
        {
            "type": e["type"],
            "repo": e["repo"]["name"],
            "date": e["created_at"]
        }
        for e in events[:5]
    ]

    return {
        "username": username,
        "total_repos": len(repos),
        "top_languages": lang_count.most_common(3),
        "weekly_activity": [
            {"date": d, **activity[d]} for d in sorted(activity.keys())
        ],
        "recent_events": recent
    }
