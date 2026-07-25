from langgraph.graph import StateGraph, END

from app.ai.state import ComplaintState
from app.ai.nodes import analyze_complaint

workflow = StateGraph(ComplaintState)

workflow.add_node("analyze", analyze_complaint)

workflow.set_entry_point("analyze")

workflow.add_edge("analyze", END)

graph = workflow.compile()