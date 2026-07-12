# Auth

1. Auth with gmail/google/github/facebook using clark
2. when frist sing-up, should create an **User Account**
3. there is 3 kinds of **User Account**:
    1. **TEACHER**
    2. **STUDENT**
    3. **PARENT**

# features for `TEACHER` Account

> teachers have a dashboard. everything spacifide features is inside of teacher's dashboard.

## Indivusal:

- create question with `AI`
- create question with `Question Editor`
- browse question and like/comment/shear

## **Organization**:

> A Teacher Account User can create **Organization**. It is a whole system for genarate questions and task manegment and notice board.

1. create **Organization**
2. By deafult, **Organization**'s craetor is got **Principul** rule of **Organization**.
3. **Organization**'s Rules:
    1. TEACHER
    2. ADMIN
    3. PRINCIPUL
4. **ORG_PRINCIPUL** can assing **TEACHER** and **ORG_ADMIN**, and update or delete them. **ORG_ADMIN**s can it as wall.
5. In a **Organization**, there will multipul **ORG_ADMIN**s.
6. In a **Organization**, A **TEACHER** can Assined for one or more Subjects for one or more class.
7. **ORG_PRINCIPUL** can create **Question Bank**, if **ORG_PRINCIPUL** approve, then **ORG_ADMIN** can also create **Question Bank**.

## Qusetion Bank

> Question Bank only can create in a **Organization**. It is like of a Question Holder.

### A Question will be kinds of 3:

- PUBLIC
- PRIVET
- SCHOOL

1. **PUBLIC**:
    - Every one can see the question
    - STUDENT/PARENT can browse them
    - Shear link will be work
2. **PRIVET**:
    - Only The question genarator/subject's teacher can see
    - Shear link will not be work
3. **SCHOOL**:
    - Only **Organization** members/teachers can see
    - Shear link will be work only for **Organization** members/teachers. Others got 401.

### Question Genaration With AI

1. Create Question with ai.
2. Spacifide Question defulties:
    - Easy
    - Normal
    - Hard
3. Spacifide sylabus. uploade sylabus on format:
    - PDF
    - PNG/JPG/JPEG
    - DOCX/DOC
4. If dont have sylabus, manualy Spacifide chapter.
5. Genatate Question With BBangladesh's NCTB Curriculam.
6. AI Must should have access the Bangladesh's Board Books from class 1-10 and HSC, SSC.
7. Teacher can create questions without Board book, by uploading the others books. Book Uploade Format:
    - PDF
    - PNG/JPG/JPEG
    - DOCX/DOC
8. teachers can create question without any books, by prompt to AI.
9. AI Always make an **MD** code. teacher preview the md as question in the platfrom
10. AI Genarated Question is editable in Question editor

### Question Editor

> If the user don't want to Question Genaration With AI Then, It solve the problem

1. There war an **Question Edetor** Were teachers can create question by heand.
2. Inside of the **Question Edetor**, There was an **book**. the teacher create question from the **book**, teachers can capy text from the book.
3. when tescher writing, some AI Suggestions appare on top of the cursor.
4. Teacher Can create:
    - **Heading Text** (h1,h2,h3,h4...)
    - **Aling Text**
    - **Underline Text**
    - **Bold Text**
    - **Color text**
    - **List**:
        - Ordered
        - Disordered
    - **Nasted List**
    - **Italic Text**
    - **Cut Text**
    - **Line**
    - **Table**
    - **sup/sub text/numbers**
5. teacher can append img in question
6. teacher can append diffarents icons from inside of the platform
7. there should be some pre defind Question's layouts, teacher can edit the layout or start from scrach
8. there should be some pre defind Question's components like:
    - A single **MCQ** question's modle with damo data.
    - multipul **MCQ** question's layouts with damo data.
    - **CQ** question's modle/layouts with damo data
    - Others.
9. Teacher can export the question on format:
    - PDF
    - DOCX/DOC
    - PNH/JPG/JPRG
10. the hend made question is same to ai made question for:
    - browse
    - shear
    - status (PUBLIC/PRIVET/SCHOOL)
    - every thing
11. the bangla laters is must be stable, not broke
12. teacher can change laters font in the platfrom
13. the question editor must should be real-time

## Task Manegment System

> It is a Org only features.

1. A Task Management system for org's member
2. PRINCIPUL and ADMIN can assing task to ORG_TEACHERs.
3. A Task should be contail 3 following property:
    - Assing Date -> by deafult `Date.now()`
    - Title
    - Decription
    - To Assing Teacher's ID
    - Expire Date
    - status
    - feedback -> by defult an empty string
    - Approve Massage -> by defult an empty string
4. PRINCIPUL and ADMIN can `CRUD` the task.
5. Teacher can submit the task with question
6. ADMIN or PRINCIPUL can reviwe that and approve with a Approve Massage / feedback and reassing the task.
7. send Task Notification in teacher's mobile/pc
8. All Tasks can see all of the member of org

## Notice Board

> It is super simple
> It is a Org only features too.

1. ADMIN, PRINCIPUL can create a notice
2. PRINCIPUL and ADMIN can `CRUD` the notice
3. A notice can see All of the member of org
4. A notice should contain:
    - create Date -> by deafult `Date.now()`
    - Title
    - Decription
    - Type: enum -> EVENTS, Others...
    - Others (You will fill up)

## massaging

> Orgnazition's member's can chat betwine in real-time.
> It not impliment by scratch, Rather than I want to use `StreamChat` type pre build solution.

1. The teachers can see all organization's members and can chat them.
2. It is similer For ADMIN and PRINCIPUL as a normal teacher, but there will be a little lable above the ADMIN's and PRINCIPUL's avater: `Admin` or `Principul`.
3. A Group chat also in the platfrom, there all org members can massage to all members, like a WhatsApp groupe.
4. ADMIN and PRINCIPUL can alow or disalow to massage teachers in the groupe
5. they shear pic, video, question.

# features for `STUDENT` and `PARENT` Account

> In DashBoard, there them can just browse question and like/comment/shear.

# Role Permission Matrix

| Permission             | SUPER | ORG_PRINCIPUL | ORG_ADMIN | TEACHER  | STUDENT |
| ---------------------- | :---: | :-----------: | :-------: | :------: | :-----: |
| Generate Questions     |  ✅   |      ✅       |    ✅     |    ✅    |   ❌    |
| Create Question Bank   |  ✅   |      ✅       |   ✅\*    |    ❌    |   ❌    |
| Add/Remove Teachers    |  ✅   |      ✅       |    ✅     |    ❌    |   ❌    |
| Assign Tasks           |  ✅   |      ✅       |    ✅     |    ❌    |   ❌    |
| Post Notices           |  ✅   |      ✅       |    ✅     |    ❌    |   ❌    |
| View Public Questions  |  ✅   |      ✅       |    ✅     |    ✅    |   ✅    |
| View School Questions  |  ✅   |      ✅       |    ✅     |    ✅    |   ❌    |
| View Private Questions |  ✅   |      ✅       |    ✅     | Own only |   ❌    |
| Like/Comment/Share     |  ✅   |      ✅       |    ✅     |    ✅    |   ✅    |

\*ORG_OWNER approval required
