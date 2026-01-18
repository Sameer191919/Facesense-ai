from fastapi import APIRouter, Query
import random

router = APIRouter()

# ==============================
# HR QUESTION BANK (10+)
# ==============================

HR_QUESTIONS = [
    "Can you describe a challenge you faced and how you handled it?",
    "What motivates you to perform well in a professional role?",
    "How do you handle pressure in the workplace?",
    "Can you describe a situation where you worked effectively in a team?",
    "How do you handle constructive feedback?",
    "Can you describe a time when you had to meet a tight deadline?",
    "How do you manage conflicts in a professional environment?",
    "What are your strengths and how do they help you at work?",
    "Can you describe a situation where you showed leadership qualities?",
    "How do you adapt to changes in the workplace?",
    "Can you describe a failure and what you learned from it?"
]

# ==============================
# TECHNICAL QUESTION BANKS (10+ EACH)
# ==============================

TECHNICAL_QUESTIONS = {
    "python": [
        "What is the difference between a list and a tuple in Python?",
        "Explain Python decorators.",
        "How does memory management work in Python?",
        "What are Python generators and their advantages?",
        "Explain the difference between deep copy and shallow copy.",
        "What is the Global Interpreter Lock (GIL)?",
        "How does exception handling work in Python?",
        "What are lambda functions in Python?",
        "Explain list comprehensions with an example.",
        "What is the difference between == and is in Python?"
    ],
    "java": [
        "What is the difference between JDK, JRE, and JVM?",
        "Explain method overloading and overriding in Java.",
        "What is garbage collection in Java?",
        "What is the difference between abstract class and interface?",
        "Explain the concept of multithreading in Java.",
        "What are Java collections?",
        "What is exception handling in Java?",
        "Explain the difference between String, StringBuilder, and StringBuffer.",
        "What is encapsulation in Java?",
        "What is the use of the final keyword in Java?"
    ],
    "javascript": [
        "What is the difference between var, let, and const?",
        "Explain closures in JavaScript.",
        "What is event bubbling?",
        "Explain hoisting in JavaScript.",
        "What is the difference between == and ===?",
        "What are promises in JavaScript?",
        "Explain async and await.",
        "What is the Document Object Model (DOM)?",
        "What is a callback function?",
        "Explain arrow functions in JavaScript."
    ],
    "c": [
        "What is the difference between malloc and calloc?",
        "Explain pointers in C.",
        "What is segmentation fault?",
        "What is the difference between structure and union?",
        "Explain call by value and call by reference.",
        "What is dynamic memory allocation?",
        "What is a dangling pointer?",
        "Explain the use of static variables in C.",
        "What is recursion?",
        "Explain the difference between stack and heap memory."
    ],
    "cpp": [
        "What is the difference between C and C++?",
        "Explain OOP concepts in C++.",
        "What are smart pointers?",
        "What is function overloading?",
        "Explain the difference between struct and class.",
        "What is polymorphism in C++?",
        "Explain constructors and destructors.",
        "What is inheritance in C++?",
        "What is virtual function?",
        "Explain the concept of STL in C++."
    ]
}

# ==============================
# HELPER: QUESTIONS PER DURATION
# ==============================

def questions_by_duration(minutes: int):
    if minutes == 5:
        return 5
    elif minutes == 10:
        return 8
    elif minutes == 15:
        return 12
    return 5  # default


# ==============================
# MAIN INTERVIEW ENDPOINT
# ==============================

@router.get("/questions")
def get_interview_questions(
    interview_type: str = Query(..., regex="^(hr|technical)$"),
    duration: int = Query(..., description="Interview duration in minutes"),
    technology: str = Query(None, description="Required for technical interviews")
):
    count = questions_by_duration(duration)

    if interview_type == "hr":
        questions = random.sample(HR_QUESTIONS, k=min(count, len(HR_QUESTIONS)))

    elif interview_type == "technical":
        if not technology or technology not in TECHNICAL_QUESTIONS:
            return {"error": "Invalid or missing technology"}

        tech_questions = TECHNICAL_QUESTIONS[technology]
        questions = random.sample(
            tech_questions, k=min(count, len(tech_questions))
        )

    return {
        "interview_type": interview_type,
        "duration_minutes": duration,
        "technology": technology,
        "questions": questions
    }
