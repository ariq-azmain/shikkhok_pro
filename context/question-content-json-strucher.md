# the question content json strucher

the hole content col in question table is a json obj  
a question content exumple:

```json
{
  "school": {
    "name": "Laboratry high school",
    "font": {
      "wedth": 500,
      "famaly": "Arial"
    },
    "location": "Gazipur"
  },
  "questionType": "MCQ*",
  "note": "Naver alow to scrach in question parper",
  "questions": [
    {
      "type": "MCQ*",
      "points": {
        "1": {
          "question": "the name of the capital of bangladesh -",
          "options": ["Bagdad", "Dhilli", "Dhaka", "Monbi"]
        },
        "2": {
          "question": "BRICS is a -",
          "options": ["Club", "Country", "City", "Organization"]
        },
        "3": {
          "question": "Why Bangladesh is knowne as a green country?",
          "options": [
            "There's sky is green!",
            "There's so many tree",
            "becaus of cow"
          ]
        },
        "4": {
          "question": "Bangladesh is -",
          "state": {
            "i": "vary ugly",
            "ii": "vary green",
            "iii": "vary prety"
          },
          "options": ["i and ii", "i and iii", "ii and iii", "i, ii and iii"]
        }
      }
    },
    {}
  ]
}
```

```json
{
  "school": {
    "name": "ল্যাবরেটরি হাই স্কুল",
    "font": {
      "width": 500,
      "family": "Arial"
    },
    "location": "গাজীপুর"
  },
  "questionType": "MCQ",
  "note": "প্রশ্নপত্রে দাগ দেওয়া যাবে না",
  "questions": [
    {
      "type": "MCQ",
      "id": 1,
      "question": "বাংলাদেশের রাজধানীর নাম কী?",
      "options": ["বাগদাদ", "দিল্লি", "ঢাকা", "ম্যানিলা"]
    },
    {
      "type": "MCQ",
      "id": 2,
      "question": "BRICS কী?",
      "options": ["ক্লাব", "দেশ", "শহর", "সংস্থা"]
    },
    {
      "type": "MCQ",
      "id": 3,
      "question": "বাংলাদেশকে কেন সবুজ দেশ বলা হয়?",
      "options": ["এখানকার আকাশ সবুজ!", "এখানে অনেক গাছ আছে", "গরুর কারণে"]
    },
    {
      "type": "MCQ",
      "id": 4,
      "question": "বাংলাদেশ -",
      "statements": {
        "i": "খুবই অসুন্দর",
        "ii": "খুবই সবুজ",
        "iii": "খুবই সুন্দর"
      },
      "options": ["i এবং ii", "i এবং iii", "ii এবং iii", "i, ii এবং iii"]
    }
  ]
}
```

\* it is a Enum, in will be: MCQ|CQ. if any one want to put it both, devid by space like this: "MCQ CQ"
