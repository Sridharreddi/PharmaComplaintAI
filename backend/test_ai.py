from app.ai.graph import graph

result = graph.invoke(
    {
        "description": """
Customer received Paracetamol tablets.
The blister pack was broken and several tablets were damaged.
Customer requested replacement.
"""
    }
)

print(result)