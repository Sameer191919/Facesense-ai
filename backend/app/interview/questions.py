from fastapi import APIRouter, Query
import random

router = APIRouter()

# =====================================================
# HR QUESTION BANK (12 Questions)
# =====================================================

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
    "Can you describe a failure and what you learned from it?",
    "Why should we hire you for this position?"
]

# =====================================================
# TECHNICAL QUESTION BANKS (10+ EACH)
# =====================================================

TECHNICAL_QUESTIONS = {

    "python": [
        "What is the difference between a list and a tuple in Python?",
        "Explain Python decorators.",
        "How does memory management work in Python?",
        "What are Python generators?",
        "Explain the concept of list comprehensions.",
        "What is the difference between deep copy and shallow copy?",
        "What are Python lambda functions?",
        "Explain exception handling in Python.",
        "What is the GIL in Python?",
        "How does Python handle multithreading?"
    ],

    "java": [
        "What is the difference between JDK, JRE, and JVM?",
        "Explain method overloading and overriding in Java.",
        "What is garbage collection in Java?",
        "What are Java interfaces?",
        "Explain the concept of OOP in Java.",
        "What is the difference between abstract class and interface?",
        "What is exception handling in Java?",
        "What are Java collections?",
        "What is multithreading in Java?",
        "Explain the concept of inheritance in Java."
    ],

    "javascript": [
        "What is the difference between var, let, and const?",
        "Explain closures in JavaScript.",
        "What is event bubbling?",
        "What is the difference between == and ===?",
        "Explain promises in JavaScript.",
        "What is asynchronous programming?",
        "What are arrow functions?",
        "Explain the DOM in JavaScript.",
        "What is hoisting?",
        "What is the difference between null and undefined?"
    ],

    "c": [
        "What is the difference between malloc and calloc?",
        "Explain pointers in C.",
        "What is segmentation fault?",
        "What is the difference between stack and heap memory?",
        "Explain structures in C.",
        "What is the use of header files?",
        "What are function pointers?",
        "What is recursion in C?",
        "What is the difference between call by value and call by reference?",
        "Explain dynamic memory allocation."
    ],

    "cpp": [
        "What is the difference between C and C++?",
        "Explain OOP concepts in C++.",
        "What are smart pointers?",
        "What is function overloading?",
        "What is operator overloading?",
        "Explain constructors and destructors.",
        "What is polymorphism?",
        "What is the difference between struct and class?",
        "Explain virtual functions.",
        "What is inheritance in C++?"
    ]
}

# =====================================================
# HELPER: MAP DURATION TO QUESTION COUNT
# =====================================================

def questions_by_duration(minutes: int):
    if minutes == 5:
        return 3
    elif minutes == 10:
        return 5
    elif minutes == 15:
        return 8
    elif minutes == 20:
        return 10
    return 3  # default


# =====================================================
# MAIN INTERVIEW ENDPOINT
# =====================================================

@router.get("/questions")
def get_interview_questions(
    interview_type: str = Query(..., pattern="^(hr|technical)$"),
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
            tech_questions,
            k=min(count, len(tech_questions))
        )

    return {
        "interview_type": interview_type,
        "duration_minutes": duration,
        "technology": technology,
        "questions": questions
    }
