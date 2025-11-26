# Polymorphic Entities (Schema)

The schema below will be implemented using STI.


```sql
model User 
    id - big-integer 
    username - string 
    password - string
    email - string
    createdAt - string 
    updatedAt - string 

model Comment 
    id - big-integer 
    body - string 
    userId - User.id 

    commentableType - string 
    commentableId - string 

    @commentable - Photo | Video | Audio  

model Photo 
    id - big-integer
    title - string 
    caption - string 
    widthPX - integer
    heightPX - integer 
    resolution - integer

    @comments - Comment[]
    @tags - Tags[]

    createdAt - timestamp 
    updatedAt - timestamp 


model Video 
    id - big-integer
    title - string 
    caption - string 
    widthPX - integer
    heightPX - integer 
    resolution - integer

    @comments - Comment[]
    @tags - Tags[]

    createdAt - timestamp 
    updatedAt - timestamp 

model Audio 
    id - big-integer
    title - string 
    caption - string 
    widthPX - integer
    heightPX - integer 
    resolution - integer

    @comments - Comment[]
    @tags - Tags[]

    createdAt - timestamp 
    updatedAt - timestamp 

model Tag 
    id - big-integer 
    name - string 

    @taggables - Array<Photo | Audio | Video> via Tagging(@tag, @taggable)

model Tagging 
    id - big-integer 
    name - string 

    @tagging - Tag 
    @taggable - Audio | Photo | Comment 

    createdAt - string 
    updatedAt - string 
```