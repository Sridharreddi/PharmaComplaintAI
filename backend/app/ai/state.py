from typing import TypedDict


class ComplaintState(TypedDict):
    description: str

    summary: str

    category: str

    priority: str

    severity: str

    recommended_action: str